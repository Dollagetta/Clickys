"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { PrismicNextImage } from "@prismicio/next";
import { FiArrowRight } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const PartnerCard = ({ partner, index }) => {
  const cardRef = useRef(null);

  const isInView = useInView(cardRef, {
    once: true,
    margin: "-100px",
  });

  const {
    name = "Partner Store",
    slug = "#",
    logo,
    bannerImage,
    description = "",
    themeColor: originalThemeColor = "#f59e0b",
    whatsapp,
  } = partner;

  // Change blue to pale orange if it matches the default blue
  const themeColor = originalThemeColor === "#3b82f6" ? "#ffcc80" : originalThemeColor;

  const isPrismicBanner = typeof bannerImage === "object" && bannerImage?.url;
  const isPrismicLogo = typeof logo === "object" && logo?.url;

  const promoStatus = partner.promotionStripe || "";

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-orange-400 hover:border-orange-500 flex flex-col w-full group relative"
    >
      {/* ================= TOP: BANNER IMAGE ================= */}
      <Link 
        href={`/partners/${slug}`} 
        className="relative w-full aspect-[16/10] shrink-0 overflow-hidden bg-slate-50 group-hover:brightness-95 transition-all duration-300"
      >
        {isPrismicBanner ? (
          <PrismicNextImage
            field={bannerImage}
            fallbackAlt=""
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-slate-100" />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </Link>

      {/* ================= BOTTOM: STORE INFO ================= */}
      <div className="flex-1 flex flex-col p-3 border-t border-orange-200 justify-between bg-white relative transition-colors duration-300 group-hover:bg-slate-50/50">
        {/* Floating Logo */}
        <Link href={`/partners/${slug}`} className="absolute -top-8 left-3 z-10">
          <div className="w-10 h-10 bg-white rounded-lg shadow-md border border-orange-200 overflow-hidden flex items-center justify-center p-1 transition-all duration-500 group-hover:shadow-lg group-hover:-translate-y-2 group-hover:border-orange-400">
            {isPrismicLogo ? (
              <PrismicNextImage
                field={logo}
                fallbackAlt=""
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-slate-50 rounded-lg" />
            )}
          </div>
        </Link>

        {/* Store Info Content */}
        <div className="mt-6">
          <div className="flex flex-col mb-1.5">
            <Link href={`/partners/${slug}`}>
              <h2 className="text-sm font-bold text-slate-900 hover:text-orange-600 transition-colors line-clamp-1">
                {name}
              </h2>
            </Link>
            
            {/* Promotional Badge */}
            {promoStatus && (
              <div className="mt-1.5 flex bg-slate-50 text-slate-800 text-[9px] font-bold rounded-md border border-slate-100 shadow-sm uppercase tracking-[0.1em] self-start overflow-hidden w-24">
                <span className="block px-1.5 py-0.5 whitespace-nowrap animate-marquee-right">
                  {promoStatus}
                </span>
              </div>
            )}
          </div>

          <p className="text-slate-500 leading-tight text-xs mb-3 line-clamp-2 min-h-[32px]">
            {typeof description === "string"
              ? description
              : description?.[0]?.text || "Explore our premium collection of amazing products tailored for you."}
          </p>
        </div>

        {/* BUTTONS */}
        <div className="flex items-center gap-1.5 mt-auto">
          <Link
            href={`/partners/${slug}`}
            className="flex-1 inline-flex items-center justify-center px-3 py-1.5 rounded-md text-white text-xs font-semibold bg-orange-500 hover:bg-orange-600 hover:brightness-105 active:scale-95 transition-all text-center whitespace-nowrap"
          >
            Visit
          </Link>

          {whatsapp && (
            <a
              href={`https://api.whatsapp.com/send/?phone=${String(whatsapp).replace(/[\s-+]/g, "")}&text&type=phone_number&app_absent=0`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center w-8 h-8 shrink-0 rounded-md bg-[#25D366] text-white hover:bg-[#22c35e] active:scale-95 transition-all shadow-sm"
              title="Chat on WhatsApp"
            >
              <FaWhatsapp className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function PartnerSection({ partners = [] }) {
  const [activeShoppers, setActiveShoppers] = useState("50,000+");

  useEffect(() => {
    // 20 random numbers between 20k and 50k
    const numbers = [
      41235, 28450, 31920, 48100, 21500, 39600, 45300, 22400, 36800, 49200,
      23100, 27500, 43900, 34200, 47820, 26941, 30512, 46105, 38710, 24890
    ];
    
    // Cycle every day based on the year's day
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    
    const index = day % numbers.length;
    
    // Format number with commas
    setActiveShoppers(numbers[index].toLocaleString() + "+");
  }, []);

  // If no partners are provided from Prismic, use a placeholder to demonstrate the layout
  const displayPartners = partners.length > 0 ? partners : [
    {
      id: "placeholder-1",
      name: "Demo Partner Store",
      slug: "demo-partner",
      themeColor: "#f59e0b",
      description: "This is a placeholder partner store since no partners were found in Prismic.",
      whatsapp: "1234567890",
    },
    {
      id: "placeholder-2",
      name: "Tech Gadgets Hub",
      slug: "tech-gadgets",
      themeColor: "#ffcc80",
      description: "Explore the latest tech gadgets and accessories with our demo store.",
    }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* ================= HEADING ================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-xl text-left">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-5 group/tag cursor-default"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 bg-slate-100 px-3.5 py-2 rounded-lg group-hover/tag:bg-orange-500 group-hover/tag:text-white transition-all duration-500 shadow-sm border border-slate-200/50">
                Verified Partners
              </span>
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: 48 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="h-[2px] bg-orange-200 group-hover/tag:bg-orange-500 transition-colors duration-500"
              />
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter mb-6 relative group/title">
              Curated Trusted <span className="text-orange-500 relative inline-block transition-transform duration-500 group-hover/title:translate-x-2">Stores</span>
              <div className="absolute -bottom-1 left-0 w-0 h-1.5 bg-orange-100 -z-10 group-hover/title:w-full transition-all duration-700 ease-out" />
            </h2>
            
            <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-lg opacity-80 hover:opacity-100 transition-opacity duration-300">
              Direct access to our verified partners for genuine products and the best available deals.
            </p>
          </div>

          {/* Shopper Count Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ 
              scale: 1.02, 
              translateY: -8,
              boxShadow: "0 20px 40px -15px rgba(249, 115, 22, 0.15)"
            }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="flex items-center gap-5 bg-white p-4 pr-8 rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-slate-100 cursor-pointer group transition-all duration-500"
          >
            <div className="flex -space-x-4">
              {[
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
              ].map((imgUrl, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ 
                    scale: 1.25, 
                    zIndex: 50,
                    translateY: -5,
                    rotate: i % 2 === 0 ? 5 : -5
                  }}
                  className="w-11 h-11 rounded-full border-4 border-white overflow-hidden bg-slate-100 ring-1 ring-slate-100 shadow-md relative group/avatar"
                >
                  <img 
                    src={imgUrl} 
                    alt="Shopper" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-110"
                  />
                  <div className="absolute inset-0 bg-orange-500/0 group-hover/avatar:bg-orange-500/10 transition-colors" />
                </motion.div>
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base md:text-lg font-black text-slate-900 tracking-tight">{activeShoppers}</span>
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              </div>
              <span className="text-[10px] md:text-[11px] text-slate-400 font-bold uppercase tracking-[0.15em] group-hover:text-orange-600 transition-colors">Active Shoppers</span>
            </div>
          </motion.div>
        </div>

        {/* ================= STORE CARDS - Horizontal Scroll Layout ================= */}
        <div className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {displayPartners.map((partner, index) => (
            <div key={partner.id || index} className="flex-none w-[45%] sm:w-64 lg:w-72">
              <PartnerCard
                partner={partner}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}