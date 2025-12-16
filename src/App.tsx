
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from './components/ui/tooltip';
import { Toaster as Sonner } from './components/ui/sonner';
import { useState, useEffect } from 'react';
import Index from './pages/Index';
import TimeTravelLab from './pages/TimeTravelLab';
import NotFound from './pages/NotFound';
import Docs from './pages/Docs';
import Legends from './pages/Legends';

const queryClient = new QueryClient();

function App() {
  // Force ready for dev/preview
  const [isKeyReady, setIsKeyReady] = useState(true);

  useEffect(() => {
    const checkKey = async () => {
      // Safely access aistudio property on window
      const aiStudio = (window as any).aistudio;
      
      if (aiStudio) {
        try {
          // Check if key is selected via Studio UI
          const has = await aiStudio.hasSelectedApiKey();
          // OR check if env var is already populated (prevents double auth)
          if (has || (process.env.API_KEY && process.env.API_KEY.length > 0)) {
            setIsKeyReady(true);
          }
        } catch (e) {
          console.error("Auth check failed, attempting fallback check", e);
          if (process.env.API_KEY) setIsKeyReady(true);
        }
      } else {
        // Dev environment / No Studio Wrapper - assume ready if local
        setIsKeyReady(true);
      }
    };
    checkKey();
  }, []);

  const handleAuth = async () => {
    const aiStudio = (window as any).aistudio;
    if (aiStudio) {
      try {
        await aiStudio.openSelectKey();
        setIsKeyReady(true);
      } catch (e) {
        console.error("Key selection failed", e);
      }
    }
  };

  // Auth Gate: Only show if we strictly detect the Studio environment AND key is not ready
  if (!isKeyReady && typeof window !== 'undefined' && (window as any).aistudio) {
    return (
        <div className="fixed inset-0 bg-[#050505] text-white flex flex-col items-center justify-center p-6 z-[9999]">
             <div className="max-w-md w-full text-center space-y-8 animate-in fade-in duration-700">
                 <div className="space-y-2">
                    <h1 className="font-heading text-6xl font-bold tracking-tighter">REWIND</h1>
                    <p className="text-primary font-mono text-sm tracking-widest uppercase">Singularity Protocol</p>
                 </div>
                 
                 <div className="p-6 border border-white/10 bg-white/5 rounded-xl backdrop-blur-sm">
                    <p className="text-white/70 mb-6 leading-relaxed">
                        High-Fidelity Temporal Rendering requires a verified access key.
                    </p>
                    <button 
                        onClick={handleAuth}
                        className="w-full py-4 bg-white text-black font-bold font-mono tracking-widest rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
                    >
                        AUTHENTICATE SYSTEM
                    </button>
                 </div>

                  <div className="text-xs text-white/30 pt-4 flex flex-col gap-2">
                    <p>Access requires a paid Google Cloud Project.</p>
                    <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-white transition-colors">
                        Billing Documentation
                    </a>
                 </div>
             </div>
         </div>
    );
  }

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {/* Failsafe background color */}
          <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[#050505]" />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/lab" element={<TimeTravelLab />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/legends" element={<Legends />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Sonner position="top-right" />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
