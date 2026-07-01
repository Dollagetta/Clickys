"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';

export default function FloatingProducts({ category = null }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products
    fetch('/api/global-search')
      .then(res => res.json())
      .then(data => {
        let items = data.results || [];
        if (category) {
            // Simple category match if needed
            items = items.filter(p => p.category && p.category.toLowerCase().includes(category.toLowerCase()));
        }
        // Shuffle
        items = items.sort(() => 0.5 - Math.random());
        // Take 8 for desktop (4 left, 4 right) and mobile
        setProducts(items.slice(0, 8));
      })
      .catch(err => console.error(err));
  }, [category]);

  if (products.length === 0) return null;

  return (
    <>
      {/* Desktop Floating Images - Left and Right Margins */}
      <div className="hidden xl:block fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-90">
        {/* Left Side */}
        <div className="absolute left-[2%] xl:left-[5%] top-[15%] flex flex-col gap-12">
           {products.slice(0, 3).map((p, i) => (
              <ProductNode key={i} product={p} delay={i * 1.5} />
           ))}
        </div>
        {/* Right Side */}
        <div className="absolute right-[2%] xl:right-[5%] top-[25%] flex flex-col gap-12">
           {products.slice(3, 6).map((p, i) => (
              <ProductNode key={i + 3} product={p} delay={i * 1.5 + 0.5} />
           ))}
        </div>
      </div>

      {/* Mobile & Tablet - Grid at the bottom of the page */}
      <div className="xl:hidden w-full mt-20 px-4 pb-16">
        <h3 className="text-2xl font-black text-center mb-8 text-gray-900 tracking-tight">Trending Inspiration</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p, i) => (
            <ProductNodeMobile key={i} product={p} />
            ))}
        </div>
      </div>
    </>
  );
}

function ProductNode({ product, delay }) {
  const getLogo = (link) => {
      if (!link) return "Shop";
      if (link.toLowerCase().includes('amazon')) return "Amazon";
      if (link.toLowerCase().includes('flipkart')) return "Flipkart";
      if (link.toLowerCase().includes('myntra')) return "Myntra";
      if (link.toLowerCase().includes('ajio')) return "Ajio";
      if (link.toLowerCase().includes('jiomart')) return "JioMart";
      if (link.toLowerCase().includes('shopsy')) return "Shopsy";
      if (link.toLowerCase().includes('blinkit')) return "Blinkit";
      return "Store";
  };

  return (
    <motion.div 
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
        className="pointer-events-auto w-40 bg-white rounded-3xl p-3 shadow-[0_10px_40px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col items-center hover:scale-105 transition-transform duration-300"
    >
      <Link href={product.internalLink || product.link || '#'} target={product.internalLink ? "_self" : "_blank"} className="flex flex-col items-center w-full">
        <div className="w-full h-32 relative bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center p-2 mb-3">
            {product.image ? <img src={product.image} alt={product.title} className="max-w-full max-h-full object-contain mix-blend-multiply" /> : <div className="text-gray-300 text-3xl">🎁</div>}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-[#eb7125] bg-orange-50 px-2 py-1.5 rounded-lg w-full text-center truncate">
            {getLogo(product.link)}
        </span>
      </Link>
    </motion.div>
  );
}

function ProductNodeMobile({ product }) {
  const getLogo = (link) => {
      if (!link) return "Shop";
      if (link.toLowerCase().includes('amazon')) return "Amazon";
      if (link.toLowerCase().includes('flipkart')) return "Flipkart";
      if (link.toLowerCase().includes('myntra')) return "Myntra";
      if (link.toLowerCase().includes('ajio')) return "Ajio";
      if (link.toLowerCase().includes('jiomart')) return "JioMart";
      if (link.toLowerCase().includes('shopsy')) return "Shopsy";
      if (link.toLowerCase().includes('blinkit')) return "Blinkit";
      return "Store";
  };

  return (
    <Link href={product.internalLink || product.link || '#'} target={product.internalLink ? "_self" : "_blank"} className="bg-white rounded-3xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
        <div className="w-full h-36 relative bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center p-3 mb-4 group">
            {product.image ? <img src={product.image} alt={product.title} className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" /> : <div className="text-gray-300 text-4xl">🎁</div>}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-[#eb7125] bg-orange-50 px-3 py-1.5 rounded-lg w-full text-center truncate">
            {getLogo(product.link)}
        </span>
    </Link>
  );
}
