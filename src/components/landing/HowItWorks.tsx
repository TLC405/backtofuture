import { FaUpload, FaBolt, FaImages } from 'react-icons/fa';

const steps = [
  {
    icon: FaUpload,
    title: "1. Upload Your Photo",
    description: "Start by uploading a single, clear photo of yourself. For best results, use a well-lit portrait with a neutral expression.",
  },
  {
    icon: FaBolt,
    title: "2. Engage The Circuits",
    description: "Our advanced AI, powered by Gemini, analyzes your photo and prepares to engage the temporal displacement circuits.",
  },
  {
    icon: FaImages,
    title: "3. Explore Timelines",
    description: "Receive a full set of hyper-realistic portraits from different eras. Download, share, and rediscover yourself.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-32 bg-neutral-dark/50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
          Travel Time in <span className="text-foreground font-bold">3 Simple Steps</span>
        </h2>
        <p className="max-w-2xl mx-auto text-lg text-foreground/70 mb-16">
          Our process is designed to be simple, fast, and magical. Go from a single photo to a gallery of alternate selves in minutes.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-20 h-20 mb-6 rounded-full border-2 border-neutral-light bg-neutral flex items-center justify-center">
                <step.icon className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="font-heading text-2xl font-bold mb-3">{step.title}</h3>
              <p className="text-foreground/60">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}