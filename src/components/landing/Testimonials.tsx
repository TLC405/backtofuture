import { FaQuoteLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "I never thought I'd see myself in the 1950s, let alone looking so... authentic. The art style is incredible. It feels like a painted movie poster from that era. Blew my mind.",
    name: "Jordan T.",
    handle: "Digital Artist",
  },
  {
    quote: "The '90s rap studio scene is legendary. Seeing my face in there with Tupac and Biggie... it's just a wild, surreal experience. The attention to detail in the prompt is insane.",
    name: "Alex R.",
    handle: "Music Producer",
  },
  {
    quote: "This is more than just a filter app. It's a storytelling tool. The 'Homeless' prompt was so respectful and powerful. It made me think. This is art.",
    name: "Casey L.",
    handle: "Creative Director",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 sm:py-32 bg-neutral-dark/50">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-4xl sm:text-5xl font-bold text-center mb-16">
          Straight from the <span className="text-foreground font-bold">Temporal Stream</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-neutral p-8 rounded-2xl border border-neutral-light/50 flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: index * 0.1 }}
            >
              <FaQuoteLeft className="text-foreground/50 text-3xl mb-4" />
              <p className="text-foreground/80 mb-6 flex-1">"{testimonial.quote}"</p>
              <div>
                <p className="font-bold">{testimonial.name}</p>
                <p className="text-sm text-foreground/50">{testimonial.handle}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}