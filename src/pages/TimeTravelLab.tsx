
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { generateDecadeImage } from '../services/geminiService';
import { DECADES, AESTHETICS, constructPrompt } from '../data/epochs';
import { LabHeader } from '../components/lab/LabHeader';
import { ControlPanel } from '../components/lab/ControlPanel';
import { ResultView } from '../components/lab/ResultView';
import { MusicPlayer } from '../components/lab/MusicPlayer';

type ImageStatus = 'pending' | 'done' | 'error';
interface GeneratedImage {
    status: ImageStatus;
    url?: string;
    error?: string;
    warning?: string;
}

export default function TimeTravelLab() {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [generatedImages, setGeneratedImages] = useState<Record<string, GeneratedImage>>({});
    const [appState, setAppState] = useState<'idle' | 'generating' | 'results-shown'>('idle');
    
    // State for selections
    const [selectedDecade, setSelectedDecade] = useState<string>(DECADES[0]);
    const [selectedAesthetic, setSelectedAesthetic] = useState<string>(AESTHETICS[0].id);

    const handleImageUpload = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setUploadedImage(reader.result as string);
            setAppState('idle');
            toast.success("Subject Locked. Select Era & Style.");
        };
        reader.readAsDataURL(file);
    };

    const handleGenerate = async () => {
        if (!uploadedImage) {
            toast.error("Upload subject first.");
            return;
        }

        setAppState('generating');
        
        // Reset specific key for clean state logic
        setGeneratedImages(prev => ({ ...prev, [selectedDecade]: { status: 'pending' } }));

        // Construct dynamic prompt based on mixing choices
        const prompt = constructPrompt(selectedDecade, selectedAesthetic);
        
        try {
            const result = await generateDecadeImage(uploadedImage, prompt);
            setGeneratedImages(prev => ({ ...prev, [selectedDecade]: { status: 'done', ...result } }));
        } catch (error: any) {
            setGeneratedImages(prev => ({ ...prev, [selectedDecade]: { status: 'error', error: error.message } }));
        }

        setAppState('results-shown');
    };

    const handleDownload = async (decade: string) => {
        const image = generatedImages[decade];
        if (image?.status === 'done' && image.url) {
            const link = document.createElement('a');
            link.href = image.url;
            link.download = `RewindRemix-${decade}-${selectedAesthetic}.jpg`;
            link.click();
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col overflow-hidden">
            <Helmet>
                <title>Studio Noir | Remix Lab</title>
                <meta name="theme-color" content="#050505" />
            </Helmet>
            
            <LabHeader />

            {/* Main Workspace - No Margins, Full Height */}
            <div className="flex-1 flex flex-col lg:flex-row pt-20 h-screen">
                
                {/* Left: Control Deck */}
                <div className="w-full lg:w-96 z-20 flex-shrink-0 bg-background/50 border-r border-white/5 backdrop-blur-xl">
                    <ControlPanel 
                        appState={appState}
                        uploadedImage={uploadedImage}
                        onImageUpload={handleImageUpload}
                        onGenerate={handleGenerate}
                        selectedDecade={selectedDecade}
                        onSelectDecade={setSelectedDecade}
                        selectedAesthetic={selectedAesthetic}
                        onSelectAesthetic={setSelectedAesthetic}
                    />
                </div>

                {/* Right: Viewport */}
                <div className="flex-1 bg-black relative z-10">
                    <ResultView
                        selectedDecade={selectedDecade}
                        generatedImages={generatedImages}
                        decades={DECADES}
                        onSelectDecade={setSelectedDecade}
                        onDownload={handleDownload}
                    />
                </div>
            </div>
            
            <MusicPlayer 
                trackTitle="Nightcall (Remix)"
                artist="Singularity"
                audioSrc="https://actions.google.com/sounds/v1/science_fiction/digital_world.ogg"
                albumArt="https://picsum.photos/seed/noir/200"
            />
        </div>
    );
}
