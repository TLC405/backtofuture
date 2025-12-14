import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      
      {/* Studio Noir Background */}
      <div className="studio-noir-bg" />

      <div className="container mx-auto px-4 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="inline-block border border-primary/30 bg-primary/10 backdrop-blur-md px-4 py-1 rounded-full">
            <p className="text-primary text-xs font-mono tracking-widest uppercase">Singularity Protocol v2.0</p>
          </div>

          <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-bold leading-tight tracking-tighter text-white">
            STUDIO <span className="text-primary">NOIR</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
            High-fidelity temporal rendering. Remix your reality into cinematic masterpieces from the 1950s to the 2010s.
          </p>

          <div className="pt-8">
            <Link
              to="/lab"
              className="group inline-flex items-center gap-4 px-10 py-5 bg-white text-black font-bold text-lg hover:bg-primary hover:text-white transition-all duration-300 tracking-wide"
            >
              ENTER THE LAB 
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative Grid Floor */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" 
           style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}>
         <div className="w-full h-full opacity-20" 
              style={{ 
                backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(41, 151, 255, .3) 25%, rgba(41, 151, 255, .3) 26%, transparent 27%, transparent 74%, rgba(41, 151, 255, .3) 75%, rgba(41, 151, 255, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(41, 151, 255, .3) 25%, rgba(41, 151, 255, .3) 26%, transparent 27%, transparent 74%, rgba(41, 151, 255, .3) 75%, rgba(41, 151, 255, .3) 76%, transparent 77%, transparent)',
                backgroundSize: '50px 50px',
                transform: 'rotateX(60deg) scale(2)'
              }}>
         </div>
      </div>
    </section>
  );
}