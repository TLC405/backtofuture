/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';
import { FaTerminal } from 'react-icons/fa';

type ImageStatus = 'pending' | 'done' | 'error';

interface PolaroidCardProps {
    imageUrl?: string;
    caption: string;
    status: ImageStatus;
    error?: string;
    warning?: string; // Added for API fallback messages
    onDownload?: (caption: string) => void;
    onClick?: (imageUrl: string, caption: string) => void;
    onShowPrompt?: (caption: string) => void;
}

const StaticNoise = () => (
    <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
       <div className="w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] animate-pulse"></div>
    </div>
);

// Helper to get decade-specific styles
const getDecadeStyles = (caption: string) => {
    const decade = caption.toLowerCase();
    
    if (decade.includes('1900')) return {
        border: 'border-[#8B4513]', // SaddleBrown
        font: 'font-serif',
        tint: 'bg-sepia-500/10',
        text: 'text-[#DEB887]' // Burlywood
    };
    if (decade.includes('1950')) return {
        border: 'border-gray-400',
        font: 'font-sans tracking-tighter', // Clean mid-century
        tint: 'bg-black/10', // Noir feel
        text: 'text-gray-200'
    };
    if (decade.includes('1960')) return {
        border: 'border-orange-400',
        font: 'font-graffiti', // Psychedelic vibe
        tint: 'bg-yellow-500/10',
        text: 'text-orange-300'
    };
    if (decade.includes('1970')) return {
        border: 'border-yellow-600',
        font: 'font-display', // Disco
        tint: 'bg-purple-500/10',
        text: 'text-yellow-400'
    };
    if (decade.includes('1980')) return {
        border: 'border-pink-500',
        font: 'font-bttf', // Retro Future
        tint: 'bg-blue-500/10',
        text: 'text-pink-400'
    };
    if (decade.includes('1990')) return {
        border: 'border-green-600',
        font: 'font-graffiti', // Grunge/HipHop
        tint: 'bg-green-900/10', 
        text: 'text-green-400'
    };
    if (decade.includes('day one')) return {
        border: 'border-stone-600',
        font: 'font-serif',
        tint: 'bg-orange-900/10',
        text: 'text-stone-400'
    };
    if (decade.includes('homeless')) return {
        border: 'border-gray-700',
        font: 'font-mono',
        tint: 'bg-gray-900/20',
        text: 'text-gray-400'
    };
    if (decade.includes('memento') || decade.includes('old') || decade.includes('future')) return {
        border: 'border-cyan-500',
        font: 'font-tech',
        tint: 'bg-cyan-900/10',
        text: 'text-cyan-400'
    };

    // Default Retro
    return {
        border: 'border-[#444]',
        font: 'font-mono',
        tint: 'bg-transparent',
        text: 'text-[#999]'
    };
};

const PolaroidCard: React.FC<PolaroidCardProps> = ({ imageUrl, caption, status, error, warning, onDownload, onClick, onShowPrompt }) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const styles = getDecadeStyles(caption);

    useEffect(() => {
        if (status === 'done' && imageUrl) {
            const img = new Image();
            img.src = imageUrl;
            img.onload = () => setIsImageLoaded(true);
        }
    }, [imageUrl, status]);

    const handleImageClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onClick && imageUrl && status === 'done') onClick(imageUrl, caption);
    };

    return (
        <div 
            className={cn(
                "monitor-casing w-full aspect-[16/9] relative transition-transform duration-200 border-2", // Changed aspect ratio here
                styles.border,
                (onClick && status === 'done') ? "cursor-pointer hover:scale-[1.02]" : ""
            )}
            onClick={handleImageClick}
        >
            <div className="monitor-screen w-full h-full bg-black relative flex items-center justify-center">
                
                {/* CRT Scanline Overlay (Global to screen) */}
                <div className="crt-overlay"></div>
                {/* Decade Tint */}
                <div className={cn("absolute inset-0 pointer-events-none mix-blend-overlay z-10", styles.tint)}></div>
                
                {status === 'pending' && (
                    <div className={cn("flex flex-col items-center justify-center text-xs opacity-80 z-10", styles.text, styles.font)}>
                        <div className="animate-pulse mb-2 tracking-widest">CONNECTING TO {caption.toUpperCase()}...</div>
                        <div className="w-32 h-2 bg-[#111] border border-current rounded-sm overflow-hidden">
                            <div className="h-full bg-current animate-[width_2s_ease-in-out_infinite] w-0"></div>
                        </div>
                        <StaticNoise />
                    </div>
                )}

                {status === 'error' && (
                    <div className="text-red-500 font-mono text-center px-4 z-10 w-full overflow-hidden break-words">
                        <div className="uppercase font-bold mb-2 blink tracking-widest">System Failure</div>
                        <div className="text-[10px] uppercase leading-tight">{error || "Signal Lost"}</div>
                        <StaticNoise />
                    </div>
                )}

                {status === 'done' && imageUrl && (
                    <motion.div className="w-full h-full animate-turn-on relative z-0 flex items-center justify-center bg-black">
                        <img 
                            src={imageUrl} 
                            alt={caption} 
                            className="w-full h-full object-contain"
                        />
                         {warning && (
                            <div className="absolute top-2 left-2 right-2 p-1 text-[8px] text-center uppercase bg-yellow-900/80 text-yellow-300 border border-yellow-700 rounded-sm z-20">
                                {warning}
                            </div>
                        )}
                    </motion.div>
                )}
                
                {/* Screen Glare */}
                <div className="crt-glare"></div>
            </div>

            {/* Monitor Controls */}
            <div className="mt-3 flex justify-between items-center px-2">
                <div className="flex gap-2 items-center">
                    <div className="w-2 h-2 rounded-full bg-[#333] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]"></div>
                    <div className={`w-2 h-2 rounded-full ${status === 'done' ? 'bg-green-500 shadow-[0_0_5px_lime]' : 'bg-red-900'} transition-colors duration-300`}></div>
                </div>
                
                <div className="flex items-center gap-2">
                    {onShowPrompt && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onShowPrompt(caption); }}
                            className={cn(
                                "group flex items-center gap-1 text-[9px] uppercase tracking-widest border px-2 py-1 rounded-sm bg-[#111] hover:bg-[#222] shadow-sm transition-all",
                                styles.text,
                                styles.font,
                                "border-current opacity-70 hover:opacity-100"
                            )}
                            title="View Generation Prompt"
                        >
                            <FaTerminal size={8} />
                            <span>DATA</span>
                        </button>
                    )}

                    {onDownload && status === 'done' && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDownload(caption); }}
                            className="text-[9px] text-[#999] hover:text-white uppercase font-mono tracking-widest border border-[#444] px-3 py-1 rounded-sm bg-[#1a1a1a] hover:bg-[#333] shadow-sm transition-colors"
                        >
                            Print
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PolaroidCard;