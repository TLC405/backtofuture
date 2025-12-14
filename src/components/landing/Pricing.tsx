
import { FaCheck, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

const tiers = [
  {
    name: "Observer",
    price: "Free",
    description: "For casual time travelers exploring the timeline.",
    features: [
      "3 Generations per day",
      "Standard Resolution (1K)",
      "Digital Watermark",
      "Public Timeline Access",
      "Standard Speed"
    ],
    cta: "Start Journey",
    popular: false,
  },
  {
    name: "Time Traveler",
    price: "$19",
    period: "/mo",
    description: "Full access to the Singularity Protocol.",
    features: [
      "Unlimited Generations",
      "High Definition (2K)",
      "No Watermark",
      "Priority Processing",
      "Commercial License",
      "All Aesthetics Unlocked"
    ],
    cta: "Get Access",
    popular: true,
  },
  {
    name: "Chrononaut",
    price: "Custom",
    description: "Enterprise solutions for studios and agencies.",
    features: [
      "4K Ultra-Res Rendering",
      "API Access",
      "Custom Fine-Tuning",
      "Dedicated Support",
      "SSO & Team Management"
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 sm:py-32 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
            Access the <span className="text-primary">Timeline</span>
          </h2>
          <p className="max-w-xl mx-auto text-foreground/70 text-lg">
            Choose your clearance level. All plans include access to our core generation engine and standard aesthetics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <div 
              key={index}
              className={cn(
                "relative p-8 rounded-2xl border flex flex-col backdrop-blur-sm transition-all duration-300",
                tier.popular 
                  ? "bg-white/5 border-primary/50 shadow-[0_0_30px_rgba(41,151,255,0.1)] scale-105 z-10" 
                  : "bg-black/40 border-white/10 hover:border-white/20"
              )}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="font-heading text-xl font-bold mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  {tier.period && <span className="text-foreground/50">{tier.period}</span>}
                </div>
                <p className="text-foreground/60 text-sm mt-4">{tier.description}</p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <FaCheck className="text-primary text-xs shrink-0" />
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/lab"
                className={cn(
                  "w-full py-4 rounded-lg font-bold text-center uppercase tracking-widest text-xs transition-all",
                  tier.popular
                    ? "bg-primary text-black hover:bg-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                )}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
