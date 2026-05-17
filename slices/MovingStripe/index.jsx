"use client";

import { motion } from 'framer-motion';
import { PrismicNextLink } from '@prismicio/next';

/**
 * @typedef {import("@prismicio/client").Content.MovingStripeSlice} MovingStripeSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<MovingStripeSlice>} MovingStripeProps
 * @param {MovingStripeProps}
 */
const MovingStripe = ({ slice }) => {
  const { background_color, text_color } = slice.primary;

  const repeatedItems = [...slice.items, ...slice.items, ...slice.items, ...slice.items];

  return (
    <div 
      className="w-full py-2.5 overflow-hidden my-6 border-y border-slate-200 bg-white"
      style={{ backgroundColor: background_color || '#ffffff' }}
    >
      <motion.div 
        className="flex whitespace-nowrap items-center"
        animate={{ x: [0, -1000] }}
        transition={{ 
          repeat: Infinity, 
          duration: 35, 
          ease: "linear" 
        }}
      >
        {repeatedItems.map((item, index) => (
          <div key={index} className="flex items-center gap-10 px-5">
             <PrismicNextLink 
              field={item.link} 
              className="text-xs md:text-sm font-bold uppercase flex items-center gap-4 tracking-widest hover:text-orange-600 transition-colors"
              style={{ color: text_color || '#0f172a' }}
            >
              {item.text}
              <div className="w-1 h-1 rounded-full bg-orange-500" />
            </PrismicNextLink>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default MovingStripe;
