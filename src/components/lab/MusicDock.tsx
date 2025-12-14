import { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';

interface MusicDockProps {
  trackTitle: string;
  audioSrc: string;
}

export function MusicDock({ trackTitle, audioSrc }: MusicDockProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio(audioSrc);
      audio.loop = true;
      audio.volume = 0.3;
      audioRef.current = audio;
    }
  }, [audioSrc]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => {
            console.error("Audio playback failed:", e);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="flex items-center gap-3 p-2 bg-neutral/80 border border-neutral-light rounded-full backdrop-blur-sm shadow-2xl">
        <button onClick={togglePlay} className="w-10 h-10 flex items-center justify-center bg-primary text-background rounded-full transition-transform hover:scale-110">
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <div className="pr-4 hidden md:block">
          <p className="text-sm font-bold">{trackTitle}</p>
          <p className="text-xs text-foreground/50">Synthwave Mix</p>
        </div>
      </div>
    </div>
  );
}
