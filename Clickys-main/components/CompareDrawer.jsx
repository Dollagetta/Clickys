"use client";

import React from "react";
import { useCompare } from "./CompareContext";
import { FiX, FiCheck, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function CompareDrawer() {
  const { compareItems, isCompareDrawerOpen, setIsCompareDrawerOpen, removeFromCompare, clearCompare } = useCompare();

  if (!isCompareDrawerOpen || compareItems.length === 0) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
        onClick={() => setIsCompareDrawerOpen(false)}
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 rounded-t-3xl border-t border-gray-100 max-h-[85vh] overflow-y-auto"
      >
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-600 rounded-lg p-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </span>
              Compare Products
            </h2>
            <div className="flex items-center gap-4">
              <button 
                onClick={clearCompare}
                className="text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors"
              >
                Clear All
              </button>
              <button 
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsCompareDrawerOpen(false); }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                title="Close"
              >
                <FiX className="text-2xl text-gray-500" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Features Column Label */}
            <div className="hidden xl:flex flex-col gap-4 text-sm font-semibold text-gray-500 uppercase tracking-widest pt-48">
              <div className="h-12 flex items-center px-4">Price</div>
              <div className="h-32 flex items-center px-4">Description</div>
              <div className="h-24 flex items-center px-4">Pros</div>
              <div className="h-24 flex items-center px-4">Cons</div>
              <div className="h-16 flex items-center px-4">Link</div>
            </div>

            {compareItems.map((product) => {
              const rawImage = product.imageUrl || product.logo || product.bannerImage || product.image || product.customImage || product.thumbnail_image_url || product.image_url;
              let image = typeof rawImage === 'object' && rawImage !== null && rawImage.url 
                  ? rawImage.url 
                  : typeof rawImage === 'string' ? rawImage : null;

              if (!image) {
                const pName = product.name || product.product_title || 'Product';
                image = `https://placehold.co/600x400/2ECC71/1A1A1A?text=${encodeURIComponent(pName)}&font=Inter`;
              }

              const link = product.affiliate_link || product.affiliateLink || product.link || product.amazon_link || product.contactLink || '#';
              const price = product.price || product.discounted_price || product.currentPrice || 'Check Price';
              
              const rawDesc = product.description || product.product_description || product.shortDescription;
              let descriptionText = "No description available.";
              if (typeof rawDesc === 'string') {
                  descriptionText = rawDesc;
              } else if (Array.isArray(rawDesc) && rawDesc.length > 0 && rawDesc[0].text) {
                  descriptionText = rawDesc[0].text;
              }

              // Handle Prismic Rich Text optionally
              const pros = product.pros ? (typeof product.pros === 'string' ? [product.pros] : product.pros.map(p => p.text)) : ['High performance', 'Durable'];
              const cons = product.cons ? (typeof product.cons === 'string' ? [product.cons] : product.cons.map(c => c.text)) : ['Slightly heavy'];

              let buyLabel = 'Buy Now';
              if (product.platform === 'Amazon') {
                buyLabel = 'Buy on Amazon';
              } else if (product.partner_name || product.platform) {
                buyLabel = `Buy from ${product.partner_name || product.platform}`;
              }

              return (
                <div key={product.id || product.asin} className="bg-gray-50 rounded-2xl p-6 relative flex flex-col">
                  <button 
                    onClick={() => removeFromCompare(product.id || product.asin)}
                    className="absolute top-4 right-4 bg-white/80 hover:bg-red-500 hover:text-white p-2 rounded-full shadow-sm transition-all"
                  >
                    <FiX />
                  </button>
                  <div className="h-32 mb-4 bg-white rounded-xl overflow-hidden flex items-center justify-center p-2 relative shadow-sm">
                    {image ? (
                      <img src={image} alt={product.name || product.product_title} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <div className="text-gray-400 text-sm italic">No Image</div>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-6 line-clamp-2 h-14" title={product.name || product.product_title}>
                    {product.name || product.product_title}
                  </h3>
                  
                  <div className="flex flex-col gap-4 flex-1">
                    <div className="xl:h-12 bg-white rounded-xl flex items-center justify-center px-4 shadow-sm border border-gray-100">
                      <span className="xl:hidden text-xs font-bold text-gray-400 uppercase mr-auto">Price</span>
                      <span className="font-extrabold text-blue-600 text-xl">{price}</span>
                    </div>

                    <div className="xl:h-32 bg-white rounded-xl p-4 flex flex-col overflow-y-auto border border-gray-100 shadow-sm">
                      <span className="xl:hidden text-xs font-bold text-gray-600 uppercase mb-2">Description</span>
                      <p className="text-sm text-gray-700 leading-snug line-clamp-4" title={descriptionText}>
                        {descriptionText}
                      </p>
                    </div>

                    <div className="xl:h-24 bg-green-50 rounded-xl p-4 flex flex-col overflow-y-auto shadow-inner">
                      <span className="xl:hidden text-xs font-bold text-green-600 uppercase mb-2">Pros</span>
                      <ul className="text-sm text-green-800 space-y-1">
                         {pros.map((p, i) => (
                           <li key={i} className="flex items-start gap-1">
                             <FiCheck className="text-green-500 mt-1 shrink-0" /> <span className="line-clamp-2" title={p || "N/A"}>{p || "N/A"}</span>
                           </li>
                         ))}
                      </ul>
                    </div>

                    <div className="xl:h-24 bg-red-50 rounded-xl p-4 flex flex-col overflow-y-auto shadow-inner">
                      <span className="xl:hidden text-xs font-bold text-red-600 uppercase mb-2">Cons</span>
                      <ul className="text-sm text-red-800 space-y-1">
                         {cons.map((c, i) => (
                           <li key={i} className="flex items-start gap-1">
                             <FiX className="text-red-500 mt-1 shrink-0" /> <span className="line-clamp-2" title={c || "N/A"}>{c || "N/A"}</span>
                           </li>
                         ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6">
                    <a 
                      href={link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full xl:h-16 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all text-sm px-2 text-center"
                    >
                      {buyLabel} <FiChevronRight />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </>
  );
}
