import { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

interface MusicPlayerProps {
  trackTitle: string;
  artist: string;
  audioSrc: string;
  albumArt: string;
}

export function MusicPlayer({ trackTitle, artist, audioSrc, albumArt }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioSrc);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }
    
    const audio = audioRef.current;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [audioSrc]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
      }
    }
  };
  
  const toggleMute = () => {
      if (audioRef.current) {
          audioRef.current.muted = !isMuted;
          setIsMuted(!isMuted);
      }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="flex items-center gap-4 p-3 bg-neutral/80 border border-neutral-light rounded-2xl backdrop-blur-sm">
        <img src={albumArt} alt="Album Art" className="w-14 h-14 rounded-lg object-cover" />
        <div className="flex-1 pr-4">
            <p className="text-sm font-bold text-white">{trackTitle}</p>
            <p className="text-xs text-foreground/60">{artist}</p>
            <div className="w-full bg-neutral-light h-1 rounded-full mt-2 overflow-hidden">
                <div className="bg-foreground h-1" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="w-8 h-8 flex items-center justify-center text-foreground/70 hover:text-white transition-colors">
              {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
            <button onClick={togglePlay} className="w-10 h-10 flex items-center justify-center bg-foreground text-background rounded-full transition-transform hover:scale-110">
              {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} />}
            </button>
        </div>
      </div>
    </div>
  );
}