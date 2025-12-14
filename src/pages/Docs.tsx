
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { 
  FaReact, 
  FaGoogle, 
  FaCss3Alt, 
  FaTerminal, 
  FaCode, 
  FaRocket, 
  FaPalette,
  FaLayerGroup,
  FaArrowLeft
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Docs() {
  return (
    <>
      <Helmet>
        <title>System Blueprint | REWIND Architecture</title>
      </Helmet>
      <Navbar />
      <main className="pt-24 pb-20 min-h-screen bg-background relative overflow-hidden">
        
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-foreground/50 hover:text-primary transition-colors mb-4 font-mono text-sm">
                <FaArrowLeft /> Return to Base
            </Link>
            <div className="border-b border-white/10 pb-8">
                <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">
                System <span className="text-primary">Blueprint</span>
                </h1>
                <p className="text-xl text-foreground/60 font-mono">
                /docs/architecture/v2.0 // BUILD_INSTRUCTIONS
                </p>
            </div>
          </div>

          {/* Section: Tech Stack */}
          <section className="mb-16">
            <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
              <FaTerminal className="text-primary" /> Core Technologies
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <TechCard icon={<FaReact />} name="React 18" desc="UI Library" />
              <TechCard icon={<FaCode />} name="TypeScript" desc="Type Safety" />
              <TechCard icon={<FaRocket />} name="Vite" desc="Build Tool" />
              <TechCard icon={<FaPalette />} name="Tailwind CSS" desc="Styling" />
              <TechCard icon={<FaGoogle />} name="Google GenAI" desc="AI SDK" />
              <TechCard icon={<FaCss3Alt />} name="Framer Motion" desc="Animations" />
            </div>
          </section>

          {/* Section: Architecture */}
          <section className="mb-16 space-y-6">
            <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
              <FaLayerGroup className="text-primary" /> The Singularity Protocol (Logic)
            </h2>
            
            <div className="bg-neutral/30 border border-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-2">1. Image Generation Engine</h3>
              <p className="text-foreground/70 mb-4">
                The core feature leverages the <code className="text-primary bg-primary/10 px-1 rounded">@google/genai</code> SDK. 
                We utilize a waterfall fallback strategy to ensure reliability:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-foreground/60 font-mono">
                <li><span className="text-white">Primary:</span> <code className="text-yellow-400">gemini-3-pro-image-preview</code> for 2K resolution, complex instruction following, and high-fidelity aesthetics.</li>
                <li><span className="text-white">Fallback:</span> <code className="text-yellow-400">gemini-2.5-flash-image</code> serves as a backup generator if the Pro model quota is exhausted or latency is critical.</li>
              </ul>
            </div>

            <div className="bg-neutral/30 border border-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-2">2. Prompt Engineering Matrix</h3>
              <p className="text-foreground/70 mb-2">
                Located in <code className="text-primary bg-primary/10 px-1 rounded">src/data/epochs.ts</code>.
              </p>
              <p className="text-foreground/70">
                We use a "Subject Lock" technique. The prompt instructs the model to keep the subject's facial features (Identity Preservation) while completely rewriting the environment, lighting, and clothing style to match the specific decade (1950s - 2010s).
              </p>
            </div>
          </section>

          {/* Section: How to Build */}
          <section className="mb-16">
             <h2 className="font-heading text-2xl font-bold mb-6 border-l-4 border-primary pl-4">
              How to Build
            </h2>
            
            <div className="space-y-8">
              <Step 
                num="01" 
                title="Clone & Install" 
                code="npm install"
                desc="Install all dependencies including React, Vite, and the Google GenAI SDK."
              />
              
              <Step 
                num="02" 
                title="Environment Configuration" 
                code="export API_KEY=your_gemini_api_key"
                desc="The application requires a valid Google Cloud API Key with access to the Gemini API. This is injected via process.env.API_KEY automatically in the provided environment."
              />

              <Step 
                num="03" 
                title="Ignition" 
                code="npm run dev"
                desc="Starts the local development server at http://localhost:5173. The app is hot-reload enabled."
              />

               <Step 
                num="04" 
                title="Production Build" 
                code="npm run build"
                desc="Compiles the Singularity Protocol into static assets ready for deployment."
              />
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}

function TechCard({ icon, name, desc }: { icon: React.ReactNode, name: string, desc: string }) {
  return (
    <div className="p-4 bg-neutral border border-white/5 rounded-lg flex flex-col items-center text-center hover:border-primary/50 transition-colors">
      <div className="text-3xl text-foreground/80 mb-2">{icon}</div>
      <div className="font-bold text-sm">{name}</div>
      <div className="text-xs text-foreground/50">{desc}</div>
    </div>
  );
}

function Step({ num, title, code, desc }: { num: string, title: string, code: string, desc: string }) {
  return (
    <div className="flex gap-4 md:gap-6">
      <div className="flex-shrink-0 font-heading text-4xl font-bold text-white/10 select-none">{num}</div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-foreground/70 mb-3 text-sm">{desc}</p>
        <div className="bg-black/50 border border-white/10 p-3 rounded font-mono text-sm text-primary">
          $ {code}
        </div>
      </div>
    </div>
  );
}