'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight, Zap, ShieldCheck } from 'lucide-react';

export default function TopDeals({ category, platformDeals }) {
  const platforms = [
    { name: 'Amazon', color: 'bg-[#FF9900]', textColor: 'text-black' },
    { name: 'Flipkart', color: 'bg-[#2874F0]', textColor: 'text-white' },
    { name: 'Myntra', color: 'bg-[#ff3f6c]', textColor: 'text-white' },
    { name: 'Ajio', color: 'bg-[#2c4152]', textColor: 'text-white' }
  ];

  // Only render if there are any products for any platform in this category
  const hasProducts = platforms.some(p => platformDeals[p.name.toLowerCase()]?.length > 0);
  if (!hasProducts) return null;

  return (
    <div className="mb-20">
      <div className="flex flex-col mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-1.5 bg-orange-500 rounded-full" />
          <h2 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight uppercase">
            Top Deals in <span className="text-orange-500 italic">{category}</span>
          </h2>
        </div>
        <div className="w-full h-px bg-gray-100" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {platforms.map((platform) => {
          const products = platformDeals[platform.name.toLowerCase()] || [];
          if (products.length === 0) return null;

          return (
            <div 
              key={platform.name}
              className="bg-white rounded-[32px] border-2 border-gray-50 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col h-full group pb-6"
            >
              <div className="p-6 pb-2 grid grid-cols-2 gap-4 flex-grow">
                {products.map((product, idx) => (
                  <a 
                    key={`${platform.name}-${idx}`}
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/item flex flex-col gap-2"
                  >
                    <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center p-3 group-hover/item:bg-orange-50 transition-colors">
                      <img 
                        src={product.image || 'https://picsum.photos/seed/clickys/200/200'} 
                        alt={product.title}
                        className="w-full h-full object-contain mix-blend-multiply group-hover/item:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex flex-col px-1">
                      <span className="text-[10px] font-bold text-gray-600 line-clamp-1 h-3.5 italic mb-1 group-hover/item:text-orange-600 transition-colors">{product.title}</span>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-gray-900">{product.price}</span>
                        <span className="text-[8px] font-black text-gray-300 uppercase tracking-tighter">{platform.name}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              <div className="px-6 pt-4 mt-auto">
                <a 
                  href={`/products?q=${encodeURIComponent(category)}&platform=${platform.name.toLowerCase()}`}
                  className="w-full py-3 bg-gray-50 rounded-xl text-[10px] font-black text-gray-400 hover:text-white hover:bg-orange-500 uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300"
                >
                  Explore {platform.name} <ArrowRight size={12} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
