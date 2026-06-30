'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function LimitedTimeDeals({ productsByPlatform, allProducts }) {
  const platforms = [
    { name: 'Amazon', color: '#FF9900' },
    { name: 'Flipkart', color: '#2874F0' },
    { name: 'Myntra', color: '#ff3f6c' },
    { name: 'Ajio', color: '#2c4152' }
  ];

  // Use colors for frames
  const colors = ['#3b82f6', '#8b5cf6', '#f43f5e', '#10b981', '#f59e0b', '#ef4444', '#14b8a6', '#f97316', '#6366f1'];
  
  const allDealProducts = allProducts && allProducts.length > 0 ? allProducts : Object.values(productsByPlatform).flat();
  const categoryGroups = {};
  allDealProducts.forEach(p => {
    const cat = p.category || 'Deals';
    categoryGroups[cat] = categoryGroups[cat] || [];
    // prevent complete duplicates
    if (!categoryGroups[cat].find(existing => existing.id === p.id || existing.title === p.title)) {
      categoryGroups[cat].push(p);
    }
  });

  const topCategories = Object.keys(categoryGroups)
    .sort((a, b) => categoryGroups[b].length - categoryGroups[a].length);

  // If no categories have products, fallback to generic chunks
  let displayFrames = [];
  if (topCategories.length === 0) {
     const shuffled = [...allDealProducts].sort(() => 0.5 - Math.random());
     const chunks = [];
     for(let i=0; i<4; i++) {
        if(shuffled.length >= (i+1)*6) {
           chunks.push({ title: `Top Picks ${i+1}`, products: shuffled.slice(i*6, (i+1)*6), color: colors[i] });
        }
     }
     displayFrames = chunks;
  } else {
     displayFrames = topCategories.map((cat, i) => {
        return {
           title: cat,
           category: cat,
           color: colors[i % colors.length],
           products: categoryGroups[cat].sort(() => 0.5 - Math.random()).slice(0, 6)
        }
     });
  }

  if (displayFrames.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex flex-col items-center mb-12 relative">
        <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight uppercase text-center mb-4">
          Limited Time <span className="text-red-600">Deals</span>
        </h2>
        <div className="w-24 h-1.5 bg-red-600 rounded-full" />
      </div>

      {/* The Stripe */}
      <div className="w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 mb-10 rounded-full opacity-50" />

      <div 
        className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 p-6 rounded-[32px]"
        style={{ backgroundColor: '#ae6c14' }}
      >
        {displayFrames.map((frame) => {
          const frameProducts = frame.products;
          if (!frameProducts || frameProducts.length === 0) return null;

          const accentColor = frame.color || '#3b82f6';

          return (
            <div 
              key={frame.title} 
              className="bg-white p-6 md:p-8 rounded-[40px] shadow-sm border-2 flex flex-col h-full hover:shadow-2xl transition-all duration-500 group"
              style={{ borderColor: `${accentColor}33` }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-gray-900 leading-tight">
                  {frame.title}
                </h3>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: accentColor }}>
                   <ArrowRight size={20} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 flex-grow">
                {frameProducts.map((product, idx) => (
                  <div key={idx} className="flex flex-col group/item cursor-pointer">
                    <a 
                      href={product.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="relative aspect-square w-full bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 p-3 block group-hover/item:border-red-100 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <div className="relative w-full h-full">
                        <img 
                          src={product.image || 'https://picsum.photos/seed/clickys/200/200'} 
                          alt={product.title}
                          className="w-full h-full object-contain group-hover/item:scale-110 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        {product.discount && (
                          <div className="absolute -top-1 -right-1 bg-red-600 text-white font-black text-[9px] px-2 py-1 rounded-lg shadow-lg">
                            {(() => {
                              const d = String(product.discount);
                              if (/^\d+(\.\d+)?$/.test(d)) return `${d}% OFF`;
                              return d.toUpperCase();
                            })()}
                          </div>
                        )}
                      </div>
                    </a>
                    <div className="mt-3">
                      <p className="text-[10px] text-gray-500 font-bold line-clamp-1 group-hover/item:text-red-600 transition-colors">
                        {product.title}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-900 font-black">
                          {(() => {
                            const p = String(product.price || '');
                            if (p && /^\d/.test(p) && !p.includes('₹') && !p.toLowerCase().includes('rs')) {
                              return `₹${p}`;
                            }
                            return p;
                          })()}
                        </p>
                        <span className="text-[8px] font-black text-gray-400 uppercase">
                          {product.platform}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                 <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200" />
                    ))}
                 </div>
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                   +50 more deals
                 </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

