import { Link } from 'react-router-dom';
import { FaRocket, FaBars, FaTimes } from 'react-icons/fa';
import { useState } from 'react';

export function InspireNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <span className="text-white font-bold text-xl">I</span>
          </div>
          <div className="font-heading">
            <div className="text-white text-lg font-bold tracking-tight">INSPIRE</div>
            <div className="text-blue-400 text-xs font-mono tracking-widest">OKLAHOMA CITY</div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a 
            href="#apps"
            className="text-sm font-mono text-white/70 hover:text-white tracking-wider uppercase transition-colors"
          >
            Apps
          </a>
          <a 
            href="#mission"
            className="text-sm font-mono text-white/70 hover:text-white tracking-wider uppercase transition-colors"
          >
            Mission
          </a>
          <Link 
            to="/legends"
            className="text-sm font-mono text-orange-500 hover:text-orange-400 tracking-wider uppercase transition-colors"
          >
            [Legends]
          </Link>
          <Link 
            to="/docs"
            className="text-sm font-mono text-white/70 hover:text-white tracking-wider uppercase transition-colors"
          >
            Docs
          </Link>
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <Link 
            to="/lab"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <FaRocket size={14} className="group-hover:rotate-12 transition-transform" />
            Launch Apps
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10">
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
            <a 
              href="#apps"
              className="text-sm font-mono text-white/70 hover:text-white tracking-wider uppercase transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Apps
            </a>
            <a 
              href="#mission"
              className="text-sm font-mono text-white/70 hover:text-white tracking-wider uppercase transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Mission
            </a>
            <Link 
              to="/legends"
              className="text-sm font-mono text-orange-500 hover:text-orange-400 tracking-wider uppercase transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              [Legends]
            </Link>
            <Link 
              to="/docs"
              className="text-sm font-mono text-white/70 hover:text-white tracking-wider uppercase transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Docs
            </Link>
            <Link 
              to="/lab"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm rounded-full mt-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaRocket size={14} />
              Launch Apps
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
