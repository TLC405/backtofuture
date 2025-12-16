import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

// ============================================================================
// DATA MATRIX
// ============================================================================
interface Activity {
  id: string;
  category: 'metal' | 'air' | 'fury' | 'primal' | 'base';
  title: string;
  subtitle: string;
  location: string;
  lat: number;
  lng: number;
  price: number;
  risk: number;
  description: string;
  voiceLine: string;
  tlcQuote: string;
  imageUrl: string;
}

const ACTIVITIES: Activity[] = [
  { id: 'm1', category: 'metal', title: 'Iron Titan', subtitle: 'Drive A Tank', location: 'Wyandotte', lat: 36.79, lng: -94.72, price: 142, risk: 20, description: 'Command a 15-ton war machine. Crush cars.', voiceLine: 'You wanna drive a tank? Dont crush your ego, maggot!', tlcQuote: 'No scrubs allowed in the hatch.', imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886f3c?w=800&h=450&fit=crop' },
  { id: 'm2', category: 'metal', title: 'Earth Breaker', subtitle: 'Excavator', location: 'OKC Local', lat: 35.42, lng: -97.55, price: 30, risk: 10, description: 'Hydraulic destruction therapy.', voiceLine: 'Dig a hole! Then fill it up! I want to see sweat!', tlcQuote: 'Diggin on you like a construction crew.', imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=450&fit=crop' },
  { id: 'a1', category: 'air', title: 'Icarus Fall', subtitle: 'Skydiving', location: 'Cushing', lat: 35.98, lng: -96.76, price: 50, risk: 45, description: '14,000ft terminal velocity drop.', voiceLine: 'Gravity checks! Pull the cord or be street pizza!', tlcQuote: 'Dont go chasing waterfalls, stick to the plane.', imageUrl: 'https://images.unsplash.com/photo-1601024445121-e5b82f02f1e5?w=800&h=450&fit=crop' },
  { id: 'a2', category: 'air', title: 'Valkyrie Hunt', subtitle: 'Heli-Hog', location: 'TX Border', lat: 34.00, lng: -97.00, price: 550, risk: 50, description: 'Aerial tactical elimination.', voiceLine: 'Get to the chopper! We got work to do!', tlcQuote: 'Creep, creep... from the sky.', imageUrl: 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?w=800&h=450&fit=crop' },
  { id: 'f1', category: 'fury', title: 'Speed Demon', subtitle: 'Supercars', location: 'Hallett', lat: 36.22, lng: -96.59, price: 249, risk: 30, description: 'Ferrari vs Lamborghini duel.', voiceLine: 'Speed kills! Being slow kills my patience!', tlcQuote: 'Fast car... but I wont sit in the passenger side.', imageUrl: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=450&fit=crop' },
  { id: 'f2', category: 'fury', title: 'Dune Raider', subtitle: 'Buggies', location: 'Little Sahara', lat: 36.53, lng: -98.88, price: 20, risk: 25, description: '1,600 acres of sand assault.', voiceLine: 'Eat sand! Drive it like you stole it!', tlcQuote: 'Kick up the dust, dont be unpretty.', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop' },
  { id: 'p1', category: 'primal', title: 'Tiger King', subtitle: 'Safari', location: 'Tuttle', lat: 35.29, lng: -97.81, price: 10, risk: 35, description: 'Face-to-face with predators.', voiceLine: 'Here kitty kitty! He will eat your face!', tlcQuote: 'Crazysexycool cats.', imageUrl: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=800&h=450&fit=crop' },
  { id: 'h1', category: 'base', title: 'Storm Watch', subtitle: 'Chase Tour', location: 'Variable', lat: 35.20, lng: -97.50, price: 350, risk: 60, description: 'Intercept massive supercells.', voiceLine: 'You wanna see a tornado? You got a death wish?!', tlcQuote: 'Waterfalls coming from the sky.', imageUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800&h=450&fit=crop' },
  { id: 'b1', category: 'base', title: 'The Citadel', subtitle: 'Omni Hotel', location: 'Downtown', lat: 35.46, lng: -97.51, price: 50, risk: 0, description: '5-Star fortress. Rooftop pool.', voiceLine: 'Soft sheets for soft men! Sleep with one eye open!', tlcQuote: 'Red Light Special on room service.', imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=450&fit=crop' },
  { id: 'b2', category: 'base', title: 'Troop Carrier', subtitle: 'Minivan', location: 'Enterprise', lat: 35.40, lng: -97.61, price: 37, risk: 0, description: 'Tactical sliding doors.', voiceLine: 'A minivan? You embarrass me!', tlcQuote: 'I dont want no scrub ride.', imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=450&fit=crop' },
];

const CATEGORIES = [
  { id: 'all', label: 'FULL ROSTER', icon: '◉' },
  { id: 'metal', label: 'HEAVY METAL', icon: '⚙' },
  { id: 'air', label: 'AIRBORNE', icon: '✈' },
  { id: 'fury', label: 'VELOCITY', icon: '⚡' },
  { id: 'primal', label: 'BIOLOGICAL', icon: '🐾' },
  { id: 'base', label: 'LOGISTICS', icon: '🏛' },
];

// ============================================================================
// AUDIO CONTEXT & SPEECH
// ============================================================================
const useAudio = () => {
  const [enabled, setEnabled] = useState(false);
  const audioCtx = useRef<AudioContext | null>(null);

  const init = useCallback(() => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  const playSfx = useCallback((type: 'click' | 'hover' | 'boot') => {
    if (!enabled || !audioCtx.current) return;
    const ctx = audioCtx.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'click') {
      osc.frequency.value = 80;
      gain.gain.value = 0.3;
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'hover') {
      osc.frequency.value = 200;
      osc.type = 'sine';
      gain.gain.value = 0.05;
      osc.start();
      osc.stop(ctx.currentTime + 0.02);
    } else if (type === 'boot') {
      osc.frequency.value = 150;
      osc.type = 'square';
      gain.gain.value = 0.2;
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    }
  }, [enabled]);

  const speak = useCallback((text: string) => {
    if (!enabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.pitch = 0.8;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  }, [enabled]);

  const toggle = useCallback(() => {
    init();
    setEnabled(e => !e);
  }, [init]);

  return { enabled, toggle, playSfx, speak };
};

// ============================================================================
// COMPONENTS
// ============================================================================
const GlitchText = ({ children, className = '' }: { children: string; className?: string }) => (
  <span className={`relative ${className}`}>
    <span className="relative z-10">{children}</span>
    <span className="absolute top-0 left-0.5 text-red-500/50 z-0 animate-pulse" style={{ clipPath: 'inset(10% 0 60% 0)' }}>{children}</span>
    <span className="absolute top-0 -left-0.5 text-cyan-500/50 z-0" style={{ clipPath: 'inset(60% 0 10% 0)' }}>{children}</span>
  </span>
);

const TacticalButton = ({ 
  children, 
  onClick, 
  active = false, 
  className = '',
  size = 'md'
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  active?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-10 py-5 text-lg'
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative overflow-hidden font-bold uppercase tracking-widest
        bg-stone-900/80 border border-stone-700 text-stone-400
        hover:bg-orange-500 hover:text-black hover:border-orange-500
        transition-all duration-300 backdrop-blur-sm
        ${active ? 'bg-orange-500 text-black border-orange-500' : ''}
        ${sizes[size]}
        ${className}
      `}
      style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-500" />
    </button>
  );
};

const IntelCard = ({ 
  activity, 
  selected, 
  onToggle, 
  onHover 
}: { 
  activity: Activity; 
  selected: boolean; 
  onToggle: () => void;
  onHover: () => void;
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    whileHover={{ x: 6 }}
    onClick={onToggle}
    onMouseEnter={onHover}
    className={`
      relative p-5 cursor-pointer border-l-4 transition-all duration-300
      bg-gradient-to-r from-stone-900/90 to-stone-950/95
      ${selected 
        ? 'border-l-orange-500 bg-gradient-to-r from-orange-500/10 to-transparent' 
        : 'border-l-stone-700 hover:border-l-orange-500/50'}
    `}
  >
    <div className="flex justify-between items-start mb-2">
      <div>
        <h3 className="text-xl font-bold text-white uppercase tracking-wide">{activity.title}</h3>
        <div className="text-[10px] text-stone-500 font-mono uppercase tracking-widest">{activity.subtitle}</div>
      </div>
      <span className="text-orange-500 font-bold text-2xl">${activity.price}</span>
    </div>
    <div className="flex gap-2 text-[10px] font-bold uppercase mb-3 font-mono">
      <span className="bg-stone-800 px-2 py-1 border border-stone-700 text-stone-400">{activity.location}</span>
      <span className={`px-2 py-1 border border-stone-800 bg-black ${activity.risk > 30 ? 'text-red-500 animate-pulse' : 'text-yellow-500'}`}>
        RISK: {activity.risk}%
      </span>
    </div>
    <p className="text-xs text-stone-400 mb-2">{activity.description}</p>
    <div className="text-[10px] text-orange-500/70 font-mono italic">🔑 {activity.tlcQuote}</div>
    {selected && (
      <motion.div 
        layoutId={`check-${activity.id}`}
        className="absolute top-4 right-4 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center"
      >
        <span className="text-black text-sm">✓</span>
      </motion.div>
    )}
  </motion.div>
);

const CarouselCard = ({ 
  activity, 
  onSelect 
}: { 
  activity: Activity; 
  onSelect: () => void;
}) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -10 }}
    onClick={onSelect}
    className="flex-shrink-0 w-80 h-[480px] bg-stone-950 border border-stone-800 cursor-pointer overflow-hidden group"
  >
    <div className="h-60 overflow-hidden border-b border-stone-800">
      <img 
        src={activity.imageUrl} 
        alt={activity.title}
        className="w-full h-full object-cover opacity-70 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
      />
    </div>
    <div className="p-6 relative h-[240px]">
      <div className="w-8 h-0.5 bg-orange-500 mb-4 group-hover:w-full transition-all duration-500" />
      <h3 className="text-2xl font-bold text-white uppercase mb-2 group-hover:text-orange-500 transition-colors">{activity.title}</h3>
      <div className="flex justify-between items-center mb-4 font-mono text-xs">
        <span className="text-stone-500 uppercase tracking-widest">{activity.location}</span>
        <span className="text-orange-500 font-bold">${activity.price}</span>
      </div>
      <p className="text-xs text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 border-t border-stone-800 pt-4">
        {activity.tlcQuote}
      </p>
      <div className="absolute top-4 right-4 bg-black/80 px-2 py-1 border border-orange-500/50 text-[10px] text-orange-500 font-mono uppercase tracking-widest">
        #{activity.id}
      </div>
    </div>
  </motion.div>
);

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function Legends() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [category, setCategory] = useState('all');
  const [showWarRoom, setShowWarRoom] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const { enabled: audioEnabled, toggle: toggleAudio, playSfx, speak } = useAudio();

  const filteredActivities = category === 'all' 
    ? ACTIVITIES 
    : ACTIVITIES.filter(a => a.category === category);

  const totalCost = Array.from(selected).reduce((sum, id) => {
    const activity = ACTIVITIES.find(a => a.id === id);
    return sum + (activity?.price || 0);
  }, 0);

  const totalRisk = Math.min(100, Array.from(selected).reduce((sum, id) => {
    const activity = ACTIVITIES.find(a => a.id === id);
    return sum + (activity?.risk || 0);
  }, 0));

  const riskLevel = totalRisk < 30 ? 'MINIMAL' : totalRisk < 70 ? 'ELEVATED' : 'CRITICAL';
  const riskColor = totalRisk < 30 ? 'text-green-500' : totalRisk < 70 ? 'text-yellow-500' : 'text-red-500';

  const toggleActivity = (id: string) => {
    const activity = ACTIVITIES.find(a => a.id === id);
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        playSfx('click');
      } else {
        next.add(id);
        playSfx('click');
        if (activity) speak(activity.voiceLine);
      }
      return next;
    });
  };

  const scrollCarousel = (dir: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: dir * 400, behavior: 'smooth' });
    }
  };

  const deploy = () => {
    playSfx('boot');
    speak('Welcome to the War Room. Make your choices.');
    setShowWarRoom(true);
    setTimeout(() => {
      document.getElementById('war-room')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <>
      <Helmet>
        <title>OPERATION: LEGENDS // BLACK OPS</title>
      </Helmet>

      {/* ========== BACKGROUND EFFECTS ========== */}
      <div className="fixed inset-0 bg-[#050505] -z-20" />
      <div 
        className="fixed inset-0 -z-10 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, transparent 0%, #000 90%),
            linear-gradient(rgba(249,115,22,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249,115,22,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 40px 40px, 40px 40px'
        }}
      />
      <div className="fixed inset-0 pointer-events-none -z-5" style={{ boxShadow: 'inset 0 0 180px rgba(0,0,0,0.95)' }} />
      <div 
        className="fixed inset-0 pointer-events-none z-50 opacity-10"
        style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 4px)' }}
      />

      {/* ========== NAVBAR ========== */}
      <nav className="fixed top-0 w-full z-40 border-b border-orange-900/40 bg-[#050505]/95 backdrop-blur-md">
        <div className="flex justify-between items-center h-20 px-8">
          <div className="flex items-center gap-4">
            <div className="border border-orange-500/50 p-2 hover:bg-orange-500 transition duration-300 rounded-sm group">
              <span className="text-orange-500 text-2xl group-hover:text-black">⌘</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white tracking-widest hover:text-orange-500 transition">LEGENDS</span>
              <span className="text-[9px] text-orange-500 font-mono tracking-[0.4em] uppercase opacity-70">DEV_TERMINAL_ACCESS</span>
            </div>
          </div>
          <div className="flex items-center gap-10">
            <div className="text-right hidden md:block">
              <div className="text-[9px] text-stone-500 font-bold uppercase tracking-widest mb-1">REQ FUNDS</div>
              <motion.div 
                key={totalCost}
                initial={{ scale: 1.2, color: '#fff' }}
                animate={{ scale: 1, color: '#f97316' }}
                className="text-4xl font-bold text-orange-500 leading-none"
              >
                ${totalCost}
              </motion.div>
            </div>
            <button 
              onClick={toggleAudio}
              className={`w-12 h-12 border rounded-sm flex items-center justify-center transition-all ${
                audioEnabled 
                  ? 'bg-orange-500 text-black border-orange-500' 
                  : 'border-stone-800 bg-black text-orange-500 hover:bg-orange-500 hover:text-black'
              }`}
            >
              {audioEnabled ? '🔊' : '🔇'}
            </button>
          </div>
        </div>
      </nav>

      {/* ========== HERO SECTION ========== */}
      <section className="min-h-screen relative flex flex-col items-center justify-center px-4 pt-20 border-b border-stone-900">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-12 relative cursor-pointer group"
          onClick={deploy}
        >
          <div className="absolute inset-0 bg-orange-500/10 blur-3xl animate-pulse rounded-full" />
          <div className="w-40 h-40 border-2 border-orange-500/30 flex items-center justify-center relative bg-black/40 backdrop-blur-sm rotate-45 group-hover:border-orange-500 transition duration-500">
            <div className="w-32 h-32 border border-orange-500/20 absolute inset-0 m-auto" />
            <span className="text-orange-500 text-7xl -rotate-45 drop-shadow-[0_0_20px_rgba(249,115,22,0.6)]">🎖</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center space-y-6 mb-16"
        >
          <div className="flex items-center justify-center gap-3 text-orange-500 font-mono text-xs tracking-[0.6em] animate-pulse uppercase">
            📡 Live Satellite Feed
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white leading-none tracking-tighter">
            <GlitchText>LEGENDS</GlitchText>
          </h1>
          <p className="text-stone-500 text-2xl md:text-3xl tracking-[0.4em] uppercase max-w-3xl mx-auto">
            Tactical Itinerary <span className="text-orange-500 mx-2">//</span> Operation Omega
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <TacticalButton size="lg" onClick={deploy} className="flex items-center gap-4">
            <span className="animate-pulse">🎯</span> ENTER WAR ROOM
          </TacticalButton>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-[9px] font-mono text-orange-500 tracking-widest">SCROLL TO DECRYPT</span>
          <div className="h-20 w-px bg-gradient-to-b from-orange-500 to-transparent" />
        </div>
      </section>

      {/* ========== VISUAL ARSENAL CAROUSEL ========== */}
      <section className="py-20 border-b border-stone-900 relative bg-[#080605]">
        <div className="px-10 mb-8 flex justify-between items-end max-w-[1920px] mx-auto">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-widest border-l-4 border-orange-500 pl-6 mb-1">
              VISUAL <span className="text-orange-500">ARSENAL</span>
            </h2>
            <p className="text-xs font-mono text-stone-500 pl-7 uppercase tracking-widest">
              Swipe to analyze available assets
            </p>
          </div>
          <div className="hidden md:flex gap-3">
            <TacticalButton size="sm" onClick={() => scrollCarousel(-1)}>&lt;</TacticalButton>
            <TacticalButton size="sm" onClick={() => scrollCarousel(1)}>&gt;</TacticalButton>
          </div>
        </div>

        <div 
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto px-10 pb-4 scroll-smooth"
          style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
        >
          {ACTIVITIES.map(activity => (
            <CarouselCard
              key={activity.id}
              activity={activity}
              onSelect={() => toggleActivity(activity.id)}
            />
          ))}
        </div>
      </section>

      {/* ========== BRIEFING SECTION ========== */}
      <section className="py-20 md:py-32 px-6 relative bg-[#0c0a09] border-b border-stone-900">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="border-l-4 border-orange-500 pl-6 md:pl-10 py-4 bg-gradient-to-r from-orange-900/10 to-transparent"
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white uppercase leading-tight">
              "I Don't Want No <br />
              <span className="text-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.4)]">Scrubs</span>."
            </h2>
            <div className="text-stone-500 font-mono text-sm uppercase mt-8 tracking-widest flex items-center gap-3">
              <span className="w-8 h-px bg-orange-500" /> Transmission #4092 // Commander Payne
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="font-mono text-sm text-stone-400 leading-relaxed space-y-8 bg-[#141210] p-8 md:p-12 border border-stone-800 relative shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-4 opacity-30 text-5xl">🔓</div>
            <p><strong className="text-orange-500 text-xs tracking-widest block mb-4">&gt;&gt; UPLINK ESTABLISHED_</strong></p>
            <p>Listen up! You have one life. Do not die mediocre. We are deploying to Oklahoma City (Sector 405). The objective is simple: Build a legendary itinerary. No weak sauce permitted.</p>
            <p className="border-t border-stone-800 pt-6">Use the War Room to requisition assets. Watch your budget. Watch your threat level. <strong className="text-white">Memento Mori.</strong></p>
          </motion.div>
        </div>
      </section>

      {/* ========== WAR ROOM ========== */}
      <AnimatePresence>
        {showWarRoom && (
          <motion.section 
            id="war-room"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex flex-col relative bg-[#080605]"
          >
            {/* Header */}
            <div className="h-20 md:h-24 border-b border-orange-900/30 bg-[#141210] flex justify-between items-center px-4 md:px-10 shrink-0 shadow-2xl relative z-30">
              <div className="font-bold text-white text-xl md:text-2xl tracking-wider flex items-center gap-4">
                <span className="text-orange-500 animate-spin text-3xl">📡</span> 
                <span className="hidden sm:inline">TACTICAL MAP</span>
                <span className="sm:hidden">MAP</span>
              </div>
              <div className="flex gap-4 md:gap-12 items-center">
                {/* Risk Bar */}
                <div className="hidden lg:block w-64 xl:w-96">
                  <div className="flex justify-between text-xs font-bold text-stone-500 mb-2 uppercase tracking-widest">
                    <span>Liability Threat</span>
                    <span className={riskColor}>{riskLevel}</span>
                  </div>
                  <div className="h-3 bg-black w-full border border-stone-700 relative overflow-hidden" style={{ transform: 'skewX(-20deg)' }}>
                    <motion.div 
                      className="h-full bg-gradient-to-r from-green-600 via-orange-500 to-red-600 shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${totalRisk}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
              {/* Map Placeholder */}
              <div className="w-full lg:w-3/5 h-64 lg:h-auto bg-[#050505] relative border-b lg:border-b-0 lg:border-r border-stone-900 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🗺️</div>
                  <p className="text-stone-500 font-mono text-sm">TACTICAL MAP // SECTOR 405</p>
                  <p className="text-orange-500/50 text-xs mt-2">Oklahoma City Area of Operations</p>
                  <div className="mt-8 grid grid-cols-2 gap-4 max-w-md mx-auto">
                    {ACTIVITIES.slice(0, 4).map(a => (
                      <div 
                        key={a.id}
                        onClick={() => toggleActivity(a.id)}
                        className={`p-3 border cursor-pointer transition-all ${
                          selected.has(a.id) 
                            ? 'border-orange-500 bg-orange-500/10' 
                            : 'border-stone-800 hover:border-orange-500/50'
                        }`}
                      >
                        <div className="text-xs text-orange-500 font-mono">{a.location}</div>
                        <div className="text-white text-sm font-bold">{a.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Intel Panel */}
              <div className="w-full lg:w-2/5 flex flex-col bg-[#0f0d0c] relative z-20 shadow-[0_0_60px_rgba(0,0,0,0.9)]">
                {/* Filters */}
                <div className="h-auto lg:h-20 border-b border-stone-800 flex flex-wrap items-center p-4 lg:px-8 gap-2 overflow-x-auto bg-[#0a0807]">
                  {CATEGORIES.map(cat => (
                    <TacticalButton
                      key={cat.id}
                      size="sm"
                      active={category === cat.id}
                      onClick={() => {
                        setCategory(cat.id);
                        playSfx('click');
                      }}
                    >
                      <span>{cat.icon}</span>
                      <span className="hidden sm:inline">{cat.label}</span>
                    </TacticalButton>
                  ))}
                </div>

                {/* Activity List */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-3">
                  <AnimatePresence mode="popLayout">
                    {filteredActivities.map(activity => (
                      <IntelCard
                        key={activity.id}
                        activity={activity}
                        selected={selected.has(activity.id)}
                        onToggle={() => toggleActivity(activity.id)}
                        onHover={() => playSfx('hover')}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Summary Footer */}
                <div className="p-6 lg:p-12 border-t border-orange-900/30 bg-[#141210] relative z-30">
                  <div className="flex justify-between items-end mb-6 lg:mb-8">
                    <div>
                      <div className="text-xs text-stone-500 font-bold uppercase tracking-widest mb-2">TOTAL REQUISITION</div>
                      <motion.div 
                        key={totalCost}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        className="text-5xl lg:text-7xl font-bold text-white leading-none"
                      >
                        $<span className="text-orange-500">{totalCost}</span>
                      </motion.div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-stone-500 font-bold uppercase tracking-widest mb-2">ACTIVE ASSETS</div>
                      <div className="text-3xl lg:text-4xl font-mono text-white leading-none">{selected.size}/10</div>
                    </div>
                  </div>
                  <TacticalButton 
                    size="lg" 
                    active 
                    className="w-full justify-center text-xl lg:text-2xl tracking-[0.2em]"
                    onClick={() => {
                      playSfx('boot');
                      speak('Loadout confirmed. You are ready for deployment.');
                      alert(`LOADOUT CONFIRMED!\n\nTotal: $${totalCost}\nAssets: ${selected.size}\nRisk Level: ${riskLevel}`);
                    }}
                  >
                    CONFIRM LOADOUT
                  </TacticalButton>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ========== FOOTER ========== */}
      <footer className="py-10 bg-[#050505] border-t border-stone-900 text-center">
        <div className="text-stone-600 font-mono text-xs uppercase tracking-widest">
          OPERATION: LEGENDS // TLC STUDIOS // SECTOR 405
        </div>
        <div className="text-orange-500/30 text-[10px] mt-2">
          "No Scrubs" - Tactical Command Protocol Active
        </div>
      </footer>
    </>
  );
}
