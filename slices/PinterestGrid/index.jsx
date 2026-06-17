"use client";
import { useState, useMemo, useRef } from 'react';
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import { PrismicRichText, PrismicText } from '@prismicio/react';
import { useSearchParams } from 'next/navigation';
import { Bookmark, ExternalLink, Share2, X, Play, Pause, Eye } from 'lucide-react';

/**
 * @typedef {import("@prismicio/client").Content.PinterestGridSlice} PinterestGridSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<PinterestGridSlice>} PinterestGridProps
 * @param {PinterestGridProps}
 */
const PinterestGrid = ({ slice }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef(null);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q')?.toLowerCase() || '';
  
  const allItems = slice?.primary?.products || [];
  const heading = slice?.primary?.heading;

  const filteredItems = useMemo(() => {
    if (!searchQuery) return allItems;
    return allItems.filter(item => {
      const title = item.product_title?.toLowerCase() || '';
      // Description is RichText, so we might need a better way to filter it if we want thorough search
      // For now we'll just check the title. 
      return title.includes(searchQuery);
    });
  }, [allItems, searchQuery]);

  const getAspectRatioClass = (ratio) => {
    switch (ratio) {
      case 'square': return 'aspect-square';
      case 'portrait': return 'aspect-[3/4]';
      case 'tall': return 'aspect-[2/3]';
      case 'landscape': return 'aspect-[3/2]';
      default: return 'aspect-[3/4]';
    }
  };

  return (
    <section className="max-w-[1400px] mx-auto px-4 py-12">
      {heading && !searchQuery && (
        <div className="mb-10 text-center">
           <h2 className="text-3xl font-bold text-gray-900 mb-2">
             {heading}
           </h2>
           <div className="h-1 w-20 bg-orange-500 mx-auto rounded-full" />
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

      {/* Masonry Grid Container */}
      <div className="columns-2 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 md:gap-6 space-y-3 md:space-y-6">
        {filteredItems.map((item, index) => {
          const aspectRatioClass = getAspectRatioClass(item.aspect_ratio);
          
          return (
            <div 
              key={index} 
              className="break-inside-avoid relative group rounded-xl md:rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col cursor-pointer" 
              onClick={() => setSelectedItem(item)}
            >
              {/* Media Container */}
              <div className={`relative w-full ${aspectRatioClass} overflow-hidden bg-gray-50`}>
                {item.is_video ? (
                  <div className="relative w-full h-full group/video-container">
                    <video 
                      src={item.video_url?.url}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-in-out"
                      muted
                      playsInline
                      loop
                      onClick={(e) => {
                        e.stopPropagation();
                        const video = e.currentTarget;
                        if (video.paused) video.play();
                        else video.pause();
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-opacity">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          const video = e.currentTarget.closest('div').querySelector('video');
                          if (video.paused) video.play();
                          else video.pause();
                        }}
                        className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/40 transition-all transform hover:scale-110"
                      >
                        <Play className="w-6 h-6 fill-current" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <PrismicNextImage 
                    field={item.product_image} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}
                
                {/* Site Badge overlay */}
                <div className="absolute top-2 md:top-4 left-2 md:left-4 bg-white/95 backdrop-blur-md px-2 md:px-3 py-0.5 md:py-1 rounded-full shadow-sm text-[10px] md:text-xs font-bold text-gray-800 z-10 flex items-center gap-1 uppercase">
                  {item.site_name || 'CLICKYS'}
                </div>
              </div>

              {/* Text Content */}
              <div className="p-3 md:p-4 bg-white flex flex-col">
                <h3 className="font-bold text-gray-900 text-sm md:text-base leading-snug line-clamp-1 mb-3">{item.product_title}</h3>
                
                {/* Actions Area */}
                <div className="flex items-center justify-between gap-2">
                   <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItem(item);
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 text-[10px] md:text-xs font-bold py-2 md:py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                   >
                     <Eye className="w-3 h-3 md:w-3.5 h-3.5" />
                     Review
                   </button>
                   <PrismicNextLink 
                    field={item.affiliate_link} 
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-[10px] md:text-xs font-bold py-2 md:py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    Visit <ExternalLink className="w-3 h-3 md:w-3.5 h-3.5" />
                  </PrismicNextLink>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {filteredItems.length === 0 && searchQuery && (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500 font-medium">No results found in inspiration gallery</p>
        </div>
      )}

      {/* Modal Overlay */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedItem(null)}>
          <div 
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 z-20 bg-white/80 backdrop-blur hover:bg-white p-2 rounded-full shadow-sm"
              onClick={() => setSelectedItem(null)}
            >
              <X className="w-5 h-5 text-gray-900" />
            </button>
            
            {/* Visual Side */}
            <div className="w-full md:w-1/2 bg-gray-100 relative min-h-[300px] md:min-h-[500px] flex items-center justify-center group/modal-video">
              {selectedItem.is_video ? (
                <div className="relative w-full h-full">
                  <video 
                    ref={videoRef}
                    src={selectedItem.video_url?.url}
                    className="w-full object-cover h-full"
                    muted
                    playsInline
                    loop
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/modal-video:opacity-100 transition-opacity bg-black/20">
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
                      className="p-4 bg-white/30 backdrop-blur-md rounded-full text-white hover:bg-white/50 transition-all transform hover:scale-110"
                    >
                      {isPaused ? <Play className="w-8 h-8 fill-current" /> : <Pause className="w-8 h-8 fill-current" />}
                    </button>
                  </div>
                </div>
              ) : (
                <PrismicNextImage 
                  field={selectedItem.product_image} 
                  fill 
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}
            </div>

            {/* Content Side */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <span className="bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1 rounded-full">
                  {selectedItem.site_name || 'via Clickys'}
                </span>
                <div className="flex gap-2">
                  <button className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
                    <Share2 className="w-5 h-5 text-gray-700" />
                  </button>
                  <button className="p-2 bg-red-50 hover:bg-red-100 rounded-full transition-colors text-red-600">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{selectedItem.product_title}</h2>
              <div className="text-gray-600 mb-8 leading-relaxed">
                <PrismicRichText field={selectedItem.description} />
              </div>

              <div className="mt-auto pt-6 border-t border-gray-100">
                <PrismicNextLink 
                  field={selectedItem.affiliate_link} 
                  className="w-full block text-center bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3.5 px-6 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  Visit Site <ExternalLink className="w-4 h-4" />
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
