"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function DailyDealsClient({ initialProducts }: { initialProducts: any[] }) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams?.get('category') || 'All';
  const initialPlatform = searchParams?.get('platform') || 'All';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPlatform, setSelectedPlatform] = useState(initialPlatform);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Update selected states if query params change
  useEffect(() => {
    const cat = searchParams?.get('category');
    if (cat) setSelectedCategory(cat);
    
    const plat = searchParams?.get('platform');
    if (plat) setSelectedPlatform(plat);
  }, [searchParams]);

  // Responsive items per page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(4);
      } else {
        setItemsPerPage(12);
      }
    };
    
    // Set initial value
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Extract unique categories and platforms for filters
  const categories = useMemo(() => {
    const cats = new Set<string>(initialProducts.map(p => p.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [initialProducts]);

  const platforms = useMemo(() => {
    const plats = new Set<string>(initialProducts.map(p => p.platform).filter(Boolean));
    return ['All', ...Array.from(plats)];
  }, [initialProducts]);

  // Filter products based on search and dropdowns
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(product => {
      const matchesSearch = 
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.platform?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false;
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesPlatform = selectedPlatform === 'All' || product.platform === selectedPlatform;
      return matchesSearch && matchesCategory && matchesPlatform;
    });
  }, [initialProducts, searchTerm, selectedCategory, selectedPlatform]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full" style={{ backgroundColor: '#b43939' }}>
      {/* Back button */}

      {/* Advanced Filter / Search Bar */}
      <div className="bg-white p-5 md:p-8 rounded-3xl shadow-sm border border-gray-100 mb-10 space-y-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400 w-5 h-5" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 md:py-5 border-none bg-gray-50 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:bg-white transition-all text-base md:text-lg font-medium placeholder-gray-400 text-gray-900"
            placeholder="Search products, brands, or categories..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 no-scrollbar snap-x">
            <div className="flex items-center space-x-2 bg-white px-4 py-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors shrink-0 snap-center shadow-sm">
              <FiFilter className="text-orange-500 shrink-0" />
              <select
                className="bg-transparent text-sm md:text-base font-semibold text-gray-700 outline-none cursor-pointer pr-4"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="All">All Categories</option>
                {categories.filter(c => c !== 'All').map((cat: string) => (
                  <option key={`cat-${cat}`} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2 bg-white px-4 py-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors shrink-0 snap-center shadow-sm">
              <FiFilter className="text-orange-500 shrink-0" />
              <select
                className="bg-transparent text-sm md:text-base font-semibold text-gray-700 outline-none cursor-pointer pr-4"
                value={selectedPlatform}
                onChange={(e) => {
                  setSelectedPlatform(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="All">All Platforms</option>
                {platforms.filter(c => c !== 'All').map((plat: string) => (
                  <option key={`plat-${plat}`} value={plat}>{plat}</option>
                ))}
              </select>
            </div>
          </div>
          
          {(selectedCategory !== 'All' || selectedPlatform !== 'All' || searchTerm !== '') && (
            <button 
              onClick={() => {
                setSelectedCategory('All');
                setSelectedPlatform('All');
                setSearchTerm('');
                setCurrentPage(1);
              }}
              className="text-sm font-semibold text-red-500 hover:text-red-700 bg-red-50 px-4 py-3 rounded-xl transition-colors shrink-0"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-gray-50 border border-dashed border-gray-300 flex flex-col items-center justify-center p-12 rounded-xl text-center">
             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-gray-400">
                 <FiSearch size={24} />
             </div>
             <h3 className="text-lg font-bold text-gray-800 mb-1">No products found</h3>
             <p className="text-gray-500">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {currentProducts.map((product, idx) => (
            <ProductCard key={product.id || idx} product={product} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6 pb-4">
          <div className="flex w-full md:w-auto items-center overflow-x-auto no-scrollbar pb-2 px-1 snap-x gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 shrink-0 snap-center rounded-full font-semibold transition-all shadow-sm flex items-center justify-center border
                  ${currentPage === page 
                    ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-orange-500 hover:text-orange-500'}`}
              >
                {page}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-5 py-3 bg-white border border-gray-200 rounded-xl flex items-center gap-2 hover:border-orange-500 hover:text-orange-500 disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-600 transition-all shadow-sm font-semibold text-gray-600"
            >
              <FiChevronLeft size={18} /> Prev
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-5 py-3 bg-white border border-gray-200 rounded-xl flex items-center gap-2 hover:border-orange-500 hover:text-orange-500 disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-600 transition-all shadow-sm font-semibold text-gray-600"
            >
              Next <FiChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
