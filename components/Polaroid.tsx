import React from 'react';
import { motion } from 'framer-motion';

interface PolaroidProps {
  src: string;
  caption: string;
  tapeColor?: string;
}

export const Polaroid: React.FC<PolaroidProps> = ({ src, caption, tapeColor = "bg-pink-200" }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative bg-white p-2 pb-8 shadow-md w-48 sm:w-56 flex flex-col items-center group"
    >
      {/* Washi Tape Element */}
      <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 ${tapeColor} opacity-80 shadow-sm transform -rotate-2 z-10`} />

      <div className="w-full aspect-square overflow-hidden mb-2 border-4 border-white">
        <img 
          src={src} 
          alt={caption} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          loading="lazy"
        />
      </div>
      <p className="font-['Mali'] font-bold text-gray-500 text-center leading-tight text-sm mt-2">
        {caption}
      </p>
    </motion.div>
  );
};