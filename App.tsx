/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, ChangeEvent, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateDecadeImage, generateWelcomeSpeech } from './services/geminiService';
import PolaroidCard from './components/PolaroidCard';
// Import createShareableCard for generating social media cards
import { createAlbumImage, createShareableCard } from './lib/albumUtils';
import MusicPlayer from './components/MusicPlayer';
import { cn } from './lib/utils';
import { FaTerminal } from 'react-icons/fa';

// UPDATED DECADES ARRAY - 'Memento' replaces 'Now You Are Old'
const DECADES = ['1900s', '1950s', '1960s', '1970s', '1980s', '1990s', 'Day One', 'Homeless', 'Memento'];

type ImageStatus = 'pending' | 'done' | 'error';
interface GeneratedImage {
    status: ImageStatus;
    url?: string;
    error?: string;
    warning?: string; // Added for API fallback messages
}

const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        window.addEventListener('resize', listener);
        return () => window.removeEventListener('resize', listener);
    }, [matches, query]);
    return matches;
};

// LEGENDARY ATOMIC PROMPTS - PROTAGONIST PROTOCOL & SENSORY OVERLOAD EDITION
const decadePrompts: Record<string, string> = {
    '1900s': "MASTER COMMAND: The subject (from the photo) is the UNDISPUTED PROTAGONIST of this scene. All celebrities are secondary; their attention is directed towards the subject. Transport the person to 1905, inside NIKOLA TESLA'S LABORATORY. AESTHETIC: VINTAGE DAGUERREOTYPE PHOTOGRAPH. Shot on orthochromatic film, sepia tone, heavy film grain, visible scratches and dust. NOT A CARTOON. This must look like a real, archival photo. SCENE: Standing next to NIKOLA TESLA and ALBERT EINSTEIN, who are intensely listening to the subject explain a complex theory. COMPLEXITY: Cluttered lab with brass gears, sparking wires, towering electrical apparatus. LIGHTING: Harsh, archival tungsten lighting from exposed bulbs, casting deep shadows. NO NEON BLUE ARCS. SENSORY: Smell of ozone and oiled steel. Clothing: ELEGANT VICTORIAN TWEED SUIT with a gold pocket watch chain. HAIR: Slicked Gentleman's Part or Wild Inventor Hair (Period Accurate). EXPRESSION: Confident, historic, visionary genius. CRITICAL: REMOVE MODERN HEADWEAR. Maintain facial structure with ABSOLUTE FIDELITY (FACE LOCK), specifically preserving NOSE shape.",
    '1950s': "MASTER COMMAND: The subject (from the photo) is the UNDISPUTED PROTAGONIST of this scene. All celebrities are secondary; their attention is directed towards the subject. Transport the person to 1955. DYNAMIC SCENE: Standing CENTER FRAME, shoulder-to-shoulder between Martin Luther King Jr. and Malcolm X at a dimly lit, smoke-filled JAZZ CLUB VIP BOOTH. SIDNEY POITIER is leaning in, captivated by the subject's words. COMPLEXITY: Crystal tumblers on the table with visible condensation, cigarette smoke swirling in cinematic spotlights. SENSORY: Sound of a distant saxophone solo, feel of cool leather from the booth. LIGHTING: Dramatic Chiaroscuro lighting. Clothing: SHARP SHARKSKIN SUIT with a skinny tie. HAIR: GREASER POMPADOUR or Neat Side-Part. EXPRESSION: Charismatic, intellectual leader. CRITICAL: REMOVE MODERN HEADWEAR. Maintain facial structure with ABSOLUTE FIDELITY (FACE LOCK). Vibe: Grainy black and white film stock (Kodak Tri-X 400), cool jazz atmosphere, historic weight. Shot with a 50mm lens, slight chromatic aberration.",
    '1960s': "MASTER COMMAND: The subject (from the photo) is the UNDISPUTED PROTAGONIST of this scene. All celebrities are secondary; their attention is directed towards the subject. Transport the person to 1969, Woodstock main stage. DYNAMIC SCENE: Shredding a Stratocaster CENTER STAGE. JIMI HENDRIX is to the left, visibly impressed. President Richard Nixon is to the right playing a tambourine, completely enthralled. JANIS JOPLIN is in the front row, singing along, looking directly at the subject. COMPLEXITY: Psychedelic liquid light show projected physically onto the subject. Crowd is a sea of thousands. SENSORY: Rumble of the bass through the stage floor, smell of rain on dry earth. LIGHTING: Golden hour sun flaring intensely into an anamorphic lens. Clothing: SUEDE FRINGE VEST, bell-bottoms. HAIR: MASSIVE AFRO or Long Hippie Flow. EXPRESSION: Joyful, legendary rock god. CRITICAL: REMOVE MODERN HEADWEAR. Maintain facial structure with ABSOLUTE FIDELITY (FACE LOCK). Vibe: Vintage Kodachrome, dirty lens, raw texture, 35mm film grain.",
    '1970s': "MASTER COMMAND: The subject (from the photo) is the UNDISPUTED PROTAGONIST of this scene. All celebrities are secondary; their attention is directed towards the subject. Transport the person to 1977, Studio 54 VIP STAGE. DYNAMIC SCENE: The subject is singing into a vintage microphone. CHER is next to them, singing backup harmonies. ELTON JOHN is at a white grand piano, playing FOR the subject. MICK JAGGER is in the front row, wearing a 'TLC' t-shirt, cheering wildly. BOB MARLEY and JIMI HENDRIX are having a guitar duel in the background, inspired by the subject's performance. INTEGRATION: THICK VOLUMETRIC DISCO FOG wrapping around the subject's legs. Colored lighting gels reflecting realistically on skin sweat. SENSORY: Thump of the disco beat, heat from the stage lights. Clothing: WHITE SATIN DISCO SUIT. HAIR: CLASSIC 70s FEATHERED SHAG or MULLET. EXPRESSION: Charismatic superstar. CRITICAL: REMOVE MODERN HEADWEAR. Maintain facial structure with ABSOLUTE FIDELITY (FACE LOCK). Vibe: Concert photography, sweat-slicked realism, star power, 35mm film grain.",
    '1980s': "MASTER COMMAND: The subject (from the photo) is the UNDISPUTED PROTAGONIST of this scene. All celebrities are secondary; their attention is directed towards the subject. Transport the person to 1985, Hill Valley Clock Tower. DYNAMIC SCENE: A HYPER-REALISTIC CINEMATIC SHOT. The subject is CENTER FRAME, flanked by DOC BROWN and MARTY MCFLY like a legendary crew. MICHAEL JACKSON is dancing on the hood of the DeLorean as a tribute to the subject. MICHAEL JORDAN is executing his signature dunk over the car, and EDDIE MURPHY is laughing at a joke the subject just told. COMPLEXITY: Wet asphalt reflecting vibrant neon. Steam rising from grates. Fire trails from the DeLorean’s tires. SENSORY: Crackle of electricity in the air, sound of peeling tires. LIGHTING: Practical sodium-vapor street lamps, blue moonlight, and a dramatic lightning flash. NO CARTOON EFFECTS. Clothing: WHITE MIAMI VICE SUIT. HAIR: STYLISH JHERI CURL. EXPRESSION: The coolest person alive. CRITICAL: REMOVE MODERN HEADWEAR. Maintain facial structure with ABSOLUTE FIDELITY (FACE LOCK). Vibe: Shot on Kodak Vision3 500T film, Anamorphic Lens flare, tangible reality.",
    '1990s': "MASTER COMMAND: The subject (from the photo) is the UNDISPUTED PROTAGONIST of this scene. All celebrities are secondary; their attention is directed towards the subject. Transport the person to 1996, inside the TLC ROW RECORDS STUDIO. DYNAMIC SCENE: The subject is CENTER, sitting on the mixing console, directing the session. Surrounding them, listening for guidance: Tupac, Snoop Dogg, Dr. Dre, Suge Knight, Notorious B.I.G., Jay-Z, and Nas. A TRUCE MOMENT brokered by the subject. COMPLEXITY: Thick smoke haze, SSL 4000 Mixing Board lit up. SENSORY: Smell of stale pizza and studio foam, low hum of the mixing board. Clothing: OVERSIZED TOMMY HILFIGER WINDBREAKER. HAIR: ICONIC KID 'N PLAY HIGH TOP FADE. EXPRESSION: Confident lyrical mastermind, the undisputed leader of the room. CRITICAL: REMOVE MODERN HEADWEAR. Maintain facial structure with ABSOLUTE FIDELITY (FACE LOCK). Vibe: Hype Williams music video, wide angle lens, 35mm film grain.",
    'Day One': "MASTER COMMAND: The subject (from the photo) is the UNDISPUTED PROTAGONIST of this scene. Transport the person to the Dawn of Humanity. DYNAMIC SCENE: Crouched in a muddy cave during a CATACLYSMIC THUNDERSTORM. A SABER-TOOTH TIGER sits calmly next to the subject, respecting their alpha presence. A VOLCANO erupts in the distance. AESTHETIC: RAW NATIONAL GEOGRAPHIC PHOTOGRAPH. DIRTY LENS. Mud splattered on the camera. SENSORY: Feel of cold rain, sound of a distant rockslide. Clothing: Heavy, wet, matted animal furs. HAIR: EXTREMELY LONG, matted, wild prehistoric hair. EXPRESSION: Intense survival instinct, raw power, leader of the pack. CRITICAL: REMOVE MODERN HEADWEAR. Maintain facial structure with ABSOLUTE FIDELITY (FACE LOCK). Vibe: 8K Photorealism, mud, dirt, wetness, imperfection, physically correct lighting, PBR textures, 35mm film grain.",
    'Homeless': "MASTER COMMAND: The subject (from the photo) is the UNDISPUTED PROTAGONIST of this scene. Transport the person to present-day Oklahoma City. DYNAMIC SCENE: Sitting on a crate at a stoplight with the PAYCOM CENTER and SCISSORTAIL PARK SKYDANCE BRIDGE in the immediate background. A LOYAL STRAY DOG is sleeping at their feet. Holding a cardboard sign that CRITICALLY AND CLEARLY READS 'WILL WORK FOR LOVE'. SENSORY: Smell of car exhaust, chill of the wind. LIGHTING: Overcast, flat urban lighting. Clothing: Layered, worn-out oversized coat. HAIR: MATTED, MESSY, OVERGROWN HAIR AND BEARD. ABSOLUTELY NO CLEAN CUTS. EXPRESSION: Weary but hopeful, possessing a quiet dignity that commands respect. CRITICAL: REMOVE MODERN HEADWEAR. SIGN MUST SAY 'WILL WORK FOR LOVE'. Maintain facial structure with ABSOLUTE FIDELITY (FACE LOCK). Vibe: Hyper-realistic street photography (style of Dorothea Lange), poignant social commentary, specific OKC landmarks.",
    'Memento': "MASTER COMMAND: The subject (from the photo) is the UNDISPUTED PROTAGONIST of this scene. Transport the person to the Year 2095. TITLE: MEMENTO MORI. The subject is 95 years old. EXTREME FACELOCK: The underlying skull shape, eye distance, and bone structure MUST be identical to the source, but overlaid with heavy biological aging. TEXTURE: Hyper-realistic dermatology—translucent skin, age spots, deep wrinkles. SCENE: Standing in a futuristic medical gym, having just set a new deadlift record for their age group. SENSORY: Sterile smell of antiseptic, low hum of life support machinery. EXPRESSION: A profound, powerful realization that 'Time waits for no one, but I made it wait for me'. SUBTLE THREAT: The lighting is stark and unforgiving. Vibe: Darkly humorous, biologically accurate, existential victory. Hasselblad medium format portrait, high dynamic range."
};

// Synthwave music track - Using a reliable external source
const audioSrc = 'https://actions.google.com/sounds/v1/science_fiction/digital_world.ogg';

// Master Terminal Component
const MasterTerminal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [selectedTab, setSelectedTab] = useState<string>(DECADES[0]);
    
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/95 z-[150] flex items-center justify-center p-4 backdrop-blur-md"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                    onClick={e => e.stopPropagation()}
                    className="w-full max-w-6xl h-[80vh] terminal-modal border-2 border-[#ffb000] rounded-sm flex flex-col shadow-[0_0_100px_rgba(255,176,0,0.15)] relative overflow-hidden"
                >
                    {/* CRT Glare for Terminal */}
                    <div className="crt-glare"></div>

                    {/* Header */}
                    <div className="terminal-header p-2 px-4 flex justify-between items-center font-mono text-sm uppercase tracking-widest shrink-0 relative z-10">
                        <div className="flex items-center gap-4">
                            <span>TEMPORAL MAINFRAME // BIOS v1.21</span>
                            <span className="hidden md:inline text-xs opacity-50">MEM: 640K OK</span>
                        </div>
                        <button onClick={onClose} className="hover:bg-[#ffb000] hover:text-black px-2 py-1 transition-colors">
                            [X] TERMINATE SESSION
                        </button>
                    </div>

                    <div className="flex flex-1 overflow-hidden relative z-10">
                        {/* Sidebar */}
                        <div className="w-48 md:w-64 border-r border-[#ffb000]/30 bg-black/40 overflow-y-auto shrink-0 flex flex-col font-mono text-xs md:text-sm">
                            <div className="p-3 text-[#ffb000] font-bold border-b border-[#ffb000]/30 bg-[#ffb000]/10">
                                > TARGET_EPOCHS
                            </div>
                            {DECADES.map(decade => (
                                <div 
                                    key={decade}
                                    onClick={() => setSelectedTab(decade)}
                                    className={`p-3 terminal-sidebar-item text-[#ffb000] ${selectedTab === decade ? 'active' : ''}`}
                                >
                                    {decade}
                                </div>
                            ))}
                            <div className="mt-auto p-4 border-t border-[#ffb000]/30">
                                <div className="text-[#ffb000]/50 text-[10px] space-y-2">
                                    <div>FLUX CAPACITOR: <span className="text-green-500">ONLINE</span></div>
                                    <div>TIME CIRCUITS: <span className="text-green-500">ACTIVE</span></div>
                                    <div>PLUTONIUM: <span className="text-red-500">LOW</span></div>
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-10 font-mono relative">
                            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-10 flex items-center justify-center">
                                {/* ASCII Art Placeholder */}
                                <pre className="text-[#ffb000] text-[6px] leading-[6px]">
{`
       _.--.
    .'      '.
   /    /\    \\
  :    /  \    :
  |   /    \   |
  |  /      \  |
  : /        \ ;
   \\        / /
    '._    _.'
       '--'
`}
                                </pre>
                            </div>
                            <div className="relative z-10 max-w-3xl">
                                <h2 className="text-2xl md:text-4xl text-[#ffb000] mb-6 font-bold tracking-tighter border-b-2 border-[#ffb000] inline-block pb-2">
                                    {selectedTab} // GENERATION_MATRIX
                                </h2>
                                
                                <div className="space-y-6">
                                    <div>
                                        <div className="text-[#ffb000]/60 text-xs mb-1 uppercase tracking-wider">Prompt Sequence Data</div>
                                        <div className="terminal-text text-sm md:text-base leading-relaxed bg-black/60 p-4 border border-[#ffb000]/30 shadow-inner">
                                            {decadePrompts[selectedTab]}
                                            <span className="terminal-cursor ml-1"></span>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 mt-8">
                                        <div className="bg-black/40 border border-[#ffb000]/20 p-3">
                                            <div className="text-[10px] text-[#ffb000]/50 mb-1">SYSTEM VARIANCE</div>
                                            <div className="text-green-400 text-lg">0.0003%</div>
                                        </div>
                                        <div className="bg-black/40 border border-[#ffb000]/20 p-3">
                                            <div className="text-[10px] text-[#ffb000]/50 mb-1">TEMPORAL LOCK</div>
                                            <div className="text-green-400 text-lg">SECURE</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

function App() {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [generatedImages, setGeneratedImages] = useState<Record<string, GeneratedImage>>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [appState, setAppState] = useState<'idle' | 'image-uploaded' | 'accelerating' | 'generating' | 'results-shown' | 'api-key-prompt'>('api-key-prompt');
    const [hasSelectedApiKey, setHasSelectedApiKey] = useState<boolean | null>(null);
    const [speed, setSpeed] = useState(0);
    const [showFlash, setShowFlash] = useState(false);
    
    // Animation States
    const [circuitsBooted, setCircuitsBooted] = useState(false);

    // Decade Filtering State - NOW ACTS AS THE MAIN VIEW CONTROLLER
    const [selectedDecadeFilter, setSelectedDecadeFilter] = useState<string>(DECADES[0]);

    const isMobile = useMediaQuery('(max-width: 768px)');

    // Music control states
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const docVoiceRef = useRef<HTMLAudioElement | null>(null);

    // In-memory cache for generated images
    const generatedImageCache = useRef<Map<string, Map<string, GeneratedImage>>>(new Map());

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
    const [modalImageCaption, setModalImageCaption] = useState<string>('');

    // Prompt Inspector Modal State (Single)
    const [promptModalOpen, setPromptModalOpen] = useState(false);
    const [viewingPromptDecade, setViewingPromptDecade] = useState<string | null>(null);

    // MASTER TERMINAL STATE
    const [masterTerminalOpen, setMasterTerminalOpen] = useState(false);

    // Time Circuit States
    const [currentTime, setCurrentTime] = useState(new Date());
    
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const checkApiKey = async () => {
            if (window.aistudio && window.aistudio.hasSelectedApiKey) {
                const isSelected = await window.aistudio.hasSelectedApiKey();
                setHasSelectedApiKey(isSelected);
                if (isSelected) {
                    setAppState('idle');
                    playWelcomeMessage();
                    setTimeout(() => setCircuitsBooted(true), 100);
                } else {
                    setAppState('api-key-prompt');
                }
            } else {
                console.warn("window.aistudio not found. Assuming API key is set via environment variable for local development.");
                setHasSelectedApiKey(true);
                setAppState('idle');
                setTimeout(() => setCircuitsBooted(true), 100);
            }
        };
        checkApiKey();
    }, []);

    const playWelcomeMessage = async () => {
        try {
            const base64Audio = await generateWelcomeSpeech();
            const binaryString = atob(base64Audio);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: 'audio/mp3' });
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            docVoiceRef.current = audio;
            audio.play().catch(e => console.log("Auto-play blocked, waiting for interaction", e));
        } catch (e) {
            console.error("Failed to play welcome message", e);
        }
    };

    useEffect(() => {
        if (!audioRef.current) {
            const audio = new Audio(audioSrc);
            audio.loop = true;
            audio.preload = 'auto';
            audio.volume = volume;
            
            // Add robust error handling
            audio.onerror = (e) => {
                console.warn("Audio source failed to load. Music disabled.", e);
                setIsPlaying(false);
            };

            audioRef.current = audio;
        } else {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const handleToggleMusic = useCallback(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.error("Failed to play audio:", error);
                        setIsPlaying(false);
                    });
                }
            }
            setIsPlaying(!isPlaying);
        }
    }, [isPlaying]);

    const handleVolumeChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    }, []);

    // AUTO-START GENERATION ON UPLOAD
    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (docVoiceRef.current && docVoiceRef.current.paused) {
            docVoiceRef.current.play().catch(() => {});
        }

        if (!hasSelectedApiKey) {
            alert("Please select your API key first!");
            setAppState('api-key-prompt');
            return;
        }

        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const imgData = reader.result as string;
                setUploadedImage(imgData);
                setAppState('image-uploaded');
                setGeneratedImages({});
                generatedImageCache.current.clear();
                setSpeed(0);
                setSelectedDecadeFilter(DECADES[0]); // Reset to first decade
                
                // AUTO INITIATE
                setTimeout(() => {
                    handleAutoGenerate(imgData);
                }, 500);
            };
            reader.readAsDataURL(file);
        }
    };

    const startGeneration = async (currentImage: string) => {
         setIsLoading(true);
         setAppState('generating');
         setShowFlash(false); // Reset flash
         
         const initialImages: Record<string, GeneratedImage> = {};
         DECADES.forEach(decade => {
             initialImages[decade] = { status: 'pending' };
         });
         setGeneratedImages(initialImages);
 
         const concurrencyLimit = 4; // Maximized for Flash model speed
         const decadesQueue = [...DECADES];
 
         const processDecade = async (decade: string) => {
             if (currentImage) {
                 const cachedDecades = generatedImageCache.current.get(currentImage);
                 if (cachedDecades && cachedDecades.has(decade) && cachedDecades.get(decade)?.status === 'done') {
                     const cachedImage = cachedDecades.get(decade);
                     setGeneratedImages(prev => ({
                         ...prev,
                         [decade]: cachedImage!,
                     }));
                     return; 
                 }
             }
 
             try {
                 const prompt = decadePrompts[decade];
                 const { url: resultUrl, warning: generationWarning } = await generateDecadeImage(currentImage, prompt);
                 const newImage: GeneratedImage = { status: 'done', url: resultUrl, warning: generationWarning };
                 setGeneratedImages(prev => ({
                         ...prev,
                         [decade]: newImage,
                     }));
                 if (currentImage) {
                     if (!generatedImageCache.current.has(currentImage)) {
                         generatedImageCache.current.set(currentImage, new Map());
                     }
                     generatedImageCache.current.get(currentImage)?.set(decade, newImage);
                 }
             } catch (err) {
                 const errorMessage = err instanceof Error ? err.message : JSON.stringify(err);
                 if (errorMessage.includes("Requested entity was not found.")) {
                     alert("Your selected API key seems invalid or not from a paid Google Cloud project. Please select a valid API key.");
                     setHasSelectedApiKey(false);
                     setAppState('api-key-prompt');
                     setIsLoading(false); 
                     return;
                 }
                 const errorImage: GeneratedImage = { status: 'error', error: errorMessage };
                 setGeneratedImages(prev => ({
                     ...prev,
                     [decade]: errorImage,
                 }));
                 if (currentImage) {
                     if (!generatedImageCache.current.has(currentImage)) {
                         generatedImageCache.current.set(currentImage, new Map());
                     }
                     generatedImageCache.current.get(currentImage)?.set(decade, errorImage);
                 }
             }
         };
 
         const workers = Array(concurrencyLimit).fill(null).map(async () => {
             while (decadesQueue.length > 0 && hasSelectedApiKey) {
                 const decade = decadesQueue.shift();
                 if (decade) {
                     await processDecade(decade);
                 }
             }
         });
 
         await Promise.all(workers);
 
         setIsLoading(false);
         if (hasSelectedApiKey) { 
             setAppState('results-shown');
         }
    };

    const handleAutoGenerate = async (imgData: string) => {
        setAppState('accelerating');
        
        let currentSpeed = 0;
        const accelerationInterval = setInterval(() => {
            currentSpeed += 2;
            if (currentSpeed >= 88) {
                currentSpeed = 88;
                clearInterval(accelerationInterval);
                setShowFlash(true);
                setTimeout(() => {
                    startGeneration(imgData);
                }, 800); 
            }
            setSpeed(currentSpeed);
        }, 30); 
    };
    
    const handleReset = () => {
        setUploadedImage(null);
        setGeneratedImages({});
        generatedImageCache.current.clear();
        setAppState(hasSelectedApiKey ? 'idle' : 'api-key-prompt');
        setSpeed(0);
        setSelectedDecadeFilter(DECADES[0]);
    };

    const handleDownloadIndividualImage = async (decade: string) => {
        const image = generatedImages[decade];
        if (image?.status === 'done' && image.url) {
            setIsDownloading(true);
            try {
                // Create Premium Shareable Card
                const shareCardDataUrl = await createShareableCard(image.url, decade);
                
                // Convert Data URL to Blob for reliable download
                const res = await fetch(shareCardDataUrl);
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = url;
                link.download = `rewind-${decade}-share.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            } catch (error) {
                console.error("Failed to create or download share card:", error);
                alert("Sorry, there was an error creating your share card. Please try again.");
            } finally {
                setIsDownloading(false);
            }
        }
    };

    const handleDownloadAlbum = async () => {
        if (!hasSelectedApiKey) {
            alert("Please select your API key first!");
            setAppState('api-key-prompt');
            return;
        }
        setIsDownloading(true);
        try {
            const imageData = (Object.entries(generatedImages) as [string, GeneratedImage][])
                .filter(([, image]) => image.status === 'done' && image.url)
                .reduce((acc, [decade, image]) => {
                    acc[decade] = image.url!;
                    return acc;
                }, {} as Record<string, string>);

            if (Object.keys(imageData).length < DECADES.length) {
                alert("Please wait for all images to finish generating before downloading the album.");
                return;
            }

            // Create Premium Image using Canvas
            const albumDataUrl = await createAlbumImage(imageData);
            
            // Convert Data URL to Blob for reliable download
            const res = await fetch(albumDataUrl);
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'rewind-archive.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Failed to create or download album:", error);
            alert("Sorry, there was an error creating your album. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    const handleSelectApiKey = async () => {
        if (window.aistudio && window.aistudio.openSelectKey) {
            await window.aistudio.openSelectKey();
            setHasSelectedApiKey(true);
            setAppState('idle');
            playWelcomeMessage();
            setTimeout(() => setCircuitsBooted(true), 100);
        } else {
            alert("API key selection is not available in this environment.");
            setHasSelectedApiKey(true);
            setAppState('idle');
            playWelcomeMessage();
            setTimeout(() => setCircuitsBooted(true), 100);
        }
    };

    const handleImageClick = useCallback((imageUrl: string, caption: string) => {
        setModalImageUrl(imageUrl);
        setModalImageCaption(caption);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setModalImageUrl(null);
        setModalImageCaption('');
    }, []);

    const handleShowPrompt = (decade: string) => {
        setViewingPromptDecade(decade);
        setPromptModalOpen(true);
    };

    const closePromptModal = () => {
        setPromptModalOpen(false);
        setViewingPromptDecade(null);
    };

    const formatDate = (date: Date) => {
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const month = months[date.getMonth()];
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        const hour = date.getHours();
        const min = date.getMinutes().toString().padStart(2, '0');
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = (hour % 12 || 12).toString().padStart(2, '0');
        return { month, day, year, time: `${displayHour}:${min}`, ampm, rawHour: hour };
    };

    const currentDateDisplay = formatDate(currentTime);

    // FLUX CAPACITOR ANIMATION COMPONENT
    const FluxCapacitor = () => (
        <div className="bg-[#181818] p-4 rounded-lg border-4 border-[#333] shadow-2xl inline-block relative overflow-hidden box-content w-48 h-48 transform scale-90 md:scale-100">
            <div className="absolute inset-0 bg-black/40 z-0"></div>
            {/* Inner box */}
            <div className="relative z-10 w-full h-full bg-[#111] border-2 border-[#444] rounded flex items-center justify-center shadow-[inset_0_0_20px_#000]">
                {/* Center Core */}
                <div className="w-10 h-10 bg-white/10 rounded-full absolute z-20 shadow-[0_0_30px_#fff] animate-pulse border border-white/20"></div>
                {/* Arms */}
                <div className="absolute w-3 h-28 bg-[#222] border-l-2 border-white/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-0 overflow-hidden">
                    <div className="w-full h-full bg-white/80 flux-light"></div>
                </div>
                <div className="absolute w-3 h-28 bg-[#222] border-l-2 border-white/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[120deg] overflow-hidden">
                     <div className="w-full h-full bg-white/80 flux-light" style={{animationDelay: '0.1s'}}></div>
                </div>
                <div className="absolute w-3 h-28 bg-[#222] border-l-2 border-white/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[240deg] overflow-hidden">
                     <div className="w-full h-full bg-white/80 flux-light" style={{animationDelay: '0.2s'}}></div>
                </div>
            </div>
            <div className="mt-2 text-center absolute bottom-2 left-0 right-0">
                <span className="dymo-label text-[10px] scale-75">FLUXING</span>
            </div>
            <div className="panel-screw absolute top-1 left-1"></div>
            <div className="panel-screw absolute top-1 right-1"></div>
            <div className="panel-screw absolute bottom-1 left-1"></div>
            <div className="panel-screw absolute bottom-1 right-1"></div>
        </div>
    );

    // Toggle Switch Component
    const ToggleSwitch = ({ label, isOn }: { label: string, isOn: boolean }) => (
        <div className="flex flex-col items-center gap-2">
            <div className={`w-8 h-12 bg-[#222] border-2 border-[#444] rounded relative shadow-inner ${isOn ? 'shadow-[0_0_5px_lime]' : ''}`}>
                <div className={`w-full h-1/2 bg-[#555] border-t border-white/20 absolute transition-all duration-200 ${isOn ? 'top-0' : 'bottom-0'}`}></div>
            </div>
            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">{label}</span>
        </div>
    );

    // Common boot class for circuits
    const bootClass = circuitsBooted ? "animate-circuit-boot" : "opacity-0";
    // Destination pulse when results shown
    const destPulseClass = appState === 'results-shown' ? "animate-led-pulse" : "";

    return (
        <main className={cn(
            "w-full min-h-screen relative selection:bg-yellow-500 selection:text-black font-mono overflow-x-hidden flex flex-col items-center pb-8 bg-scanline-drift",
            appState === 'accelerating' ? "cockpit-shake" : ""
        )}>
            
            {/* AMBIENT BACKGROUND - CAR INTERIOR */}
            <div className="fixed inset-0 bg-[#020202] z-[-2]"></div>
            <div className="fixed inset-0 z-[-1] opacity-40 pointer-events-none" style={{
                backgroundImage: `radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000 100%)`
            }}></div>
            
            {/* Flash Effect Overlay */}
            {showFlash && <div className="flash-overlay"></div>}

            {/* --- HEADER: OVERHEAD CONSOLE --- */}
            <header className="fixed top-0 left-0 right-0 h-20 bg-carbon border-b-4 border-[#222] z-40 flex items-center justify-between px-4 shadow-xl">
                <div className="flex gap-4 items-center">
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-6 bg-black border border-gray-600 relative overflow-hidden rounded-sm shadow-inner">
                            <div className={`w-1/2 h-full bg-red-600 shadow-[0_0_10px_red] transition-all ${appState !== 'idle' ? 'ml-5' : 'ml-0'}`}></div>
                        </div>
                        <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider hidden md:inline">CIRCUITS</span>
                    </div>
                     <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-6 bg-black border border-gray-600 relative overflow-hidden rounded-sm shadow-inner">
                            <div className={`w-1/2 h-full bg-green-600 shadow-[0_0_10px_lime] transition-all ${speed > 0 ? 'ml-5' : 'ml-0'}`}></div>
                        </div>
                        <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider hidden md:inline">FLUX</span>
                    </div>
                    {/* Extra Switches for Complexity */}
                    <div className="hidden md:flex gap-3 ml-4 border-l border-[#444] pl-4">
                        <ToggleSwitch label="SAFETY" isOn={true} />
                        <ToggleSwitch label="COOLING" isOn={appState !== 'idle'} />
                        <ToggleSwitch label="TEMPORAL" isOn={appState === 'accelerating'} />
                        <ToggleSwitch label="LOCK" isOn={hasSelectedApiKey || false} />
                        <ToggleSwitch label="PWR" isOn={true} />
                    </div>
                </div>
                
                <div className="flex flex-col items-center">
                    <div className="dymo-label text-[10px] md:text-xs tracking-[0.2em] text-yellow-500 scale-90 md:scale-100">TLC TEMPORAL LABS</div>
                    <div className="text-[8px] text-[#555] font-tech tracking-widest mt-1">UNIT: D-LOREAN-01</div>
                </div>
                <div className="w-24"></div> {/* Spacer for music player */}
            </header>

            {/* Music Player */}
            <div className="fixed top-24 right-2 z-50">
                 <MusicPlayer
                    isPlaying={isPlaying}
                    onTogglePlay={handleToggleMusic}
                    volume={volume}
                    onVolumeChange={handleVolumeChange}
                    trackTitle="DIGITAL WORLD"
                />
            </div>

            {/* DIAGNOSTIC PANEL (LEFT SIDE) - Only on large screens */}
            <aside className="fixed left-4 top-32 bottom-24 w-16 hidden xl:flex flex-col items-center gap-4 bg-hex-mesh border-r-2 border-[#333] p-2 rounded-r-lg shadow-xl z-30">
                 <div className="dymo-label text-[8px] -rotate-90 mt-8 mb-4">DIAGNOSTICS</div>
                 
                 {/* Fake Signal Bars - Replaced with Waveform */}
                 <div className="w-full h-12 flex items-end justify-center gap-[1px]">
                     {Array(10).fill(0).map((_, i) => (
                         <div key={i} className="waveform-bar" style={{ animationDelay: `${i * 0.1}s` }}></div>
                     ))}
                 </div>

                 {/* Scrolling Log */}
                 <div className="flex-1 w-full bg-black border border-[#444] p-1 overflow-hidden relative">
                     <div className="absolute inset-0 bg-green-500/10 pointer-events-none"></div>
                     <div className="font-mono text-[6px] text-green-500 leading-tight opacity-70">
                        {Array(20).fill(0).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                {`SYS_CHK_${Math.floor(Math.random()*999)} OK`}
                            </div>
                        ))}
                     </div>
                 </div>
                 
                 <div className="w-8 h-8 rounded-full border-2 border-[#444] flex items-center justify-center bg-black">
                     <div className="w-4 h-4 bg-red-600 rounded-full animate-ping opacity-20"></div>
                 </div>
            </aside>

            {/* --- HERO: TIME MACHINE DASHBOARD --- */}
            <section id="hero" className="w-full max-w-7xl mt-32 md:mt-36 p-2 md:p-6 relative z-10 flex flex-col items-center">
                
                 {/* --- INPUT / UPLOAD SECTION - MOVED TO TOP --- */}
                <div className="flex flex-col items-center w-full px-2 mb-10">
                    
                    {appState === 'api-key-prompt' && (
                        <div className="bg-metal-dark p-4 md:p-8 rounded border-4 border-[#444] shadow-2xl max-w-lg w-full text-center relative">
                             <div className="panel-screw absolute top-2 left-2"></div>
                             <div className="panel-screw absolute top-2 right-2"></div>
                             <div className="panel-screw absolute bottom-2 left-2"></div>
                             <div className="panel-screw absolute bottom-2 right-2"></div>
                             <div className="dymo-label absolute -top-3 left-1/2 -translate-x-1/2 scale-90 md:scale-110">SECURITY OVERRIDE</div>
                             <p className="font-mono text-green-500 mb-8 mt-4 uppercase tracking-wider text-xs md:text-sm">Input Access Key to Initialize Circuits</p>
                             <button onClick={handleSelectApiKey} className="physical-button py-3 px-4 md:py-4 md:px-8 text-sm md:text-xl w-full flex items-center justify-center gap-2">
                                 <span>INSERT KEYCARD</span>
                                 <div className="w-2 h-6 md:h-8 bg-black/20 border-l border-white/20"></div>
                             </button>
                        </div>
                    )}

                    {appState === 'idle' && (
                        <div className="w-full max-w-md relative group flex flex-col items-center">
                            {/* NEXT GEN HOLOGRAPHIC SCANNER */}
                            <label htmlFor="file-upload" className="block cursor-pointer transform transition-transform duration-200 hover:scale-105 active:scale-95">
                                <div className="bg-[#111] p-2 rounded-full border-[6px] border-[#555] shadow-[0_0_50px_rgba(0,255,255,0.1)] hover:shadow-[0_0_60px_rgba(0,255,255,0.3)] transition-all duration-300 relative overflow-hidden aspect-square flex flex-col items-center justify-center w-40 h-40 md:w-56 md:h-56 mx-auto transform scale-90 md:scale-100 origin-center group">
                                    {/* Holographic Field */}
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#003333_0%,#000_80%)]"></div>
                                    
                                    {/* Rotating Rings */}
                                    <div className="absolute inset-4 holo-ring"></div>
                                    <div className="absolute inset-8 holo-ring-inner"></div>
                                    
                                    {/* Scanning Laser */}
                                    <div className="absolute inset-0 holo-scan-line"></div>

                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10 pointer-events-none">
                                        <span className="font-bold text-black bg-cyan-500 px-2 py-0.5 rounded-[1px] text-[8px] md:text-[10px] block mb-1 uppercase tracking-tighter">SCANNING</span>
                                        <span className="text-cyan-500 font-mono text-[8px] md:text-[9px] uppercase tracking-widest">BIOMETRICS</span>
                                    </div>
                                </div>
                            </label>
                            <div className="mt-8 relative">
                                <div className="wire-bundle left-[-50px] top-2 w-[50px] rotate-12 opacity-50">
                                     <div className="wire black"></div>
                                </div>
                                <span className="dymo-label text-sm md:text-lg tilted-r border-2 border-black">UPLOAD SOURCE MATERIAL</span>
                                <div className="absolute -right-8 top-0">
                                    <div className="w-6 h-6 bg-yellow-400 text-black font-bold text-[10px] flex items-center justify-center rounded-sm border border-black rotate-12">!</div>
                                </div>
                            </div>
                            <input id="file-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleImageUpload} />
                        </div>
                    )}

                    {appState === 'image-uploaded' && uploadedImage && (
                        <div className="flex flex-col items-center gap-6 md:gap-8 animate-in fade-in duration-500 w-full">
                             <div className="bg-[#111] p-3 border-4 border-[#333] rotate-[-1deg] shadow-2xl max-w-[160px] md:max-w-[200px] relative">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                                    <span className="dymo-label text-[10px] md:text-xs">SUBJECT</span>
                                </div>
                                <img src={uploadedImage} alt="Source" className="w-full grayscale contrast-125 brightness-90 border border-white/10" />
                             </div>
                             
                             {/* Auto-Generation. Button removed */}
                             <p className="physical-button py-3 px-6 md:py-5 md:px-16 text-lg md:text-2xl tracking-widest flex items-center gap-2 md:gap-4 group whitespace-nowrap">
                                <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-red-600 shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] group-active:bg-red-500"></div>
                                INITIATING AUTO-TRANSFORMATION...
                             </p>
                        </div>
                    )}

                    {appState === 'accelerating' && (
                        <div className="flex flex-col items-center justify-center h-48 md:h-64">
                            <h2 className="text-4xl md:text-7xl font-digital text-yellow-500 italic animate-pulse tracking-widest drop-shadow-[0_0_15px_rgba(255,200,0,0.5)]">
                                {Math.floor(speed)}.<span className="text-2xl md:text-4xl">0</span> MPH
                            </h2>
                            <p className="mt-6 text-red-500 font-bold tracking-widest uppercase text-xs md:text-base text-center bg-black px-4 py-2 border border-red-900 shadow-[0_0_15px_red]">Accelerating to Temporal Velocity</p>
                        </div>
                    )}
                </div>

                {/* --- TIME CIRCUITS --- */}
                <div className="bg-brushed-metal p-2 rounded-lg shadow-[0_30px_60px_rgba(0,0,0,1)] border border-white/5 relative w-full max-w-5xl mx-auto mb-10">
                    {/* Metal Housing */}
                    <div className="bg-[#111] p-3 md:p-6 rounded border border-white/5 relative overflow-hidden bg-hex-mesh">
                        
                        <div className="panel-screw absolute top-2 left-2"></div>
                        <div className="panel-screw absolute top-2 right-2"></div>
                        <div className="panel-screw absolute bottom-2 left-2"></div>
                        <div className="panel-screw absolute bottom-2 right-2"></div>

                        {/* Cables decoration */}
                        <div className="wire-bundle top-[-10px] left-[5%] w-[90%] flex flex-col opacity-80">
                            <div className="wire red"></div>
                            <div className="wire yellow"></div>
                            <div className="wire blue"></div>
                        </div>

                        {/* Updated Layout for Fluidity: Stack on mobile, Row on Large Screens */}
                        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center relative z-10">
                            
                            {/* DESTINATION TIME (RED) */}
                            <div 
                                onClick={() => setMasterTerminalOpen(true)}
                                className="circuit-trigger flex flex-col items-center bg-[#050505] p-2 rounded-[2px] border-[1px] border-[#333] w-full lg:w-1/3 shadow-[0_0_20px_rgba(0,0,0,1)] relative group"
                            >
                                <div className="absolute -top-3 z-20">
                                    <div className="dymo-label text-[9px] md:text-[11px] text-red-500 border-red-900 tilted">DESTINATION TIME</div>
                                </div>
                                
                                <div className={`led-display-box hyper-glass w-full p-2 grid grid-cols-3 gap-1 text-center mt-3 ${bootClass} ${destPulseClass}`}>
                                    <div className="led-glass-overlay"></div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] md:text-[9px] text-[#555] uppercase font-bold mb-1">Month</span>
                                        <span className="font-segment text-xl md:text-3xl led-red" data-ghost="888">{appState === 'results-shown' ? "OCT" : "JAN"}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] md:text-[9px] text-[#555] uppercase font-bold mb-1">Day</span>
                                        <span className="font-segment text-xl md:text-3xl led-red" data-ghost="88">{appState === 'results-shown' ? "21" : "01"}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] md:text-[9px] text-[#555] uppercase font-bold mb-1">Year</span>
                                        <span className="font-segment text-xl md:text-3xl led-red" data-ghost="8888">{appState === 'results-shown' ? "2099" : "????"}</span>
                                    </div>
                                </div>
                                
                                <div className={`led-display-box hyper-glass w-full mt-2 p-1 grid grid-cols-2 gap-2 text-center ${bootClass} ${destPulseClass}`}>
                                    <div className="led-glass-overlay"></div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] md:text-[9px] text-[#555] uppercase font-bold">Hour</span>
                                        <span className="font-segment text-lg md:text-2xl led-red" data-ghost="88">04</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] md:text-[9px] text-[#555] uppercase font-bold">Min</span>
                                        <span className="font-segment text-lg md:text-2xl led-red" data-ghost="88">29</span>
                                    </div>
                                </div>
                            </div>

                            {/* PRESENT TIME (GREEN) */}
                            <div 
                                onClick={() => setMasterTerminalOpen(true)}
                                className="circuit-trigger flex flex-col items-center bg-[#050505] p-2 rounded-[2px] border-[1px] border-[#333] w-full lg:w-1/3 shadow-[0_0_20px_rgba(0,0,0,1)] relative"
                            >
                                 <div className="absolute -top-3 z-20">
                                    <div className="dymo-label text-[9px] md:text-[11px] text-green-500 border-green-900">PRESENT TIME</div>
                                </div>
                                
                                <div className={`led-display-box hyper-glass w-full p-2 grid grid-cols-3 gap-1 text-center mt-3 ${bootClass}`}>
                                    <div className="led-glass-overlay"></div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] md:text-[9px] text-[#555] uppercase font-bold mb-1">Month</span>
                                        <span className="font-segment text-xl md:text-3xl led-green animate-led-flicker" data-ghost="888">{currentDateDisplay.month}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] md:text-[9px] text-[#555] uppercase font-bold mb-1">Day</span>
                                        <span className="font-segment text-xl md:text-3xl led-green animate-led-flicker" data-ghost="88">{currentDateDisplay.day}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] md:text-[9px] text-[#555] uppercase font-bold mb-1">Year</span>
                                        <span className="font-segment text-xl md:text-3xl led-green animate-led-flicker" data-ghost="8888">{currentDateDisplay.year}</span>
                                    </div>
                                </div>

                                <div className={`led-display-box hyper-glass w-full mt-2 p-1 grid grid-cols-2 gap-2 text-center ${bootClass}`}>
                                    <div className="led-glass-overlay"></div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] md:text-[9px] text-[#555] uppercase font-bold">Hour</span>
                                        <span className="font-segment text-lg md:text-2xl led-green animate-led-flicker" data-ghost="88">{currentDateDisplay.time.split(':')[0]}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] md:text-[9px] text-[#555] uppercase font-bold">Min</span>
                                        <span className="font-segment text-lg md:text-2xl led-green animate-led-flicker" data-ghost="88">{currentDateDisplay.time.split(':')[1]}</span>
                                    </div>
                                </div>
                            </div>

                            {/* LAST TIME DEPARTED (YELLOW) */}
                            <div 
                                onClick={() => setMasterTerminalOpen(true)}
                                className="circuit-trigger flex flex-col items-center bg-[#050505] p-2 rounded-[2px] border-[1px] border-[#333] w-full lg:w-1/3 shadow-[0_0_20px_rgba(0,0,0,1)] relative"
                            >
                                <div className="absolute -top-3 z-20">
                                    <div className="dymo-label text-[9px] md:text-[11px] text-yellow-500 border-yellow-900 tilted">LAST TIME DEPARTED</div>
                                </div>
                                
                                <div className={`led-display-box hyper-glass w-full p-2 grid grid-cols-3 gap-1 text-center mt-3 ${bootClass}`}>
                                    <div className="led-glass-overlay"></div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] md:text-[9px] text-[#555] uppercase font-bold mb-1">Month</span>
                                        <span className="font-segment text-xl md:text-3xl led-yellow" data-ghost="888">OCT</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] md:text-[9px] text-[#555] uppercase font-bold mb-1">Day</span>
                                        <span className="font-segment text-xl md:text-3xl led-yellow" data-ghost="88">26</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] md:text-[9px] text-[#555] uppercase font-bold mb-1">Year</span>
                                        <span className="font-segment text-xl md:text-3xl led-yellow" data-ghost="8888">1985</span>
                                    </div>
                                </div>

                                <div className={`led-display-box hyper-glass w-full mt-2 p-1 grid grid-cols-2 gap-2 text-center ${bootClass}`}>
                                    <div className="led-glass-overlay"></div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] md:text-[9px] text-[#555] uppercase font-bold">Hour</span>
                                        <span className="font-segment text-lg md:text-2xl led-yellow" data-ghost="88">01</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] md:text-[9px] text-[#555] uppercase font-bold">Min</span>
                                        <span className="font-segment text-lg md:text-2xl led-yellow" data-ghost="88">21</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {(appState === 'generating' || appState === 'results-shown') && (
                        <div className="w-full flex flex-col items-center">
                        
                        {appState === 'generating' && (
                            <div className="mb-8 md:mb-12">
                                <FluxCapacitor />
                            </div>
                        )}

                        {/* --- DECADE SELECTOR NAVIGATION --- */}
                        <nav id="timeline-selector" className="w-full max-w-[1400px] mb-6 overflow-x-auto pb-4 px-2">
                            <div className="flex gap-2 min-w-max mx-auto justify-center">
                                {DECADES.map(d => (
                                    <button
                                        key={d}
                                        onClick={() => setSelectedDecadeFilter(d)}
                                        className={cn(
                                            "physical-button py-3 px-5 text-xs md:text-sm tracking-widest transition-all duration-300",
                                            selectedDecadeFilter === d 
                                                ? "border-yellow-500 bg-gray-200 shadow-[0_0_15px_rgba(255,200,0,0.5)] scale-110 z-10" 
                                                : "opacity-70 hover:opacity-100"
                                        )}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </nav>

                        {/* --- SINGLE MAIN MONITOR VIEW --- */}
                        <section id="main-monitor-view" className="w-full flex justify-center max-w-[1000px] px-4">
                            <div className="flex flex-col items-center w-full relative">
                                <div className="mb-4 w-full text-center relative">
                                    <div className="absolute left-0 top-1/2 w-full h-px bg-[#333] -z-10"></div>
                                    <span className="dymo-label text-sm md:text-base tracking-[3px] border-yellow-500 text-yellow-500">{selectedDecadeFilter}</span>
                                </div>
                                <div className="w-full aspect-[16/9] md:aspect-[16/10]">
                                    <PolaroidCard 
                                        key={selectedDecadeFilter}
                                        caption={selectedDecadeFilter}
                                        status={generatedImages[selectedDecadeFilter]?.status || 'pending'}
                                        imageUrl={generatedImages[selectedDecadeFilter]?.url}
                                        error={generatedImages[selectedDecadeFilter]?.error}
                                        warning={generatedImages[selectedDecadeFilter]?.warning}
                                        onDownload={handleDownloadIndividualImage}
                                        onShowPrompt={handleShowPrompt}
                                        onClick={
                                            (generatedImages[selectedDecadeFilter]?.status === 'done' && generatedImages[selectedDecadeFilter]?.url) 
                                            ? (url) => handleImageClick(url, selectedDecadeFilter) : undefined
                                        }
                                    />
                                </div>
                            </div>
                        </section>

                        {appState === 'results-shown' && (
                            <div className="mt-16 bg-metal-dark p-4 md:p-8 rounded border-2 border-[#555] flex flex-col md:flex-row gap-4 md:gap-8 shadow-2xl w-full max-w-sm md:max-w-none justify-center relative">
                                <div className="panel-screw absolute top-2 left-2"></div>
                                <div className="panel-screw absolute top-2 right-2"></div>
                                <div className="panel-screw absolute bottom-2 left-2"></div>
                                <div className="panel-screw absolute bottom-2 right-2"></div>
                                <div className="panel-seam absolute top-1/2 left-0"></div>
                                
                                <button onClick={handleDownloadAlbum} disabled={isDownloading} className="physical-button py-4 px-8 text-sm md:text-base w-full md:w-auto relative z-10">
                                    {isDownloading ? 'ARCHIVING...' : 'SAVE TIMELINE AS IMAGE'}
                                </button>
                                <button onClick={handleReset} className="physical-button py-4 px-8 text-sm md:text-base w-full md:w-auto relative z-10">
                                    RESET CLOCK
                                </button>
                            </div>
                        )}
                        </div>
                )}
            </section>

            {/* SPEEDOMETER FOOTER - Adjusted for better mobile fit */}
            <div className="fixed bottom-0 right-0 p-3 md:p-4 bg-black/90 backdrop-blur border-t-4 border-l-4 border-[#333] rounded-tl-xl flex items-center gap-4 md:gap-6 z-50 shadow-[0_0_20px_#000] transform scale-75 origin-bottom-right md:scale-100 md:transform-none">
                 <div className="flex flex-col items-end">
                     <div className="flex items-baseline gap-1">
                        <span className="font-segment text-5xl text-red-600 italic drop-shadow-[0_0_5px_rgba(255,0,0,0.5)]">
                            {appState === 'accelerating' ? Math.floor(speed).toString().padStart(2, '0') : (appState === 'idle' || appState === 'image-uploaded' ? '00' : '88')}
                            <span className="text-3xl">.0</span>
                        </span>
                     </div>
                     <span className="text-[10px] text-red-800 font-bold uppercase tracking-widest mt-1">Velocity (MPH)</span>
                 </div>
                 <div className="h-12 w-px bg-[#333]"></div>
                 <div className="flex flex-col">
                     <div className="flex gap-1 mb-1">
                         <div className={`w-3 h-6 ${appState === 'accelerating' ? 'animate-pulse' : ''} bg-green-500 shadow-[0_0_5px_lime] rounded-[1px]`}></div>
                         <div className={`w-3 h-6 ${appState === 'accelerating' ? 'animate-pulse' : ''} bg-green-500 shadow-[0_0_5px_lime] rounded-[1px]`}></div>
                         <div className={`w-3 h-6 ${appState === 'accelerating' ? 'animate-pulse' : ''} bg-green-500 shadow-[0_0_5px_lime] rounded-[1px]`}></div>
                         <div className={`w-3 h-6 ${speed > 60 || appState === 'generating' || appState === 'results-shown' ? 'bg-yellow-500 shadow-[0_0_5px_orange]' : 'bg-[#333]'} rounded-[1px]`}></div>
                         <div className={`w-3 h-6 ${speed > 80 || appState === 'generating' || appState === 'results-shown' ? 'bg-red-500 shadow-[0_0_5px_red]' : 'bg-[#333]'} rounded-[1px]`}></div>
                     </div>
                     <span className="text-[9px] text-gray-500 text-center uppercase tracking-tighter">PLUTONIUM</span>
                 </div>
            </div>

            {/* Modal */}
            {isModalOpen && modalImageUrl && (
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                        className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 cursor-zoom-out"
                    >
                        <div className="relative max-w-[90vw] max-h-[90vh] bg-[#111] p-1 border border-[#333] shadow-2xl monitor-casing" onClick={(e) => e.stopPropagation()}>
                            <div className="monitor-screen">
                                <img src={modalImageUrl} alt={modalImageCaption} className="max-h-[80vh] w-auto block object-contain" />
                                <div className="crt-overlay"></div>
                                <div className="crt-glare"></div>
                            </div>
                            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 w-full text-center">
                                <span className="dymo-label text-sm md:text-xl truncate max-w-[90%] inline-block">{modalImageCaption}</span>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            )}

            {/* Prompt Inspector Modal (Single Prompt) */}
            {promptModalOpen && viewingPromptDecade && (
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
                        onClick={closePromptModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#111] border-2 border-yellow-600/50 p-6 rounded-sm max-w-2xl w-full shadow-[0_0_50px_rgba(255,160,0,0.1)] relative overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Scanlines for modal */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-10"></div>
                            
                            {/* Screws */}
                            <div className="panel-screw absolute top-2 left-2"></div>
                            <div className="panel-screw absolute top-2 right-2"></div>
                            <div className="panel-screw absolute bottom-2 left-2"></div>
                            <div className="panel-screw absolute bottom-2 right-2"></div>

                            {/* Header */}
                            <div className="flex justify-between items-end border-b border-yellow-800/30 pb-4 mb-4">
                                <div>
                                    <div className="dymo-label text-xs text-yellow-500 border-yellow-900">TEMPORAL SEQUENCE DATA</div>
                                    <h3 className="text-yellow-500 font-digital text-xl mt-2 tracking-widest">{viewingPromptDecade.toUpperCase()}</h3>
                                </div>
                                <div className="text-[10px] text-yellow-700 font-mono hidden sm:block">
                                    SECURE CONNECTION ESTABLISHED
                                </div>
                            </div>

                            {/* Content */}
                            <div className="font-mono text-yellow-400/90 text-xs md:text-sm leading-relaxed p-4 bg-black/50 border border-yellow-900/30 rounded inner-shadow max-h-[60vh] overflow-y-auto">
                                {decadePrompts[viewingPromptDecade]}
                            </div>

                            {/* Footer */}
                            <div className="mt-6 flex justify-end">
                                <button onClick={closePromptModal} className="physical-button py-2 px-6 text-xs text-yellow-900">
                                    CLOSE TERMINAL
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            )}

            {/* MASTER TERMINAL (FULL DATA) */}
            <MasterTerminal isOpen={masterTerminalOpen} onClose={() => setMasterTerminalOpen(false)} />

        </main>
    );
}

export default App;
