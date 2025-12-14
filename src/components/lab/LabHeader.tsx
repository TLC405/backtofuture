import { Link } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa';

export function LabHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/50 backdrop-blur-lg border-b border-neutral-light/50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors">
            <FaChevronLeft />
            Back to Homepage
        </Link>
        <div className="font-heading text-xl font-bold">
          Time Travel <span className="text-primary">Lab</span>
        </div>
        <div className="w-36"></div> {/* Spacer to balance the layout */}
      </div>
    </header>
  );
}
