"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function DailyDealsClient({ initialProducts }: { initialProducts: any[] }) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialPlatform = searchParams.get('platform') || 'All';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPlatform, setSelectedPlatform] = useState(initialPlatform);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Update selected states if query params change
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    
    const plat = searchParams.get('platform');
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
      const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
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
    <div className="w-full">
      {/* Advanced Filter / Search Bar */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 mb-8 space-y-4 md:space-y-0 md:flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="Search deals..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
            <FiFilter className="text-gray-500" />
            <select
              className="bg-transparent text-sm text-gray-700 outline-none cursor-pointer"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All" disabled hidden>Category</option>
              {categories.map((cat: string) => (
                <option key={`cat-${cat}`} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
            <FiFilter className="text-gray-500" />
            <select
              className="bg-transparent text-sm text-gray-700 outline-none cursor-pointer"
              value={selectedPlatform}
              onChange={(e) => {
                setSelectedPlatform(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All" disabled hidden>Platform</option>
              {platforms.map((plat: string) => (
                <option key={`plat-${plat}`} value={plat}>{plat}</option>
              ))}
            </select>
          </div>
          
          {(selectedCategory !== 'All' || selectedPlatform !== 'All' || searchTerm !== '') && (
            <button 
              onClick={() => {
                setSelectedCategory('All');
                setSelectedPlatform('All');
                setSearchTerm('');
                setCurrentPage(1);
              }}
              className="text-sm text-red-500 hover:text-red-700 underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="mb-6 flex justify-between items-center text-sm text-gray-500">
        <p>Showing {filteredProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} deals</p>
      </div>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-gray-50 border border-dashed border-gray-300 flex flex-col items-center justify-center p-12 rounded-xl text-center">
             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-gray-400">
                 <FiSearch size={24} />
             </div>
             <h3 className="text-lg font-bold text-gray-800 mb-1">No deals found</h3>
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
        <div className="mt-12 flex justify-center items-center gap-6 font-medium text-gray-600">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-5 py-2.5 border border-gray-200 rounded-xl flex items-center gap-2 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors shadow-sm"
          >
            <FiChevronLeft size={16} /> Prev
          </button>
          
          <span className="text-gray-500 text-sm md:text-base">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-5 py-2.5 border border-gray-200 rounded-xl flex items-center gap-2 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors shadow-sm"
          >
            Next <FiChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
