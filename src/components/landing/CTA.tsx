import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

export function CTA() {
  return (
    <section id="cta" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
          Ready to Rewrite History?
        </h2>
        <p className="max-w-2xl mx-auto text-lg text-foreground/70 mb-10">
          Your journey through time is just one click away. Step into the lab and create your own legendary moments. The timeline is waiting.
        </p>
        <Link
          to="/lab"
          className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-foreground text-background font-bold rounded-full text-xl hover:scale-105 transition-transform"
        >
          Launch Your First Rewind <FaArrowRight size={16}/>
        </Link>
      </div>
    </section>
  );
}