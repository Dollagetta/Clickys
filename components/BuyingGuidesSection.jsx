"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PrismicNextImage } from "@prismicio/next";

export default function BuyingGuidesSection() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const res = await fetch("/api/whats-new");
        if (!res.ok) throw new Error("Failed to fetch whats new");
        let data = [];
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
           data = await res.json();
        } else {
           throw new Error("Received HTML instead of JSON from server");
        }
        setGuides(data.slice(0, 3)); // Only show latest 3 guides
      } catch (err) {
        console.error("Error fetching guides:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGuides();
  }, []);

  if (loading) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading guides...</p>
        </div>
      </section>
    );
  }

  if (!guides || guides.length === 0) {
    return null; // Return nothing if no guides
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16 mt-8 border-t border-gray-100">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          What's New
        </h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
          Latest product insights, updates and recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {guides.map((guide) => (
          <div
            key={guide.id}
            className="group relative flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)] hover:-translate-y-1"
          >
            {/* Image Container */}
            <div className="relative w-full h-56 md:h-64 overflow-hidden bg-gray-100">
              <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors z-10 duration-300" />
              {guide.imageField?.url ? (
                <PrismicNextImage
                  field={guide.imageField}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  fallbackAlt=""
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                  <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
              )}
              {/* Category Label */}
              {guide.category && (
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-blue-600/90 backdrop-blur-sm rounded-full shadow-lg">
                    {guide.category}
                  </span>
                </div>
              )}
            </div>

            {/* Content Container */}
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 transition-colors group-hover:text-blue-600">
                {guide.title || "Untitled Guide"}
              </h3>
              
              <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                {guide.excerpt || "Discover top recommendations and detailed insights in this comprehensive buying guide."}
              </p>

              <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">
                  {guide.date ? new Date(guide.date).toLocaleDateString() : "Recent"}
                </span>
                
                <Link
                  href={`/whats-new/${guide.slug}`}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white transition-all duration-200 bg-gray-900 rounded-full hover:bg-blue-600 hover:shadow-md"
                >
                  Read More
                  <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
