"use client";

import { motion } from 'framer-motion';
import { PrismicText } from '@prismicio/react';

/**
 * @typedef {import("@prismicio/client").Content.TheMovingStripeSlice} TheMovingStripeSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<TheMovingStripeSlice>} TheMovingStripeProps
 * @param {TheMovingStripeProps}
 */
const TheMovingStripe = ({ slice }) => {
  const { promotion_text, theme_colour } = slice.primary;
  
  const bgColor = theme_colour || '#ffffff';
  const textColor = theme_colour === '#ffffff' || !theme_colour ? '#0f172a' : '#ffffff';

  const repeatedItems = Array.from({ length: 12 });

  return (
    <div 
      className="w-full py-3 overflow-hidden border-y border-slate-200 flex bg-white"
      style={{ backgroundColor: bgColor }}
    >
      <motion.div 
        className="flex whitespace-nowrap items-center"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ 
          repeat: Infinity, 
          duration: 40, 
          ease: "linear" 
        }}
      >
        {repeatedItems.map((_, index) => (
          <div key={index} className="flex items-center px-8 border-r border-slate-200/50 last:border-r-0">
             <div 
              className="text-xs md:text-sm font-medium uppercase flex items-center gap-6 tracking-[0.3em]"
              style={{ color: textColor }}
            >
              {typeof promotion_text === 'string' || typeof promotion_text === 'number' ? String(promotion_text) : (promotion_text && <PrismicText field={promotion_text} />)}
              <div className="w-1 h-3 bg-orange-500 opacity-50" />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default TheMovingStripe;
