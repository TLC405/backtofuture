
import { FaTwitter, FaInstagram, FaGithub, FaBook } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const socialLinks = [
  { icon: FaTwitter, href: '#' },
  { icon: FaInstagram, href: '#' },
  { icon: FaGithub, href: '#' },
];

export function Footer() {
  return (
    <footer id="footer" className="py-10 bg-neutral-dark border-t border-neutral-light/50">
      <div className="container mx-auto px-4 text-center text-foreground/60">
        <Link to="/" className="font-heading text-xl font-bold text-foreground/80 hover:text-white transition-colors">
          TLC STUDIOS <span className="text-primary">•</span> REWIND
        </Link>
        <p className="my-4 text-sm max-w-md mx-auto">
          Your life, remastered. AI-powered temporal photography to explore every version of yourself.
        </p>
        
        <div className="flex justify-center items-center gap-6 mb-6">
          {socialLinks.map((link, index) => (
            <a key={index} href={link.href} target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-primary transition-colors">
              <link.icon />
            </a>
          ))}
          <div className="w-px h-6 bg-white/10 mx-2"></div>
          <Link to="/docs" className="flex items-center gap-2 text-sm font-mono text-foreground/50 hover:text-primary transition-colors" title="System Blueprint">
             <FaBook /> Build Info
          </Link>
        </div>
        
        <p className="text-xs">&copy; {new Date().getFullYear()} TLC Studios. All Rights Reserved. The future is not yet written.</p>
      </div>
    </footer>
  );
}
