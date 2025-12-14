import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface PolaroidCardProps {
  era: string;
  imageUrl: string;
  rotation: number;
  className?: string;
  index: number;
}

export const PolaroidCard: React.FC<PolaroidCardProps> = ({ era, imageUrl, rotation, className, index }) => {
  return (
    <motion.div
      className={cn(
        'absolute w-52 h-64 bg-white rounded-lg border border-neutral-light flex flex-col p-3 transform cursor-grab',
        className
      )}
      style={{ rotate: rotation }}
      whileHover={{ scale: 1.1, rotate: 0, zIndex: 10, y: -20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      initial={{ opacity: 0, y: 100, rotate: rotation + (Math.random() - 0.5) * 20 }}
      animate={{ opacity: 1, y: 0, rotate: rotation, transition: { delay: index * 0.15, duration: 0.5 } }}
    >
      <div className="bg-neutral-dark flex-1 rounded-sm overflow-hidden border border-neutral/10">
        <img src={imageUrl} alt={era} className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500" />
      </div>
      <p className="font-heading text-xl text-black mt-2 text-center tracking-tighter">{era}</p>
    </motion.div>
  );
};