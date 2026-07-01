'use client';
import React, { useState, useEffect } from 'react';
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import { PrismicRichText, PrismicText } from '@prismicio/react';
import { FiHeart, FiShare2 } from 'react-icons/fi';

/**
 * @typedef {import("@prismicio/client").Content.TheBigBurnerSlice} TheBigBurnerSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<TheBigBurnerSlice>} TheBigBurnerProps
 * @param {TheBigBurnerProps}
 */
const TheBigBurner = ({ slice, context }) => {
  const { title, description, image, buttonlabel, buttonlink } = slice.primary;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Use gallery images from context if available, otherwise just use the primary image
  const gallery = context?.galleryImages || [];
  const allImages = image?.url ? [image.url, ...gallery.filter(url => url !== image.url)] : gallery;

  useEffect(() => {
    if (allImages.length <= 1) return;
    
    // Changing interval to exactly 5 seconds as requested
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [allImages]);

  return (
    <section className="relative w-full py-20 md:py-32 overflow-hidden rounded-[4rem] my-12 bg-orange-50 border-4 border-white ring-1 ring-orange-200 shadow-2xl">
      {/* Action Buttons - Always Visible and Polished */}
      <div className="absolute top-8 right-8 z-20 flex gap-4">
        <button className="bg-white hover:bg-orange-600 hover:text-white p-5 rounded-full shadow-2xl text-orange-600 transition-all border-2 border-orange-100 transform hover:scale-110 active:scale-95" title="Add to Wishlist">
          <FiHeart size={24} />
        </button>
        <button className="bg-white hover:bg-orange-600 hover:text-white p-5 rounded-full shadow-2xl text-orange-600 transition-all border-2 border-orange-100 transform hover:scale-110 active:scale-95" title="Share">
          <FiShare2 size={24} />
        </button>
      </div>

      <div className="container mx-auto px-6 md:px-16 flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 text-center md:text-left z-10">
          <span className="inline-block bg-orange-100 text-orange-700 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-10 border-2 border-orange-200">
            Fresh Spotlight
          </span>
          {title && (
            <h1 className="text-5xl md:text-8xl font-black text-gray-900 mb-8 tracking-tighter leading-[0.9] italic uppercase">
              {typeof title === 'string' || typeof title === 'number' ? String(title) : <PrismicText field={title} />}
            </h1>
          )}
          {description && (
            <div className="text-xl md:text-2xl text-gray-700 mb-10 max-w-2xl leading-relaxed font-bold opacity-80 decoration-orange-300 underline underline-offset-8">
              {typeof description === 'string' || typeof description === 'number' ? <p>{String(description)}</p> : <PrismicRichText field={description} />}
            </div>
          )}
          
          <div className="mt-8">
            {buttonlabel && (
              <div 
                className="inline-block px-12 py-5 bg-orange-600 text-white font-black uppercase tracking-widest text-sm rounded-full transition-all transform hover:scale-110 hover:-rotate-2 shadow-2xl shadow-orange-300 select-all cursor-pointer border-4 border-white"
              >
                {typeof buttonlabel === 'string' || typeof buttonlabel === 'number' ? String(buttonlabel) : <PrismicText field={buttonlabel} />}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-1 relative w-full aspect-square group overflow-hidden rounded-[4rem] shadow-2xl bg-white p-6 border-8 border-orange-50">
          <div className="relative w-full h-full overflow-hidden rounded-[3rem]">
            {allImages.length > 0 ? (
              <img 
                key={allImages[currentImageIndex]}
                src={allImages[currentImageIndex]}
                alt="Burner visual highlight"
                className="object-contain w-full h-full transform scale-90 group-hover:scale-100 transition-all duration-700 ease-out"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-orange-100 flex items-center justify-center font-black text-orange-300 text-6xl">
                CLICKYS
              </div>
            )}
            
            {allImages.length > 1 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 px-5 py-2 bg-orange-600/10 backdrop-blur-xl rounded-full border border-white/40">
                {allImages.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-2 rounded-full transition-all duration-700 ${i === currentImageIndex ? 'w-10 bg-orange-600' : 'w-2 bg-orange-200'}`} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheBigBurner;
