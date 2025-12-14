import { FaDownload, FaExclamationTriangle } from 'react-icons/fa';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type ImageStatus = 'pending' | 'done' | 'error';
interface GeneratedImage {
    status: ImageStatus;
    url?: string;
    error?: string;
    warning?: string;
}

interface ResultViewProps {
  selectedDecade: string;
  generatedImages: Record<string, GeneratedImage>;
  decades: string[];
  onSelectDecade: (decade: string) => void;
  onDownload: (decade: string) => void;
}

export function ResultView({ selectedDecade, generatedImages, onDownload }: ResultViewProps) {
  const currentImage = generatedImages[selectedDecade];
  // Determine actual status, default to 'idle' if no image record exists
  const status = currentImage ? currentImage.status : 'idle';

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-black border border-white/5">
      
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
        <div>
          <h2 className="font-heading text-4xl font-bold text-white tracking-tight">{selectedDecade}</h2>
          <p className="text-xs font-mono text-primary mt-1 tracking-widest uppercase">Studio Noir Render</p>
        </div>
        
        {status === 'done' && (
           <div className="flex gap-2">
             <button 
                onClick={() => onDownload(selectedDecade)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-primary text-white transition-colors backdrop-blur-md"
             >
               <FaDownload size={14} />
             </button>
           </div>
        )}
      </div>

      {/* Main Viewport */}
      <div className="flex-1 relative flex items-center justify-center">
        
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        <AnimatePresence mode="wait">
          {status === 'done' && currentImage?.url ? (
            <motion.img 
              key={currentImage.url}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              src={currentImage.url} 
              alt={selectedDecade} 
              className="max-w-full max-h-full object-contain shadow-2xl shadow-black/50 z-10"
            />
          ) : status === 'pending' ? (
             <motion.div 
               key="pending"
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="text-center z-10 space-y-4"
             >
               <div className="w-16 h-16 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
               <p className="font-mono text-xs text-primary animate-pulse">RENDERING PIXELS...</p>
             </motion.div>
          ) : status === 'error' ? (
            <motion.div 
               key="error"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-center z-10 max-w-md p-8 border border-red-900/50 bg-red-900/10 text-red-200"
            >
               <FaExclamationTriangle className="mx-auto text-3xl mb-4" />
               <p className="font-bold">Render Error</p>
               <p className="text-sm opacity-70 mt-2">{currentImage?.error || "Unknown error occurred"}</p>
            </motion.div>
          ) : (
            // Idle State
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-center z-10 opacity-30"
            >
               <div className="w-20 h-20 border border-white/20 mx-auto mb-4 flex items-center justify-center">
                 <div className="w-1 h-1 bg-white"></div>
               </div>
               <p className="font-mono text-xs tracking-widest uppercase">Awaiting Singularity Protocol</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5 bg-black/80 backdrop-blur-sm flex justify-between items-center z-20">
         <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", 
                status === 'done' ? "bg-primary" : 
                status === 'error' ? "bg-red-500" : 
                status === 'pending' ? "bg-primary animate-pulse" : "bg-neutral-600"
            )}></div>
            <p className="text-xs font-mono text-white/50 uppercase">
              {status === 'done' ? 'Ready' : status === 'error' ? 'Failed' : status === 'pending' ? 'Processing' : 'Standby'}
            </p>
         </div>
         {currentImage?.warning && (
           <p className="text-xs text-yellow-500 font-mono">{currentImage.warning}</p>
         )}
      </div>
    </div>
  );
}