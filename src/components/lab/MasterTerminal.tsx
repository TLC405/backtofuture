import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaCopy } from 'react-icons/fa';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

interface MasterTerminalProps {
  prompts: Record<string, string>;
  decades: string[];
  onClose: () => void;
}

export function MasterTerminal({ prompts, decades, onClose }: MasterTerminalProps) {
    const [selectedDecade, setSelectedDecade] = useState(decades[0]);
    
    const handleCopy = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(prompts[selectedDecade]);
            toast.success(`Prompt for ${selectedDecade} copied to clipboard!`);
        } else {
            toast.error("Clipboard access is not available in this environment.");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-5xl h-[85vh] bg-neutral-dark/90 border border-neutral-light/50 rounded-2xl flex flex-col overflow-hidden"
            >
                <div className="p-4 border-b border-neutral-light/30 flex justify-between items-center shrink-0">
                    <h2 className="font-heading text-lg text-foreground">Master Prompt Terminal // SINGULARITY PROTOCOL</h2>
                    <button onClick={onClose} className="text-sm text-foreground/50 hover:text-white transition-colors">[X] Terminate Session</button>
                </div>
                <div className="flex flex-1 overflow-hidden">
                    <aside className="w-1/4 p-4 border-r border-neutral-light/30 overflow-y-auto">
                        <p className="font-mono text-xs text-foreground/60 mb-2">> TARGET_EPOCHS</p>
                        <nav className="flex flex-col gap-1">
                            {decades.map(decade => (
                                <button 
                                    key={decade}
                                    onClick={() => setSelectedDecade(decade)}
                                    className={cn(
                                        'p-2 rounded-lg text-left text-sm transition-colors',
                                        selectedDecade === decade ? 'bg-neutral-light text-foreground' : 'hover:bg-neutral'
                                    )}
                                >
                                    {decade}
                                </button>
                            ))}
                        </nav>
                    </aside>
                    <main className="w-3/4 p-6 overflow-y-auto relative font-mono text-sm leading-relaxed">
                        <button
                            onClick={handleCopy}
                            className="absolute top-4 right-4 p-2 bg-neutral text-foreground/70 rounded-lg hover:bg-neutral-light"
                            aria-label="Copy prompt"
                        >
                            <FaCopy />
                        </button>
                        <h3 className="font-heading text-2xl mb-4 text-foreground/80">{selectedDecade} // GENERATION_MATRIX</h3>
                        <p className="text-foreground/80 whitespace-pre-wrap">
                            {prompts[selectedDecade]}
                        </p>
                    </main>
                </div>
            </motion.div>
        </motion.div>
    );
}