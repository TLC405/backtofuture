/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  if (typeof window === 'undefined' || !(window as any).aistudio) {
    console.warn("API_KEY environment variable is not set. This might be expected if running on AI Studio platform.");
  }
}

function getFallbackPrompt(decade: string): string {
    return `Create an ultra-photorealistic 8K rendering of the person in this image, seamlessly integrated into a vivid, era-appropriate, and unique iconic scene or legendary building from the ${decade}. Maintain the individual's core facial structure, unique features (e.g., eye shape, nose, mouth, distinct scars/moles if present), and overall recognizable likeness with absolute fidelity. Ensure the transformation seamlessly integrates era-appropriate styles without distorting the original face. Focus on adapting hairstyle, facial hair, and accessories to the decade while preserving the subject's identity. The image must exude cinematic quality, with micro-detailed fabric textures, realistic skin tone with subtle pores, and intricate environmental elements with hyper-realistic material rendering (PBR quality). Utilize dynamic, volumetric lighting with global illumination and subtle ray tracing effects to sculpt the scene and highlight every detail. If applicable, seamlessly integrate decade-appropriate facial hair, headwear, and eyewear that complement the era and the individual's likeness, ensuring they are hyperrealistic and integrated, not pasted-on. The scene should also incorporate a distinct narrative or a subtly humorous element, looking like a meticulously crafted still from a high-budget film. Ensure cultural authenticity and diverse representation, adapting styles and settings based on the individual's appearance in the source photo, focusing on positive and celebrated aspects of the era.`;
}

function extractDecade(prompt: string): string | null {
    const match = prompt.match(/(\d{4}s|Day One|Homeless|Memento)/); 
    return match ? match[1] : null;
}

function processGeminiResponse(response: GenerateContentResponse): string {
    // Check candidates for image
    if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const { mimeType, data } = part.inlineData;
                return `data:${mimeType};base64,${data}`;
            }
        }
    }

    const textResponse = response.text;
    console.error("API did not return an image. Response:", textResponse);
    throw new Error(`The AI model responded with text instead of an image. Details: "${textResponse || 'No text response received.'}"`);
}

async function callGeminiWithRetry(imagePart: object, textPart: object, useProModel: boolean = true): Promise<{response: GenerateContentResponse, warning?: string}> {
    const maxRetries = useProModel ? 5 : 3; // More retries for Pro, fewer for Flash
    const initialDelay = useProModel ? 5000 : 2000; // Longer delay for Pro
    const modelToUse = useProModel ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
    const imageConfig = useProModel ? { aspectRatio: "16:9", imageSize: "2K" } : { aspectRatio: "16:9" };

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: modelToUse, 
                contents: { parts: [imagePart, textPart] },
                config: { imageConfig },
            });
            return {response, warning: useProModel ? undefined : "PRO MODEL EXHAUSTED // BACKUP GENERATOR ENGAGED"};

        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
            const isQuotaError = 
                errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED") ||
                errorMessage.includes("quota") || errorMessage.includes("limit") ||
                (error.code === 429 && error.status === "RESOURCE_EXHAUSTED"); // Specific check for 429 code

            if (isQuotaError && useProModel) {
                console.warn(`Pro Model Quota Exhausted. Attempting Backup Generator (Flash)...`);
                // Immediately try Flash model if Pro fails due to quota
                try {
                    const aiFallback = new GoogleGenAI({ apiKey: process.env.API_KEY });
                    const fallbackResponse = await aiFallback.models.generateContent({
                        model: 'gemini-2.5-flash-image', // Fallback model
                        contents: { parts: [imagePart, textPart] },
                        config: { imageConfig: { aspectRatio: "16:9" } } 
                    });
                    return {response: fallbackResponse, warning: "PRO MODEL EXHAUSTED // BACKUP GENERATOR ENGAGED"};
                } catch (fallbackError: any) {
                    const fallbackMsg = fallbackError instanceof Error ? fallbackError.message : JSON.stringify(fallbackError);
                    console.error("Backup Generator Failed:", fallbackMsg);
                    if (fallbackMsg.includes("429") || fallbackMsg.includes("quota")) {
                         throw new Error("Daily Limit Exceeded. The Time Machine is out of fuel. Please check your billing or try again tomorrow.");
                    }
                    throw new Error(`Backup Generator Failed: ${fallbackMsg}`);
                }
            }

            console.error(`${modelToUse} Attempt ${attempt}/${maxRetries} failed:`, errorMessage);

            // Retry logic for 500/503 errors (and specific 'overloaded' messages)
            const isRetriableError = 
                errorMessage.includes('"code":500') || errorMessage.includes('INTERNAL') ||
                errorMessage.includes('"code":503') || errorMessage.includes('UNAVAILABLE') ||
                errorMessage.includes('overloaded');

            if (isRetriableError && attempt < maxRetries) {
                const delay = initialDelay * Math.pow(1.5, attempt - 1) + (Math.random() * 1000); // Add jitter
                console.log(`Model overloaded. Retrying in ${Math.round(delay)}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            
            throw error; 
        }
    }
    throw new Error("Connection unstable. The Temporal Displacement Field could not be established.");
}

export async function generateDecadeImage(imageDataUrl: string, prompt: string): Promise<{url: string, warning?: string}> {
  const match = imageDataUrl.match(/^data:(image\/\w+)+;base64,(.*)$/);
  if (!match) {
    throw new Error("Invalid image data URL format.");
  }
  const [, mimeType, base64Data] = match;

    const imagePart = {
        inlineData: { mimeType, data: base64Data },
    };

    try {
        const textPart = { text: prompt };
        // Always try Pro model first
        const {response, warning} = await callGeminiWithRetry(imagePart, textPart, true); 
        return {url: processGeminiResponse(response), warning};
    } catch (error) {
        let errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
        
        // Clean up JSON errors for UI display
        if (errorMessage.includes("{")) {
            try {
                if (errorMessage.includes("quota") || errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED")) {
                    errorMessage = "Daily Quota Exceeded. The Time Machine is out of fuel. Please check your billing or try again tomorrow.";
                } else if (errorMessage.includes("503") || errorMessage.includes("overloaded")) {
                    errorMessage = "System Overload. The model is busy. Please wait a moment.";
                } else if (errorMessage.includes("500") || errorMessage.includes("INTERNAL")) {
                    errorMessage = "Temporal Anomaly Detected. Internal System Error.";
                }
            } catch (e) { /* ignore parse error */ }
        }

        const isNoImageError = errorMessage.includes("text instead of an image");

        if (isNoImageError) {
            console.warn("Prompt blocked. Attempting fallback with a generic prompt to avoid safety issues...");
            const decade = extractDecade(prompt);
            if (decade) {
                try {
                    const fallbackPrompt = getFallbackPrompt(decade);
                    const fallbackTextPart = { text: fallbackPrompt };
                    // If primary prompt was blocked, use fallback prompt with Flash model directly
                    const {response: fallbackResponse, warning: fallbackWarning} = await callGeminiWithRetry(imagePart, fallbackTextPart, false); 
                    return {url: processGeminiResponse(fallbackResponse), warning: "Safety Protocol engaged: Content adjusted."};
                } catch (fallbackError) {
                    throw new Error("Visuals Blocked by Safety Protocols. Please adjust your input image or selected decade.");
                }
            }
        }
        
        console.error("Generation failed:", error);
        throw new Error(errorMessage);
    }
}

// Generate TTS Speech
export async function generateWelcomeSpeech(): Promise<string> {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: {
                parts: [{ text: "Great Scott! Welcome to Rewind, by TLC! Prepare to go back in time... with Michael J. Fox!" }]
            },
            config: {
                responseModalities: ["AUDIO"],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Fenrir' } 
                    }
                }
            }
        });

        if (response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
            return response.candidates[0].content.parts[0].inlineData.data;
        }
        return ""; // Fail silently for TTS
    } catch (e) {
        console.warn("TTS Failed", e);
        return "";
    }
}