"use client";

import React, { useMemo } from 'react';
import Image from 'next/image';
import { FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560343776-97e7d202ff0e?q=80&w=1080';

export default function FeaturedFrames({ pinterestItems = [], localProducts = [], sheetProducts = [] }) {
  // 12-hour rotation logic for Pinterest items
  const rotatedPinterestItems = useMemo(() => {
    if (!pinterestItems || pinterestItems.length === 0) return [];
    
    // Create a 12-hour bucket index
    const now = new Date();
    const bucket = Math.floor(now.getTime() / (12 * 60 * 60 * 1000));
    
    // Select 24 items starting from a shifted index
    const shift = (bucket * 24) % pinterestItems.length;
    const selected = [];
    for (let i = 0; i < 24; i++) {
      selected.push(pinterestItems[(shift + i) % pinterestItems.length]);
    }
    return selected;
  }, [pinterestItems]);

  // Combine and map data sources to a common format
  const allFormatted = useMemo(() => {
    const formatted = [];

    // 1. Pinterest Items (Formatted)
    rotatedPinterestItems.forEach(doc => {
      const data = doc.data || {};
      
      let title = 'Featured Find';
      if (data.heading) {
        if (typeof data.heading === 'string') {
          title = data.heading;
        } else if (Array.isArray(data.heading)) {
          title = data.heading.map(node => node.text || '').join(' ') || 'Featured Find';
        }
      }

      formatted.push({
        id: doc.id,
        title: title,
        image: data.product_image?.url || FALLBACK_IMAGE,
        link: data.affiliate_link?.url || '#',
        source: 'pinterest'
      });
    });

    // 2. Local Products (Take some)
    localProducts.slice(0, 8).forEach(prod => {
      formatted.push({
        id: prod.id,
        title: prod.name,
        image: prod.imageUrl || FALLBACK_IMAGE,
        link: `/products/${prod.slug}`,
        source: 'local'
      });
    });

    // 3. Sheet Products (Take some)
    sheetProducts.slice(0, 8).forEach((prod, idx) => {
      formatted.push({
        id: `sheet-${idx}`,
        title: prod.title,
        image: prod.image || FALLBACK_IMAGE,
        link: prod.link || '#',
        source: 'sheet'
      });
    });

    return formatted;
  }, [rotatedPinterestItems, localProducts, sheetProducts]);

  // Group into frames of 4
  const frames = useMemo(() => {
    const result = [];
    for (let i = 0; i < allFormatted.length; i += 4) {
      if (allFormatted.length >= i + 4) {
        result.push(allFormatted.slice(i, i + 4));
      }
    }
    return result;
  }, [allFormatted]);

  const frameColors = ['ea580c', '16a34a', 'ffffff']; // orange, green, white
  
  if (frames.length === 0) return null;

  return (
    <section className="py-10 px-4">
      <div className="max-w-7xl mx-auto rounded-3xl" style={{ backgroundColor: '#c06431' }}>
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-2 mb-8 border-b border-white/20 pb-4">
            <div className="w-2 h-8 bg-white rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tighter">Featured Finds</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {frames.map((frameItems, frameIdx) => {
             const color = frameColors[frameIdx % frameColors.length];
             const isLight = color === 'ffffff';
             const borderColor = isLight ? 'border-gray-200' : `border-[#${color}]`;
             const accentColor = `#${color}`;
             
             // Dynamic titles for frames based on contents or index
             const titles = [
               "Trending Now",
               "Up to 60% off | Top Picks",
               "Editor's Choice",
               "Recently Discovered",
               "Best Sellers Today",
               "Most Loved"
             ];
             const frameTitle = titles[frameIdx % titles.length] || "More To Explore";

             return (
               <div 
                 key={frameIdx} 
                 className={`bg-white p-5 rounded-2xl shadow-md border-2 flex flex-col h-full`}
                 style={{ borderColor: accentColor }}
               >
                 <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 leading-tight min-h-[3rem]">
                   {frameTitle}
                 </h3>
                 
                 <div className="grid grid-cols-2 gap-3 flex-grow">
                   {frameItems.map((item, idx) => (
                     <div key={idx} className="flex flex-col group cursor-pointer">
                       <a href={item.link} target="_blank" rel="noopener noreferrer" className="relative aspect-square w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-100 p-2 block">
                         <div className="relative w-full h-full">
                           <Image 
                             src={item.image} 
                             alt={item.title}
                             fill
                             className="object-contain group-hover:scale-110 transition-transform duration-500"
                             referrerPolicy="no-referrer"
                           />
                         </div>
                       </a>
                       <p className="text-[10px] mt-1 text-gray-600 font-medium line-clamp-1 group-hover:text-orange-600 transition-colors">
                         {item.title}
                       </p>
                     </div>
                   ))}
                 </div>
                 
                 <div className="mt-6 pt-4 border-t border-gray-100">
                    <Link href="/products" className="text-sm font-bold text-orange-600 flex items-center gap-1 hover:underline">
                      See more <FiArrowRight className="w-3 h-3" />
                    </Link>
                 </div>
               </div>
             );
          })}
        </div>
      </div>
    </div>
  </section>
  );
}
