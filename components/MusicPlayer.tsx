/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { ChangeEvent, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause, FaVolumeUp } from 'react-icons/fa';

interface MusicPlayerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  volume: number;
  onVolumeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  trackTitle: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ isPlaying, onTogglePlay, volume, onVolumeChange, trackTitle }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed top-2 right-2 md:top-4 md:right-4 z-50 flex items-start gap-2 transform scale-90 md:scale-100 origin-top-right">
        <motion.div 
            initial={false}
            animate={{ width: isExpanded ? 'auto' : '48px' }}
            className="bg-[#1a1a1a] border-2 border-[#555] rounded-sm p-1 shadow-[0_5px_15px_rgba(0,0,0,0.8)] overflow-hidden flex items-center bg-brushed-metal"
        >
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-10 h-10 bg-[#111] border border-[#333] flex items-center justify-center text-[#999] active:translate-y-px shadow-inner"
            >
                <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 shadow-[0_0_5px_lime]' : 'bg-red-900'}`}></div>
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="ml-3 flex items-center gap-4 pr-2"
                    >
                        {/* LCD Display */}
                        <div className="bg-[#192219] border-inset border border-[#000] px-2 py-1 w-24 md:w-32 overflow-hidden relative">
                             <div className="font-segment text-[10px] md:text-xs text-green-500/80 whitespace-nowrap animate-[marquee_5s_linear_infinite]">
                                 {trackTitle} {isPlaying ? '>>>' : '||'}
                             </div>
                             <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_2px] pointer-events-none"></div>
                        </div>

                        {/* Controls */}
                        <button onClick={onTogglePlay} className="text-[#ddd] hover:text-white">
                            {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
                        </button>
                        
                        <div className="flex items-center gap-2">
                             <FaVolumeUp size={10} className="text-[#555]" />
                             <input 
                                type="range" 
                                min="0" 
                                max="1" 
                                step="0.1" 
                                value={volume} 
                                onChange={onVolumeChange}
                                className="w-12 md:w-16 h-1 bg-[#111] appearance-none rounded-none cursor-pointer"
                             />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    </div>
  );
};

export default MusicPlayer;