
import { ChangeEvent } from 'react';
import { FaUpload, FaSpinner, FaBolt, FaMagic } from 'react-icons/fa';
import { DECADES, AESTHETICS } from '../../data/epochs';
import { cn } from '../../lib/utils';

type AppState = 'idle' | 'generating' | 'results-shown';

interface ControlPanelProps {
  appState: AppState;
  uploadedImage: string | null;
  onImageUpload: (file: File) => void;
  onGenerate: () => void;
  selectedDecade: string;
  onSelectDecade: (decade: string) => void;
  selectedAesthetic: string;
  onSelectAesthetic: (id: string) => void;
}

export function ControlPanel({ 
  appState, 
  uploadedImage, 
  onImageUpload, 
  onGenerate,
  selectedDecade,
  onSelectDecade,
  selectedAesthetic,
  onSelectAesthetic
}: ControlPanelProps) {
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-none border-l-0 border-r-0 border-white/10 h-full flex flex-col gap-6 overflow-y-auto">
      
      {/* Header */}
      <div className="space-y-1 shrink-0">
        <h2 className="font-heading text-xs font-bold tracking-[0.2em] text-primary uppercase">Control Deck</h2>
        <h1 className="font-heading text-2xl font-bold text-white flex items-center gap-2">
           REMIX LAB <span className="text-xs bg-white text-black px-1 rounded font-mono">v2.0</span>
        </h1>
      </div>
      
      {/* Upload Zone */}
      <div className="relative group shrink-0">
        <label htmlFor="file-upload" className="cursor-pointer block">
          <div className={cn(
            "relative h-40 border border-white/10 bg-black/40 flex flex-col items-center justify-center transition-all duration-300 rounded-lg overflow-hidden",
            "group-hover:border-primary/50 group-hover:bg-black/60",
            uploadedImage ? "border-primary/20" : "border-dashed"
          )}>
            {uploadedImage ? (
              <img src={uploadedImage} alt="Subject" className="h-full w-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" />
            ) : (
              <div className="text-center space-y-3">
                <FaUpload className="mx-auto text-2xl text-white/20 group-hover:text-primary transition-colors" />
                <p className="text-xs font-mono text-white/40 uppercase tracking-widest">Upload Subject</p>
              </div>
            )}
            
            {uploadedImage && (
              <div className="absolute inset-0 flex items-center justify-center">
                 <p className="text-xs font-mono text-primary bg-black/80 px-2 py-1 uppercase border border-primary/30">Subject Locked</p>
              </div>
            )}
          </div>
        </label>
        <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
      </div>

      {/* Aesthetic Selector */}
      <div className="space-y-3 shrink-0">
        <div className="flex justify-between items-center">
             <p className="text-xs font-mono text-white/40 uppercase tracking-widest">Visual Style</p>
             <FaMagic className="text-white/20 text-xs" />
        </div>
        <div className="grid grid-cols-2 gap-2">
            {AESTHETICS.map((aes) => (
                <button
                    key={aes.id}
                    onClick={() => onSelectAesthetic(aes.id)}
                    className={cn(
                        "p-3 text-left border rounded-lg transition-all duration-200 group relative overflow-hidden",
                        selectedAesthetic === aes.id
                            ? "bg-white/10 border-primary text-white"
                            : "bg-black/20 border-white/5 hover:border-white/20 text-white/60"
                    )}
                >
                    <div className="relative z-10">
                        <p className={cn("text-xs font-bold uppercase", selectedAesthetic === aes.id ? "text-primary" : "text-white/80")}>{aes.label}</p>
                        <p className="text-[10px] opacity-50 mt-1">{aes.description}</p>
                    </div>
                    {selectedAesthetic === aes.id && (
                        <div className="absolute inset-0 bg-primary/5 z-0"></div>
                    )}
                </button>
            ))}
        </div>
      </div>

      {/* Decade Selector */}
      <div className="space-y-3 shrink-0">
        <p className="text-xs font-mono text-white/40 uppercase tracking-widest">Target Era</p>
        <div className="grid grid-cols-2 gap-2">
          {DECADES.map((decade) => (
            <button
              key={decade}
              onClick={() => onSelectDecade(decade)}
              className={cn(
                "py-2 px-2 text-xs font-mono border transition-all duration-200 uppercase rounded-md",
                selectedDecade === decade
                  ? "bg-primary text-black border-primary font-bold shadow-[0_0_15px_rgba(41,151,255,0.3)]"
                  : "bg-transparent text-white/60 border-white/10 hover:border-white/30 hover:text-white"
              )}
            >
              {decade}
            </button>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onGenerate}
        disabled={!uploadedImage || appState === 'generating'}
        className={cn(
          "mt-auto w-full py-5 text-sm font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 border rounded-lg",
          appState === 'generating' 
            ? "bg-black text-white/50 border-white/10 cursor-wait"
            : !uploadedImage
              ? "bg-black text-white/20 border-white/5 cursor-not-allowed"
              : "bg-primary text-black border-primary hover:bg-white hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        )}
      >
        {appState === 'generating' ? (
          <>
            <FaSpinner className="animate-spin" /> Remixing...
          </>
        ) : (
          <>
            <FaBolt /> Generate Remix
          </>
        )}
      </button>
    </div>
  );
}
