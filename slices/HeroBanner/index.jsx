"use client";

import { motion } from 'framer-motion';
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import { PrismicRichText, PrismicText } from '@prismicio/react';

/**
 * @typedef {import("@prismicio/client").Content.HeroBannerSlice} HeroBannerSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<HeroBannerSlice>} HeroBannerProps
 * @param {HeroBannerProps}
 */
const HeroBanner = ({ slice }) => {
  const { title, description, image, cta_link, cta_text, background_color } = slice.primary;

  return (
    <section 
      className="relative w-full py-20 px-4 overflow-hidden bg-white"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="md:flex-[0.8] text-center md:text-left z-10"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-4xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1]"
          >
            <PrismicText field={title} />
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-slate-500 mb-10 max-w-xl leading-relaxed font-medium"
          >
            <PrismicRichText field={description} />
          </motion.div>
          
          {cta_link && cta_text && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <PrismicNextLink 
                field={cta_link} 
                className="inline-flex items-center px-10 py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black transition-all hover:shadow-xl hover:shadow-slate-200 active:scale-95 group"
              >
                {typeof cta_text === 'string' || typeof cta_text === 'number' ? String(cta_text) : <PrismicText field={cta_text} />}
                <motion.span 
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.span>
              </PrismicNextLink>
            </motion.div>
          )}
        </motion.div>
        
        {image?.url && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="md:flex-[1.2] relative w-full aspect-square md:aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border-8 border-slate-50"
          >
            <PrismicNextImage 
              field={image} 
              className="object-cover w-full h-full transition-transform duration-1000 hover:scale-110"
              priority
            />
            {/* Subtle overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
          </motion.div>
        )}
      </div>

      {/* Modern abstract backgrounds - changed to ultra subtle slate */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-slate-50 rounded-full blur-3xl -z-10" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-slate-50 rounded-full blur-3xl -z-10" />
    </section>
  );
};

export default HeroBanner;
