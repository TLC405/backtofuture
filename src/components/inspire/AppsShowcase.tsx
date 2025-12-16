import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaClock, FaChartLine, FaCode, FaBook, FaPalette, FaArrowRight } from 'react-icons/fa';

const apps = [
  {
    id: 'rewind',
    name: 'TLC REWIND',
    description: 'AI-powered time travel photography. See yourself in any decade with stunning, stylized portraits from the 1950s to the 2010s.',
    icon: FaClock,
    link: '/lab',
    color: 'from-blue-500 to-cyan-500',
    status: 'Live',
    tags: ['AI', 'Photography', 'Creative']
  },
  {
    id: 'legends',
    name: 'LEGENDS',
    description: 'Celebrate iconic moments and legendary figures. Explore historical narratives through an immersive digital experience.',
    icon: FaBook,
    link: '/legends',
    color: 'from-orange-500 to-red-500',
    status: 'Live',
    tags: ['History', 'Culture', 'Stories']
  },
  {
    id: 'analytics',
    name: 'CITY INSIGHTS',
    description: 'Real-time analytics and insights about Oklahoma City. Data-driven tools for understanding our community.',
    icon: FaChartLine,
    link: '#',
    color: 'from-green-500 to-emerald-500',
    status: 'Coming Soon',
    tags: ['Analytics', 'Data', 'Insights']
  },
  {
    id: 'creative',
    name: 'CREATIVE STUDIO',
    description: 'A collaborative space for artists, designers, and creators to showcase and develop their work.',
    icon: FaPalette,
    link: '#',
    color: 'from-purple-500 to-pink-500',
    status: 'Coming Soon',
    tags: ['Art', 'Design', 'Community']
  },
  {
    id: 'dev',
    name: 'DEV PORTAL',
    description: 'Resources, APIs, and documentation for developers building on the Inspire OKC platform.',
    icon: FaCode,
    link: '/docs',
    color: 'from-indigo-500 to-blue-500',
    status: 'Beta',
    tags: ['Development', 'API', 'Docs']
  }
];

export function AppsShowcase() {
  return (
    <section id="apps" className="relative py-32 bg-[#050505]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-block border border-blue-500/30 bg-blue-500/10 backdrop-blur-md px-4 py-1 rounded-full mb-6">
            <p className="text-blue-400 text-xs font-mono tracking-widest uppercase">Our Digital Ecosystem</p>
          </div>
          <h2 className="font-heading text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              EXPLORE
            </span>{' '}
            <span className="text-white">OUR APPS</span>
          </h2>
          <p className="text-xl text-white/60 max-w-3xl mx-auto">
            A suite of innovative applications designed to empower, inspire, and connect the Oklahoma City community.
          </p>
        </motion.div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {apps.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={app.link}
                className={`group block h-full bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] ${
                  app.status === 'Coming Soon' ? 'cursor-not-allowed opacity-60' : ''
                }`}
                onClick={(e) => {
                  if (app.status === 'Coming Soon' || app.link === '#') {
                    e.preventDefault();
                  }
                }}
              >
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${app.color} group-hover:scale-110 transition-transform duration-300`}>
                    <app.icon className="text-white text-2xl" />
                  </div>
                  <span className={`text-xs font-mono px-3 py-1 rounded-full ${
                    app.status === 'Live' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    app.status === 'Beta' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {app.status}
                  </span>
                </div>

                {/* App Info */}
                <h3 className="font-heading text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                  {app.name}
                </h3>
                
                <p className="text-white/60 text-sm leading-relaxed mb-6 min-h-[80px]">
                  {app.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {app.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 bg-white/5 border border-white/10 rounded text-white/50">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action */}
                {app.status === 'Live' || app.status === 'Beta' ? (
                  <div className="flex items-center gap-2 text-blue-400 font-mono text-sm group-hover:gap-4 transition-all duration-300">
                    <span>LAUNCH APP</span>
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </div>
                ) : (
                  <div className="text-white/40 font-mono text-sm">
                    STAY TUNED
                  </div>
                )}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-20"
        >
          <p className="text-white/60 mb-6">Have an idea for an app? We'd love to hear from you.</p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/20 text-white font-bold hover:bg-white/10 transition-all duration-300 rounded-lg"
          >
            SUBMIT YOUR IDEA
            <FaArrowRight />
          </a>
        </motion.div>
      </div>

      {/* Background Decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
