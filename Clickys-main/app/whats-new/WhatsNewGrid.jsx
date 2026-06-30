'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiSearch, FiFilter, FiHeart, FiShare2 } from 'react-icons/fi';

export default function WhatsNewGrid({ pages }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [wishlist, setWishlist] = useState([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [priceRange, setPriceRange] = useState('all');

  useEffect(() => {
    const saved = localStorage.getItem('wishlist_whatsnew');
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const allTags = new Set();
  pages.forEach(page => {
    if (page.tags && Array.isArray(page.tags)) {
      page.tags.forEach(tag => allTags.add(tag));
    }
  });
  let filters = ['All', ...Array.from(allTags)];
  if (filters.length === 1) {
    filters = ['All', 'Tech', 'Home', 'Lifestyle', 'Deals'];
  }

  const filteredPages = pages.filter(page => {
    const title = (page.data.title || '').toLowerCase();
    const description = (page.data.meta_description || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    
    const matchesSearch = title.includes(search) || description.includes(search);
    const matchesFilter = activeFilter === 'All' || (page.tags && page.tags.includes(activeFilter));
    
    // Add logic for price or other advanced filters if data was structured for it
    // For now, we'll keep it simple but functional for the UI request
    return matchesSearch && matchesFilter;
  });

  const handleShare = async (e, uid) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/whats-new/${uid}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this update on Clickys',
          url: url
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const handleWishlist = (e, pageId) => {
    e.preventDefault();
    e.stopPropagation();
    let newWishlist;
    if (wishlist.includes(pageId)) {
      newWishlist = wishlist.filter(id => id !== pageId);
    } else {
      newWishlist = [...wishlist, pageId];
    }
    setWishlist(newWishlist);
    localStorage.setItem('wishlist_whatsnew', JSON.stringify(newWishlist));
  };

  return (
    <div>
      {/* Advanced Search & Filter */}
      <div className="mb-12 bg-white rounded-3xl p-6 shadow-sm border border-orange-100/50">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input 
              type="text" 
              placeholder="Search guides, deals, and updates..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-orange-50/30 border border-orange-200 text-gray-900 rounded-full py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all font-medium"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            {filters.map(f => (
              <button 
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`whitespace-nowrap px-6 py-3 rounded-full font-bold text-sm transition-all ${activeFilter === f ? 'bg-orange-500 text-white shadow-lg' : 'bg-orange-100/50 text-orange-700 hover:bg-orange-200 hover:text-orange-900 border border-orange-200'}`}
              >
                {f}
              </button>
            ))}
            <button 
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center justify-center p-4 rounded-full transition-all shadow-sm ${showAdvancedFilters ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-600 hover:bg-orange-500 hover:text-white border border-orange-200'}`}
              title="Advanced Filters"
            >
              <FiFilter />
            </button>
          </div>
        </div>
        
        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="mt-6 pt-6 border-t border-orange-200 flex flex-wrap gap-6 items-center animate-fade-in">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Sort By</span>
              <select className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-2 text-sm font-bold text-orange-900 outline-none cursor-pointer">
                <option>Newest First</option>
                <option>Oldest First</option>
                <option>Trending</option>
                <option>A-Z</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Content Type</span>
              <div className="flex gap-2">
                {['All', 'Guides', 'Deals', 'Reviews', 'Unboxing'].map(type => (
                  <button key={type} className="px-4 py-2 rounded-xl bg-orange-50 border border-orange-200 text-xs font-bold text-orange-700 hover:bg-orange-400 hover:text-white transition-colors">
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Availability</span>
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-5 h-5 border-2 border-orange-200 rounded bg-white group-hover:border-orange-500 transition-colors"></div>
                <span className="text-xs font-bold text-gray-600 uppercase">Instock Only</span>
              </label>
            </div>
            <div className="ml-auto">
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setActiveFilter('All');
                }}
                className="text-xs font-bold text-orange-600 hover:text-orange-800 transition-colors uppercase tracking-widest underline underline-offset-4"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      {filteredPages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {filteredPages.map((page, i) => {
            const isFeatured = i === 0;
            
            return (
              <div key={page.id} className={`group bg-white rounded-[2.5rem] overflow-hidden flex flex-col shadow-md hover:shadow-2xl transition-all duration-500 ease-out hover:-translate-y-2 border-4 border-orange-100 ring-1 ring-orange-200/50 ${isFeatured ? 'lg:col-span-2' : ''}`}>
                
                {/* Image Section */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-orange-50">
                  <Link 
                    href={`/whats-new/${page.uid}`}
                    className="absolute inset-0 z-10"
                  />
                  
                  {(() => {
                    const img = page.data.featured_image?.url || 
                                page.data.image?.url || 
                                page.data.meta_image?.url ||
                                page.data.slices?.find(s => s.primary?.image?.url)?.primary?.image?.url ||
                                page.data.slices?.find(s => s.slice_type === 'the_shopping_grid')?.primary?.the_items?.[0]?.product_image?.url ||
                                page.data.slices?.find(s => s.slice_type === 'the_shopping_grid')?.items?.[0]?.product_image?.url;
                    
                    if (img) {
                      return (
                        <img 
                          src={img} 
                          alt={page.data.title || "Featured image"}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                        />
                      );
                    }
                    return (
                      <div className="w-full h-full bg-orange-100 flex items-center justify-center font-black text-orange-300 text-3xl">
                        CLICKYS
                      </div>
                    );
                  })()}

                  {/* Top Badges & Actions */}
                  <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-start pointer-events-none">
                    <span className="inline-block bg-orange-500 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl pointer-events-auto">
                      {page.tags && page.tags.length > 0 ? page.tags[0] : 'Fresh Update'}
                    </span>
                    <div className="flex gap-2 pointer-events-auto">
                       <button onClick={(e) => handleWishlist(e, page.id)} className={`bg-white border-2 border-orange-500/10 p-3 rounded-full transition-all shadow-xl hover:scale-110 active:scale-95 ${wishlist.includes(page.id) ? 'bg-orange-500 text-white' : 'text-orange-600 hover:bg-orange-500 hover:text-white'}`}>
                          <FiHeart size={18} className={wishlist.includes(page.id) ? 'fill-current' : ''} />
                       </button>
                       <button onClick={(e) => handleShare(e, page.uid)} className="bg-white hover:bg-orange-500 text-orange-600 hover:text-white border-2 border-orange-500/10 p-3 rounded-full transition-all shadow-xl hover:scale-110 active:scale-95">
                          <FiShare2 size={18} />
                       </button>
                    </div>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-8 md:p-10 flex flex-col flex-grow bg-white">
                  <h2 className={`font-black text-gray-900 mb-4 group-hover:text-orange-600 transition-colors leading-tight ${isFeatured ? 'text-4xl md:text-5xl uppercase italic' : 'text-2xl md:text-3xl'}`}>
                    {page.data.title || page.uid}
                  </h2>
                  <p className="text-gray-600 mb-8 font-bold text-sm md:text-base leading-relaxed line-clamp-3">
                    {page.data.meta_description || "Discover the latest trends and expert insights curated just for you by Clickys."}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-orange-50">
                    <Link href={`/whats-new/${page.uid}`} className="inline-flex items-center text-orange-600 font-black text-xs uppercase tracking-widest hover:text-orange-700 transition-colors group/link">
                      View Full Story <span className="ml-2 group-hover/link:translate-x-2 transition-transform">&gt;&gt;&gt;</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-32 bg-white rounded-[3rem] shadow-sm border border-gray-100">
          <div className="text-6xl mb-6">👀</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">No results found</h2>
          <p className="text-gray-500 text-lg">Try adjusting your search or check back later for fresh content.</p>
        </div>
      )}
    </div>
  );
}
