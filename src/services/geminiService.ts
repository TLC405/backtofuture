
import { GoogleGenAI } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";

// Helper to extract image data or throw if only text is returned
function processGeminiResponse(response: GenerateContentResponse): string {
    if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const { mimeType, data } = part.inlineData;
                return `data:${mimeType};base64,${data}`;
            }
        }
    }
    const textResponse = response.text;
    throw new Error(`AI responded with text: "${textResponse || 'No text received.'}"`);
}

// Internal function to handle the API call with dynamic client initialization
async function callGeminiApi(modelName: 'gemini-3-pro-image-preview' | 'gemini-2.5-flash-image', imagePart: object, textPart: object) {
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
        throw new Error("API_KEY environment variable is not set. Please check your configuration.");
    }
    
    // Initialize client here to ensure we use the latest key and avoid top-level load crashes
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    // 16:9 is the supported landscape aspect ratio for these models
    const imageConfig = modelName === 'gemini-3-pro-image-preview'
        ? { aspectRatio: "16:9", imageSize: "2K" }
        : { aspectRatio: "16:9" };
    
    return await ai.models.generateContent({
        model: modelName,
        contents: { parts: [imagePart, textPart] },
        config: { 
            imageConfig,
        },
    });
}

// Public export used by the UI
export async function generateDecadeImage(imageDataUrl: string, prompt: string): Promise<{url: string, warning?: string}> {
    const match = imageDataUrl.match(/^data:(image\/\w+)+;base64,(.*)$/);
    if (!match) throw new Error("Invalid image data URL.");
    
    const [, mimeType, base64Data] = match;
    const imagePart = { inlineData: { mimeType, data: base64Data } };
    const textPart = { text: prompt };

    try {
        const response = await callGeminiApi('gemini-3-pro-image-preview', imagePart, textPart);
        return { url: processGeminiResponse(response) };
    } catch (error: any) {
        console.warn("Gemini Pro failed:", error.message);
        const isQuotaError = error.status === 'RESOURCE_EXHAUSTED' || error.message?.includes("429");
        
        if (isQuotaError) {
             try {
                console.log("Attempting fallback to Flash model...");
                const response = await callGeminiApi('gemini-2.5-flash-image', imagePart, textPart);
                return { 
                    url: processGeminiResponse(response),
                    warning: "PRO MODEL EXHAUSTED // BACKUP GENERATOR ENGAGED"
                };
            } catch (fallbackError: any) {
                console.error("Flash model fallback also failed:", fallbackError.message);
                throw new Error("All generation models are currently unavailable.");
            }
        }
        throw new Error(`Generation failed: ${error.message || 'Unknown error'}`);
    }
}
