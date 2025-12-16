import { motion } from 'framer-motion';
import { FaArrowRight, FaRocket, FaLightbulb, FaUsers } from 'react-icons/fa';

export function InspireHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#050505] via-[#0a0a1a] to-[#050505]">
      
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" 
             style={{ 
               backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(41, 151, 255, .15) 25%, rgba(41, 151, 255, .15) 26%, transparent 27%, transparent 74%, rgba(41, 151, 255, .15) 75%, rgba(41, 151, 255, .15) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(41, 151, 255, .15) 25%, rgba(41, 151, 255, .15) 26%, transparent 27%, transparent 74%, rgba(41, 151, 255, .15) 75%, rgba(41, 151, 255, .15) 76%, transparent 77%, transparent)',
               backgroundSize: '80px 80px',
             }}>
        </div>
      </div>

      {/* Floating Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        animate={{
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        animate={{
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="container mx-auto px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center space-y-12"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-flex items-center gap-2 border border-blue-500/30 bg-blue-500/10 backdrop-blur-md px-6 py-2 rounded-full"
          >
            <FaLightbulb className="text-blue-400" />
            <p className="text-blue-400 text-sm font-mono tracking-widest uppercase">Where Innovation Meets Community</p>
          </motion.div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-bold leading-tight tracking-tighter">
              <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                INSPIRE
              </span>
              <br />
              <span className="text-white">OKLAHOMA CITY</span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto font-light leading-relaxed"
            >
              A digital ecosystem empowering creativity, innovation, and community connection. 
              Explore cutting-edge apps, resources, and tools designed to elevate Oklahoma City.
            </motion.p>
          </div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4 text-sm"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
              <FaRocket className="text-blue-400" />
              <span className="text-white/80">Creative Apps</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
              <FaLightbulb className="text-purple-400" />
              <span className="text-white/80">Innovation Tools</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
              <FaUsers className="text-green-400" />
              <span className="text-white/80">Community Driven</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="pt-8 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a
              href="#apps"
              className="group inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 tracking-wide rounded-lg shadow-lg hover:shadow-2xl hover:scale-105"
            >
              EXPLORE APPS
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </a>
            
            <a
              href="#mission"
              className="group inline-flex items-center gap-4 px-10 py-5 bg-white/5 backdrop-blur-sm border-2 border-white/20 text-white font-bold text-lg hover:bg-white/10 transition-all duration-300 tracking-wide rounded-lg"
            >
              LEARN MORE
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 1 }}
            className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">5+</div>
              <div className="text-white/60 text-sm font-mono uppercase tracking-wider">Innovative Apps</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">1M+</div>
              <div className="text-white/60 text-sm font-mono uppercase tracking-wider">Community Members</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">∞</div>
              <div className="text-white/60 text-sm font-mono uppercase tracking-wider">Possibilities</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
    </section>
  );
}
