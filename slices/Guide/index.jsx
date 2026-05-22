"use client";

import React from "react";
import Link from "next/link";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";

/**
 * @typedef {import("@prismicio/client").Content.GuideSlice} GuideSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<GuideSlice>} GuideProps
 * @param {GuideProps}
 */
const Guide = ({ slice }) => {
  // Estimate read time
  let readTime = 4; // default
  if (slice.primary.description) {
    const textContent = JSON.stringify(slice.primary.description);
    const wordCount = textContent.split(/\s+/).length;
    readTime = Math.max(3, Math.ceil(wordCount / 200)); // assuming 200 wpm, min 3
  }

  return (
    <div
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="group relative flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(249,115,22,0.35)] hover:border-orange-300 hover:-translate-y-1"
    >
      {/* Read Time Tag */}
      <div className="absolute top-3 right-3 z-20 bg-white/95 backdrop-blur-md text-red-600 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1 border border-red-100">
        <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {readTime} min read
      </div>

      {/* Image Container */}
      <div className="relative w-full h-32 sm:h-48 md:h-56 overflow-hidden bg-gray-50 flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
        {slice.primary.image ? (
          <PrismicNextImage
            field={slice.primary.image}
            fill
            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
            fallbackAlt=""
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            <svg
              className="w-8 h-8 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-3 sm:p-5 flex flex-col flex-grow bg-white">
        {slice.primary.title && (
          <h3 className="text-sm sm:text-xl font-black text-gray-900 mb-1.5 sm:mb-2 line-clamp-2 tracking-tight transition-colors group-hover:text-red-600">
            {slice.primary.title}
          </h3>
        )}

        {slice.primary.description && (
          <div className="text-gray-500 text-xs sm:text-sm leading-snug mb-3 sm:mb-6 line-clamp-2 prose prose-slate">
            <PrismicRichText field={slice.primary.description} />
          </div>
        )}

        <div className="mt-auto pt-3 sm:pt-4 border-t border-gray-100 flex flex-col xl:flex-row xl:items-center justify-between gap-3 xl:gap-0">
          <span className="text-[10px] sm:text-xs text-gray-400 font-semibold tracking-wide whitespace-nowrap">
            {slice.primary.date ? slice.primary.date : "Latest Guide"}
          </span>

          <div className="flex space-x-2 items-center">
            <Link
              href={slice.docUid ? `/guide/${slice.docUid}` : '#'}
              className="inline-flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-bold text-gray-700 transition-all duration-300 bg-gray-100 rounded-full hover:bg-gray-200 hover:shadow-md"
            >
              Read
            </Link>

            {slice.primary.link && (
              <PrismicNextLink
                field={slice.primary.link}
                className="inline-flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-bold text-white transition-all duration-300 bg-gray-900 rounded-full hover:bg-orange-500 hover:shadow-[0_4px_10px_-2px_rgba(249,115,22,0.4)]"
              >
                Buy
                <svg
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1 sm:ml-1.5 hidden sm:block"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </PrismicNextLink>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guide;
