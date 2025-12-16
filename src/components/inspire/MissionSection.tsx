import { motion } from 'framer-motion';
import { FaLightbulb, FaUsers, FaRocket, FaHeart } from 'react-icons/fa';

const values = [
  {
    icon: FaLightbulb,
    title: 'Innovation First',
    description: 'We push boundaries with cutting-edge technology and creative solutions that transform how people interact with their city.',
    color: 'text-yellow-400'
  },
  {
    icon: FaUsers,
    title: 'Community Driven',
    description: 'Every project starts with listening. We build tools and experiences that reflect the needs and aspirations of OKC residents.',
    color: 'text-blue-400'
  },
  {
    icon: FaRocket,
    title: 'Bold & Fearless',
    description: 'We take risks, experiment boldly, and aren\'t afraid to reimagine what\'s possible for our community.',
    color: 'text-purple-400'
  },
  {
    icon: FaHeart,
    title: 'Inclusively Built',
    description: 'Technology should empower everyone. We design with accessibility, diversity, and equity at the forefront.',
    color: 'text-pink-400'
  }
];

export function MissionSection() {
  return (
    <section id="mission" className="relative py-32 bg-gradient-to-b from-[#050505] to-[#0a0a1a]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-block border border-purple-500/30 bg-purple-500/10 backdrop-blur-md px-4 py-1 rounded-full mb-6">
            <p className="text-purple-400 text-xs font-mono tracking-widest uppercase">Our Purpose</p>
          </div>
          <h2 className="font-heading text-5xl md:text-7xl font-bold mb-6 text-white">
            EMPOWERING <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">OKC</span>
          </h2>
          <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
            Inspire Oklahoma City is more than a platform—it's a movement to unite technology, 
            creativity, and community to build a brighter future for everyone.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-5xl mx-auto mb-24"
        >
          <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-12 backdrop-blur-xl">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              We believe Oklahoma City deserves world-class digital experiences that celebrate its unique spirit and empower its people.
            </h3>
            <p className="text-lg text-white/70 leading-relaxed">
              From AI-powered creative tools to community-building platforms, we're crafting a digital ecosystem 
              where innovation meets accessibility. Our mission is to inspire action, foster connection, and 
              amplify the voices that make OKC extraordinary.
            </p>
          </div>
        </motion.div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="group"
            >
              <div className="h-full bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-all duration-300 hover:shadow-xl">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300">
                    <value.icon className={`text-2xl ${value.color}`} />
                  </div>
                </div>
                <h4 className="text-xl font-bold text-white mb-4">{value.title}</h4>
                <p className="text-white/60 text-sm leading-relaxed">{value.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-24 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-2xl px-12 py-8 backdrop-blur-xl">
            <p className="text-white/80 text-lg mb-2">
              <span className="font-bold text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Building the future</span>
            </p>
            <p className="text-white/60 font-mono text-sm">
              One innovation at a time. 🚀
            </p>
          </div>
        </motion.div>
      </div>

      {/* Background Decoration */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
