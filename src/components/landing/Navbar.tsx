import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="font-heading text-xl font-bold">
          TLC STUDIOS <span className="text-foreground/50">•</span> REWIND
        </Link>
        <div className="flex items-center gap-4">
          <Link 
            to="/legends"
            className="text-sm font-mono text-orange-500 hover:text-orange-400 tracking-widest uppercase"
          >
            [LEGENDS]
          </Link>
          <Link 
            to="/lab"
            className="inline-flex items-center gap-2 px-6 py-2 bg-foreground text-background font-bold rounded-full hover:bg-foreground/80 transition-colors"
          >
            Launch the Lab <FaArrowRight size={12}/>
          </Link>
        </div>
      </div>
    </header>
  );
}