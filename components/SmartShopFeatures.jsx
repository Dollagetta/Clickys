"use client";

import { useState } from 'react';
import AIShopperClient from './AIShopperClient';
import PriceTracker from './PriceTracker';
import ProductComparator from './ProductComparator';

export default function SmartShopFeatures() {
  const [activeMode, setActiveMode] = useState('chat'); // 'chat' | 'track' | 'compare'

  return (
    <>
      <div className="flex overflow-x-auto pb-6 -mx-4 px-4 snap-x snap-mandatory gap-4 md:grid md:grid-cols-3 md:gap-6 md:mx-0 md:px-0 md:overflow-visible md:pb-0 mb-12 sm:mb-16 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {/* Card 1: Buy a Gift */}
        <div className="w-[75vw] sm:w-[280px] md:w-full shrink-0 snap-center group relative rounded-[24px] p-[1px] bg-gradient-to-b from-orange-400/40 to-orange-500/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_-10px_rgba(249,115,22,0.3)] cursor-pointer" onClick={() => setActiveMode('chat')}>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-500 rounded-[24px] blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative h-full w-full bg-white/80 backdrop-blur-xl rounded-[23px] overflow-hidden p-5 flex flex-col gap-2 border border-white/50 shadow-md transition-colors duration-300 group-hover:bg-white/95">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-orange-600 transition-colors duration-300">Buy a Gift</h2>
            <p className="text-gray-600 flex-grow text-sm">
              Find the perfect gift in seconds.
            </p>
            <button className={`inline-flex items-center justify-center w-full px-5 py-2.5 mt-3 text-sm font-bold transition-all duration-300 border border-transparent rounded-full ${activeMode === 'chat' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg' : 'bg-gray-900 text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-500'}`}>
              Start Gift Finder
            </button>
          </div>
        </div>
        
        {/* Card 2: Track Price */}
        <div className="w-[75vw] sm:w-[280px] md:w-full shrink-0 snap-center group relative rounded-[24px] p-[1px] bg-gradient-to-b from-emerald-400/40 to-green-500/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)] cursor-pointer" onClick={() => setActiveMode('track')}>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-[24px] blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative h-full w-full bg-white/80 backdrop-blur-xl rounded-[23px] overflow-hidden p-5 flex flex-col gap-2 border border-white/50 shadow-md transition-colors duration-300 group-hover:bg-white/95">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">Track Price</h2>
            <p className="text-gray-600 flex-grow text-sm">
              Get price drop alerts instantly.
            </p>
            <button className={`inline-flex items-center justify-center w-full px-5 py-2.5 mt-3 text-sm font-bold transition-all duration-300 border border-transparent rounded-full ${activeMode === 'track' ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg' : 'bg-gray-900 text-white hover:bg-gradient-to-r hover:from-emerald-500 hover:to-green-500'}`}>
              Set Price Alert
            </button>
          </div>
        </div>

        {/* Card 3: Compare Price */}
        <div className="w-[75vw] sm:w-[280px] md:w-full shrink-0 snap-center group relative rounded-[24px] p-[1px] bg-gradient-to-b from-orange-400/40 to-green-400/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_-10px_rgba(249,115,22,0.3)] cursor-pointer" onClick={() => setActiveMode('compare')}>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-green-500 rounded-[24px] blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative h-full w-full bg-white/80 backdrop-blur-xl rounded-[23px] overflow-hidden p-5 flex flex-col gap-2 border border-white/50 shadow-md transition-colors duration-300 group-hover:bg-white/95">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-green-600 transition-all duration-300">Compare Price</h2>
            <p className="text-gray-600 flex-grow text-sm">
              Find the best deal across stores.
            </p>
            <button className={`inline-flex items-center justify-center w-full px-5 py-2.5 mt-3 text-sm font-bold transition-all duration-300 border border-transparent rounded-full ${activeMode === 'compare' ? 'bg-gradient-to-r from-orange-500 to-green-600 text-white shadow-lg' : 'bg-gray-900 text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-green-600'}`}>
              Compare Now
            </button>
          </div>
        </div>
      </div>

      <div id="active-interface" className="scroll-mt-6">
        {activeMode === 'chat' && <AIShopperClient />}
        {activeMode === 'track' && <PriceTracker />}
        {activeMode === 'compare' && <ProductComparator />}
      </div>
    </>
  );
}
