import { Link } from 'react-router-dom';
import { FaTwitter, FaGithub, FaLinkedin, FaInstagram, FaHeart } from 'react-icons/fa';

export function InspireFooter() {
  return (
    <footer className="relative bg-gradient-to-b from-[#050505] to-black border-t border-white/10 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">I</span>
              </div>
              <div className="font-heading">
                <div className="text-white text-lg font-bold tracking-tight">INSPIRE</div>
                <div className="text-blue-400 text-xs font-mono tracking-widest">OKLAHOMA CITY</div>
              </div>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              Empowering creativity, innovation, and community connection through world-class digital experiences.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                aria-label="Twitter"
              >
                <FaTwitter className="text-white/70 hover:text-white" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                aria-label="GitHub"
              >
                <FaGithub className="text-white/70 hover:text-white" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-white/70 hover:text-white" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                aria-label="Instagram"
              >
                <FaInstagram className="text-white/70 hover:text-white" />
              </a>
            </div>
          </div>

          {/* Apps Column */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Apps</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/lab" className="text-white/60 hover:text-white text-sm transition-colors">
                  TLC Rewind
                </Link>
              </li>
              <li>
                <Link to="/legends" className="text-white/60 hover:text-white text-sm transition-colors">
                  Legends
                </Link>
              </li>
              <li>
                <a href="#apps" className="text-white/60 hover:text-white text-sm transition-colors">
                  City Insights
                </a>
              </li>
              <li>
                <a href="#apps" className="text-white/60 hover:text-white text-sm transition-colors">
                  Creative Studio
                </a>
              </li>
              <li>
                <Link to="/docs" className="text-white/60 hover:text-white text-sm transition-colors">
                  Dev Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#mission" className="text-white/60 hover:text-white text-sm transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <Link to="/docs" className="text-white/60 hover:text-white text-sm transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <a href="#contact" className="text-white/60 hover:text-white text-sm transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                  Community
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                  Accessibility
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-sm font-mono">
              © 2025 Inspire Oklahoma City. All rights reserved.
            </p>
            <p className="text-white/50 text-sm flex items-center gap-2">
              Built with <FaHeart className="text-red-500" /> in Oklahoma City
            </p>
          </div>
        </div>
      </div>

      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
    </footer>
  );
}
