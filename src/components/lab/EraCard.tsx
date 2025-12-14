import { FaDownload, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';

type ImageStatus = 'pending' | 'done' | 'error';

interface EraCardProps {
    imageUrl?: string;
    caption: string;
    status: ImageStatus;
    error?: string;
    warning?: string;
    onDownload?: () => void;
}

export function EraCard({ imageUrl, caption, status, error, warning, onDownload }: EraCardProps) {
  return (
    <div className="w-full h-full bg-black rounded-xl relative overflow-hidden flex items-center justify-center text-center p-4 border border-neutral-light/50">
      {status === 'done' && imageUrl && (
        <img src={imageUrl} alt={caption} className="absolute inset-0 w-full h-full object-contain" />
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

      <div className="relative z-10 w-full">
        {status === 'pending' && (
          <div>
            <FaSpinner className="w-8 h-8 animate-spin mx-auto mb-4 text-foreground/80" />
            <p className="font-heading text-xl">Generating {caption}...</p>
            <p className="text-white/50 text-sm">Engaging temporal circuits.</p>
          </div>
        )}
        {status === 'error' && (
          <div className="p-4 bg-neutral border border-neutral-light rounded-lg max-w-sm mx-auto">
            <FaExclamationTriangle className="text-foreground/70 text-3xl mx-auto mb-2" />
            <p className="font-bold text-foreground/90">Generation Failed</p>
            <p className="text-xs text-foreground/60 break-words">{error}</p>
          </div>
        )}
        {status === 'done' && (
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
            <h3 className="font-heading text-2xl text-white drop-shadow-lg">{caption}</h3>
            {onDownload && (
              <button 
                onClick={(e) => { e.stopPropagation(); onDownload(); }}
                className="p-3 bg-white/10 rounded-full text-white hover:bg-white/30 backdrop-blur-sm transition-colors border border-white/20"
                aria-label="Download Image"
              >
                <FaDownload />
              </button>
            )}
          </div>
        )}
      </div>

      {warning && (
        <div className="absolute top-2 left-2 right-2 p-2 bg-neutral/80 border border-neutral-light text-foreground/70 text-xs rounded-lg z-20 text-center backdrop-blur-sm">
          {warning}
        </div>
      )}
    </div>
  );
}