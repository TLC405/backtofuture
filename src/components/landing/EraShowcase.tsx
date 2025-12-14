import { motion } from "framer-motion";
import { DECADES } from "../../data/epochs";

const eraDescriptions: Record<string, string> = {
    '1900s': "Witness the birth of a new century, filled with industrial marvels and scientific genius.",
    '1950s': "Step into the golden age of Hollywood glamour and rock 'n' roll rebellion.",
    '1960s': "Join the counter-culture revolution, from civil rights marches to Beatlemania.",
    '1970s': "Hit the dance floor at Studio 54 and embrace the era of disco, funk, and soul.",
    '1980s': "Dive into a world of neon lights, synth-pop, and blockbuster time travel adventures.",
    '1990s': "Enter the gritty studios of hip-hop legends and witness the rise of a new musical empire.",
    '2000s': "Walk the red carpet in the age of pop royalty and reality TV stardom.",
    'Day One': "Travel back to the dawn of humanity, where survival and discovery were one and the same.",
    'Homeless': "A poignant modern scene focusing on empathy, strength, and the power of connection.",
};

export function EraShowcase() {
  return (
    <section id="eras" className="py-20 sm:py-32 bg-background">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
          Explore Every <span className="text-foreground font-bold">Timeline</span>
        </h2>
        <p className="max-w-2xl mx-auto text-lg text-foreground/70 mb-16">
          Each era is a unique, stylized universe waiting for you to become its central figure. Discover the stories we've crafted.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DECADES.map((decade, index) => (
            <motion.div
              key={decade}
              className="p-6 border rounded-2xl text-left flex flex-col bg-neutral border-neutral-light"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: index * 0.05 }}
            >
              <h3 className="font-heading text-2xl font-bold mb-2">{decade}</h3>
              <p className="text-foreground/70 text-sm flex-1">{eraDescriptions[decade]}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}