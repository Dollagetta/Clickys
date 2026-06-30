'use client';

import React, { useState, useEffect, useRef } from 'react';
import GuideCard from '../../components/guides/GuideCard';

function CustomDropdown({ options, value, onChange, placeholder, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || { label: placeholder, value: '' };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className="w-full h-full py-4 px-4 rounded-xl border border-gray-200 text-gray-800 font-medium bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-left flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{selectedOption.label}</span>
        <svg className={`w-5 h-5 text-gray-400 ml-2 flex-shrink-0 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg top-full left-0 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${value === option.value ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-700'}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function GuidesListClient({ initialGuides, initialTotalPages, allPlatforms = [] }) {
  const [guides, setGuides] = useState(initialGuides);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [platform, setPlatform] = useState('');
  
  const paginationControlsRef = useRef(null);

  const fetchGuides = async (currentPage, currentSearch, currentCategory, currentPlatform) => {
    setLoading(true);
    try {
      let url = `/api/guides?page=${currentPage}&limit=12`;
      if (currentSearch) url += `&q=${encodeURIComponent(currentSearch)}`;
      if (currentCategory) url += `&category=${encodeURIComponent(currentCategory)}`;
      if (currentPlatform) url += `&platform=${encodeURIComponent(currentPlatform)}`;
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setGuides(data.guides);
        setTotalPages(data.totalPages);
        setPage(data.page);
      }
    } catch (error) {
      console.error('Error fetching guides:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchGuides(1, searchQuery, category, platform);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchQuery, category, platform]);

  const goToPage = (p) => {
    if (p < 1 || p > totalPages || p === page) return;
    fetchGuides(p, searchQuery, category, platform);
  };
  
  const handleScrollPagination = (direction) => {
    if (paginationControlsRef.current) {
        const amount = direction === 'left' ? -200 : 200;
        paginationControlsRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  }

  const pagesArray = [];
  for (let i = 1; i <= totalPages; i++) {
    pagesArray.push(i);
  }

  return (
    <div style={{ backgroundColor: "#782828" }}>
      {/* Search and Filter */}
      <div className="mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full flex-grow">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            type="text"
            className="w-full pl-11 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800 transition-all font-medium text-lg placeholder:text-gray-400 bg-gray-50 hover:bg-white"
            placeholder="Search guides, products, tips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
           {/* Simple advanced filter for Category */}
           <CustomDropdown 
             className="w-full sm:w-48"
             value={category}
             onChange={(val) => setCategory(val)}
             placeholder="All Categories"
             options={[
               { value: '', label: 'All Categories' },
               { value: 'Office', label: 'Office' },
               { value: 'Automotive', label: 'Automotive' },
               { value: 'Health', label: 'Health' },
               { value: 'Electronics', label: 'Electronics' },
               { value: 'Home', label: 'Home' },
               { value: 'Games', label: 'Games' },
               { value: 'Beauty', label: 'Beauty' },
               { value: 'Fashion', label: 'Fashion' },
               { value: 'Kitchen', label: 'Kitchen' },
               { value: 'Pet Supplies', label: 'Pet Supplies' },
             ]}
           />
           
           <CustomDropdown 
             className="w-full sm:w-48"
             value={platform}
             onChange={(val) => setPlatform(val)}
             placeholder="All Platforms"
             options={[
               { value: '', label: 'All Platforms' },
               ...allPlatforms.map(p => ({ value: p, label: p.charAt(0).toUpperCase() + p.slice(1).toLowerCase() }))
             ]}
           />
        </div>
      </div>

      {loading ? (
          <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
      ) : guides.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guides.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-4 bg-white py-4 px-6 rounded-full shadow-sm border border-gray-100 max-w-fit mx-auto">
              
              <button 
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-4 py-2"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                Prev
              </button>
              
              {/* Sliding numeric pagination */}
              <div className="relative group overflow-hidden max-w-[300px] flex items-center">
                  {/* Left Scroll Arrow (Visible on hover if needed) */}
                  <button onClick={() => handleScrollPagination('left')} className="absolute left-0 z-10 bg-gradient-to-r from-white to-transparent h-full px-1 text-gray-400 hover:text-gray-900">
                     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"/></svg>
                  </button>

                  <div 
                    ref={paginationControlsRef}
                    className="flex items-center gap-2 overflow-x-auto scrollbar-hide px-6 scroll-smooth snap-x"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {pagesArray.map((p) => (
                      <button
                        key={p}
                        onClick={() => goToPage(p)}
                        className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold transition-all border snap-center ${
                          page === p 
                            ? 'bg-orange-500 text-white border-orange-500 shadow-md' 
                            : 'bg-white text-gray-600 border-gray-200 hover:border-orange-400 hover:text-orange-500'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  {/* Right Scroll Arrow */}
                  <button onClick={() => handleScrollPagination('right')} className="absolute right-0 z-10 bg-gradient-to-l from-white to-transparent h-full px-1 text-gray-400 hover:text-gray-900">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"/></svg>
                  </button>
              </div>

              <button 
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className="flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-4 py-2"
              >
                Next
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
              </button>

            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-lg">No guides available matching your search. Please try again!</p>
        </div>
      )}
    </div>
  );
}
