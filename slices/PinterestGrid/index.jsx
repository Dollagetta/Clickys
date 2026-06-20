"use client";
import { useState, useMemo, useRef, useEffect } from 'react';
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import { PrismicRichText, PrismicText } from '@prismicio/react';
import { useSearchParams } from 'next/navigation';
import { Bookmark, ExternalLink, Share2, X, Play, Pause, Eye, ChevronLeft } from 'lucide-react';

/**
 * @typedef {import("@prismicio/client").Content.PinterestGridSlice} PinterestGridSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<PinterestGridSlice>} PinterestGridProps
 * @param {PinterestGridProps}
 */
const PinterestGrid = ({ slice }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const videoRef = useRef(null);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q')?.toLowerCase() || '';
  
  useEffect(() => {
    if (selectedItem && selectedItem.is_video && videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(err => {
        console.log("Autoplay with sound blocked, trying muted:", err);
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play();
        }
      });
    }
  }, [selectedItem]);

  const excludedTitles = [
    "Foldable Drone Pro Plus",
    "Velvet Evening Blazer",
    "Luxe Velvet Armchair",
    "Smart Garden Starter Kit"
  ];

  const allItems = (slice?.primary?.products || []).filter(item => 
    !excludedTitles.includes(item.product_title) && 
    item.product_title !== 'Curated Product' &&
    item.product_title !== 'Curated Style' &&
    item.product_title !== ''
  );
  const heading = slice?.primary?.heading;

  const filteredItems = useMemo(() => {
    if (!searchQuery) return allItems;
    return allItems.filter(item => {
      const title = item.product_title?.toLowerCase() || '';
      return title.includes(searchQuery);
    });
  }, [allItems, searchQuery]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage]);

  const getAspectRatioClass = (ratio) => {
    switch (ratio) {
      case 'square': return 'aspect-square';
      case 'portrait': return 'aspect-[4/5]';
      case 'tall': return 'aspect-[3/4]';
      case 'landscape': return 'aspect-[4/3]';
      default: return 'aspect-[4/5]';
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      {heading && !searchQuery && (
        <div className="mb-12 text-center">
           <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
             {heading}
           </h2>
           <div className="h-1.5 w-24 bg-orange-500 mx-auto rounded-full" />
        </div>
      )}

      {searchQuery && (
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Search Results for "{searchQuery}"
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Found {filteredItems.length} products matching your search in this gallery.
          </p>
        </div>
      )}

      {/* Horizontal Layout Container */}
      <div className="columns-2 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 md:gap-6 w-full max-w-7xl mx-auto">
        {paginatedItems.map((item, index) => {
          const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560343776-97e7d202ff0e?q=80&w=1080';
          const aspectRatioClass = getAspectRatioClass(item.aspect_ratio);
          
          return (
            <div 
              key={index} 
              className={`break-inside-avoid relative mb-3 md:mb-6 group rounded-xl md:rounded-2xl ${playingVideoId === index ? 'z-50 overflow-visible' : 'overflow-hidden'} bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col cursor-pointer`} 
              onClick={() => setSelectedItem(item)}
            >
              {/* Media Container */}
              <div className={`relative w-full ${aspectRatioClass} ${playingVideoId !== index ? 'overflow-hidden' : ''} bg-white flex-shrink-0 rounded-t-xl md:rounded-t-2xl`}>
                {item.is_video ? (
                  <>
                    <div className="absolute inset-0 flex flex-row w-full h-full">
                      <div className="relative w-1/2 h-full group/video-container border-r border-gray-100 bg-gray-100">
                        <video 
                          src={item.video_url?.url}
                          className="object-cover w-full h-full"
                          autoPlay
                          muted
                          playsInline
                          loop
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setPlayingVideoId(index);
                            }}
                            className="bg-white/40 backdrop-blur-md p-2.5 md:p-3 rounded-full text-gray-900 border border-white/50 shadow-lg pointer-events-auto transition-transform transform hover:scale-110"
                          >
                            <Play className="w-4 h-4 md:w-5 md:h-5 fill-current pl-0.5" />
                          </button>
                        </div>
                      </div>
                      <div className="relative w-1/2 h-full bg-white">
                        <PrismicNextImage 
                          field={item.product_image?.url ? item.product_image : { url: FALLBACK_IMAGE, alt: item.product_title }} 
                          fill 
                          className="object-contain p-1 group-hover:scale-105 transition-transform duration-700 ease-in-out"
                          sizes="(max-width: 768px) 50vw, 25vw"
                          quality={100}
                        />
                      </div>
                    </div>
                    {playingVideoId === index && (
                      <div className="absolute inset-[-12px] md:inset-[-20px] z-[60] bg-black rounded-2xl shadow-2xl overflow-hidden scale-105 transition-all outline outline-4 outline-white/20 flex flex-col">
                        <video 
                          src={item.video_url?.url}
                          className="w-full h-full object-contain bg-black"
                          autoPlay
                          controls
                          playsInline
                          loop
                        />
                        <button 
                          onClick={(e) => { e.stopPropagation(); setPlayingVideoId(null); }}
                          className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-bold flex items-center gap-1 hover:bg-black/70 transition-colors border border-white/10"
                        >
                          <ChevronLeft className="w-3 h-3" /> Back
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 bg-white">
                    <PrismicNextImage 
                      field={item.product_image?.url ? item.product_image : { url: FALLBACK_IMAGE, alt: item.product_title }} 
                      fill 
                      className="object-contain p-1 group-hover:scale-105 transition-transform duration-700 ease-in-out"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      quality={100}
                    />
                  </div>
                )}
                
                {/* Site Badge overlay */}
                <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full shadow-sm text-[10px] font-bold text-gray-800 z-10 flex items-center gap-1 uppercase tracking-wider">
                  {item.site_name || 'CLICKYS'}
                </div>
              </div>

              {/* Text Side - Minimal View */}
              <div className="p-3 md:p-4 bg-white flex flex-col justify-center flex-1">
                <h3 className="font-bold text-gray-900 text-sm md:text-base leading-snug line-clamp-2 md:mb-3 mb-2">
                  {item.product_title}
                </h3>
                
                {/* Core Actions */}
                <div className="flex flex-col gap-2 mt-auto">
                   <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItem(item);
                    }}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 text-[10px] md:text-xs font-bold py-2 md:py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                   >
                     <Eye className="w-3.5 h-3.5" />
                     Review Only
                   </button>
                   <PrismicNextLink 
                    field={item.affiliate_link} 
                    onClick={(e) => e.stopPropagation()}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white text-[10px] md:text-xs font-bold py-2 md:py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    Shop Now <ExternalLink className="w-3.5 h-3.5" />
                  </PrismicNextLink>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-6 py-2.5 bg-white border border-gray-200 rounded-full font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" /> Previous Frame
          </button>
          <span className="font-medium text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
            Frame {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-6 py-2.5 bg-white border border-gray-200 rounded-full font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-2"
          >
            Next Frame <ChevronLeft className="w-4 h-4 rotate-180" />
          </button>
        </div>
      )}

      {filteredItems.length === 0 && searchQuery && (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500 font-medium">No results found in inspiration gallery</p>
        </div>
      )}

      {/* Modal Overlay */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedItem(null)}>
          <div 
            className="bg-white rounded-2xl w-full max-w-5xl h-[85vh] md:h-[80vh] flex flex-col md:flex-row shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Navigation */}
            <div className="absolute top-4 left-4 right-4 z-[60] flex justify-between pointer-events-none">
              <button 
                className="bg-white/95 backdrop-blur hover:bg-white px-3 py-2 rounded-xl shadow-lg text-[11px] uppercase tracking-wider font-extrabold flex items-center gap-1.5 transition-all text-gray-900 border border-gray-200 pointer-events-auto active:scale-95"
                onClick={() => setSelectedItem(null)}
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button 
                className="bg-white/95 backdrop-blur hover:bg-white p-2.5 rounded-full shadow-lg transition-all border border-gray-200 pointer-events-auto active:scale-95"
                onClick={() => setSelectedItem(null)}
              >
                <X className="w-4 h-4 text-gray-900" />
              </button>
            </div>
            
            {/* Visual Side */}
            <div className="w-full md:w-1/2 bg-gray-50 relative h-1/2 md:h-full flex flex-row group/modal-video border-b md:border-b-0 md:border-r border-gray-200/50 shrink-0">
              {selectedItem.is_video ? (
                <>
                  <div className="relative w-1/2 h-full border-r border-gray-200/50 bg-black/5">
                    <video 
                      ref={videoRef}
                      src={selectedItem.video_url?.url}
                      className="w-full h-full object-contain p-1"
                      autoPlay
                      playsInline
                      loop
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/modal-video:opacity-100 transition-opacity bg-black/10">
                      <button 
                        onClick={() => {
                          if (videoRef.current) {
                            if (videoRef.current.paused) {
                              videoRef.current.play();
                              setIsPaused(false);
                            } else {
                              videoRef.current.pause();
                              setIsPaused(true);
                            }
                          }
                        }}
                        className="p-3 bg-white/50 backdrop-blur-md rounded-full text-gray-900 hover:bg-white transition-all transform hover:scale-110 shadow-lg"
                      >
                        {isPaused ? <Play className="w-6 h-6 fill-current" /> : <Pause className="w-6 h-6 fill-current" />}
                      </button>
                    </div>
                  </div>
                  <div className="relative w-1/2 h-full">
                    <PrismicNextImage 
                      field={selectedItem.product_image} 
                      fill 
                      className="object-contain p-2 md:p-6"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      quality={100}
                    />
                  </div>
                </>
              ) : (
                <div className="relative w-full h-full">
                  <PrismicNextImage 
                    field={selectedItem.product_image} 
                    fill 
                    className="object-contain p-4 py-8 md:p-8"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={100}
                  />
                </div>
              )}
            </div>

            {/* Content Side */}
            <div className="w-full md:w-1/2 flex flex-col h-1/2 md:h-full bg-white">
              <div className="p-5 md:p-10 flex-grow overflow-y-auto">
                <div className="flex items-center justify-between mb-4 md:mb-6 pt-2 md:pt-8">
                  <span className="bg-orange-100 text-orange-800 text-[10px] md:text-xs font-black px-3 py-1.5 rounded-md uppercase tracking-widest shadow-sm">
                    {selectedItem.site_name || 'via Clickys'}
                  </span>
                  <div className="flex gap-2">
                    <button className="p-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-full transition-colors shadow-sm active:scale-95">
                      <Share2 className="w-4 h-4 text-gray-700" />
                    </button>
                    <button className="p-2 bg-red-50 border border-red-100 hover:bg-red-100 rounded-full transition-colors text-red-600 shadow-sm active:scale-95">
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <h2 className="text-xl md:text-3xl font-extrabold text-gray-900 mb-3 md:mb-4 leading-tight tracking-tight">
                  {selectedItem.product_title}
                </h2>
                <div className="text-gray-600 text-sm md:text-base leading-relaxed space-y-4">
                  <PrismicRichText field={selectedItem.description} />
                </div>
              </div>

              <div className="p-4 md:p-6 bg-gray-50 border-t border-gray-100 flex-shrink-0">
                <PrismicNextLink 
                  field={selectedItem.affiliate_link} 
                  className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 md:py-4 px-8 rounded-xl transition-all shadow-md active:scale-[0.98] text-[14px] md:text-[15px] uppercase tracking-wide"
                >
                  Shop Now <ExternalLink className="w-4 h-4" />
                </PrismicNextLink>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PinterestGrid;
