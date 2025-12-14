
import { motion } from "framer-motion";
import { PolaroidCard } from "../PolaroidCard";

const showcaseItems = [
    { era: "1950s", src: "https://images.unsplash.com/photo-1558507652-2d9626c4e67a?q=80&w=800&auto=format&fit=crop" },
    { era: "1980s", src: "https://images.unsplash.com/photo-1596909407987-0b1a13b64c0e?q=80&w=800&auto=format&fit=crop" },
    { era: "1990s", src: "https://images.unsplash.com/photo-1621360841011-2e697858d4a6?q=80&w=800&auto=format&fit=crop" },
    { era: "2077", src: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=800&auto=format&fit=crop" },
];

export function EraShowcase() {
  return (
    <section id="eras" className="py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-16">
            
            {/* Text Content */}
            <div className="flex-1 text-center md:text-left z-10">
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="font-heading text-4xl sm:text-6xl font-bold mb-6"
                >
                  Timelines <br />
                  <span className="text-primary">Reimagined</span>
                </motion.h2>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, delay: 0.2 }}
                    className="text-lg text-foreground/70 mb-8 max-w-md"
                >
                  From the grain of 50s film to the neon gloss of the 80s, our engine adapts to every era with frightening accuracy.
                </motion.p>
            </div>

            {/* Visuals */}
            <div className="flex-1 relative h-[500px] w-full flex items-center justify-center perspective-1000">
                {showcaseItems.map((item, index) => (
                    <PolaroidCard 
                        key={item.era}
                        index={index}
                        era={item.era}
                        imageUrl={item.src}
                        rotation={(index - 1.5) * 12}
                        className={index % 2 === 0 ? "top-10" : "bottom-10"}
                    />
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}
