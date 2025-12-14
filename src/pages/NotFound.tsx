import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404: Lost in Time | REWIND</title>
      </Helmet>
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-6xl md:text-8xl font-heading font-bold text-foreground mb-4">404</h1>
        <h2 className="text-2xl md:text-4xl font-heading mb-2">Lost in Time</h2>
        <p className="text-foreground/70 max-w-md mb-8">
          Looks like you've taken a wrong turn in the temporal stream. This timeline doesn't exist. Let's get you back to a stable reality.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-neutral-light bg-neutral/50 text-foreground rounded-full hover:bg-neutral"
          >
            Return to Homepage
          </Link>
          <Link
            to="/lab"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-background bg-foreground font-bold rounded-full hover:bg-foreground/80"
          >
            Go to the Lab <FaChevronRight className="ml-2" />
          </Link>
        </div>
      </div>
    </>
  );
}