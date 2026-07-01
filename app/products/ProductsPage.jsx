// app/products/ProductsPage.jsx
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../../components/ProductCard';
import styles from '../../styles/ProductsPage.module.css';
import { FiBox, FiFilter, FiSearch, FiX, FiLoader, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { createClient } from '../../prismicio'; 
import * as prismic from '@prismicio/client';
import Link from 'next/link';
import LimitedTimeDeals from '../whats-new/LimitedTimeDeals';

export default function ProductsPage({ products: initialProductsList = [], productsByPlatform = {} }) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q');

  // State for all fetched products and API status
  const [allProducts, setAllProducts] = useState(initialProductsList);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // State for search and UI pagination
  const [searchQuery, setSearchQuery] = useState(initialQuery || '');
  
  // Randomizing the search term for placeholder
  const keywords = ["Air Fryer", "Smart Watch", "Sneakers", "Face Serum", "Gaming Mouse", "Water Bottles", "Laptop Stand"];
  const placeholderSearch = useMemo(() => keywords[Math.floor(Math.random() * keywords.length)], [keywords]); // eslint-disable-line react-hooks/exhaustive-deps

  // If no initial query, we want to fetch EVERYTHING, not a random keyword.
  const [searchTerm, setSearchTerm] = useState(initialQuery || 'All');
  const [displayPage, setDisplayPage] = useState(1);

  // State for client-side category filtering
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const platformParam = searchParams.get('platform');
  const [selectedPlatforms, setSelectedPlatforms] = useState(platformParam ? [platformParam] : []);
  
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [minDiscount, setMinDiscount] = useState(0);

  // Initialize categories from initialProductsList and allProducts
  useEffect(() => {
    const combinedList = [...initialProductsList, ...allProducts];
    if (combinedList.length > 0) {
      const cats = Array.from(new Set(combinedList.map(p => p.category).filter(Boolean)));
      setAllCategories(prev => {
         const merged = Array.from(new Set([...prev, ...cats]));
         return merged;
      });
      // Ensure that if we have categories but none are selected, we select all of them
      setSelectedCategories(prev => {
         if (prev.length === 0) return cats;
         // If new categories are added from a broad search, we might want to include them
         // but only if the user hasn't manually narrowed it down too much.
         // For now, let's just merge them if we were already in "show everything" mode.
         if (prev.length === initialProductsList.length && prev.length > 0) return cats; 
         return prev;
      });
    }
  }, [initialProductsList, allProducts]);

  const fetchProducts = useCallback(async (query) => {
    setIsLoading(true);
    setError(null);
    try {
      let combined = [];
      try {
        const queryParam = query || 'All';
        const searchRes = await fetch(`/api/global-search?q=${encodeURIComponent(queryParam)}`);
        
        const contentType = searchRes.headers.get("content-type");
        if (searchRes.ok && contentType && contentType.includes("application/json")) {
           const data = await searchRes.json();
           const results = data.results || [];
           if (results.length > 0 || queryParam !== 'All') {
             combined = results;
           } else {
             combined = initialProductsList;
           }
        } else if (queryParam === 'All') {
           // Fallback to initial if broad search fails
           combined = initialProductsList;
        }
      } catch (e) {
        console.error("Global search failed", e);
        if (query === 'All') combined = initialProductsList;
      }

      setAllProducts(combined);
      
      const newCategories = Array.from(new Set(combined.map(p => p.category).filter(Boolean)));
      if (newCategories.length > 0) {
        setAllCategories(prev => Array.from(new Set([...prev, ...newCategories])));
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching products.');
    } finally {
      setIsLoading(false);
    }
  }, [initialProductsList]);

  // Effect to fetch data when the search term changes
  useEffect(() => {
    // Rely on server fallback data for 'All' products to avoid clearing list if API fails
    if (searchTerm === 'All') {
       if (isFirstLoad) setIsFirstLoad(false);
       return;
    }

    if (searchTerm) {
      if (isFirstLoad) setIsFirstLoad(false);
      fetchProducts(searchTerm);
    }
  }, [searchTerm, fetchProducts, isFirstLoad]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === '') return;
    setSearchTerm(searchQuery);
    setDisplayPage(1); // Reset to first page on new search
  };
  
  // Client-side filtering based on categories, price, and discount
  const filteredProducts = useMemo(() => {
    // If we're on the 'All' search and allProducts is empty (e.g. fetch failed), 
    // we can use initialProductsList as a final safety net.
    // Otherwise, we respect exactly what's in allProducts (including empty results from a real search).
    const list = (searchTerm === 'All' && allProducts.length === 0) ? initialProductsList : allProducts;
    
    return list.filter(p => {
      if (selectedPlatforms.length > 0) {
        const matchesPlatform = selectedPlatforms.some(plat => p.platform?.toLowerCase() === plat.toLowerCase());
        if (!matchesPlatform) return false;
      }
      
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
      
      const price = parseFloat(p.price?.toString().replace(/[^0-9.]/g, '') || '0');
      const matchesPrice = (!priceRange.min || price >= parseFloat(priceRange.min)) &&
                           (!priceRange.max || price <= parseFloat(priceRange.max));
                            
      const discount = parseFloat(p.discount || '0');
      const matchesDiscount = discount >= minDiscount;
      
      return matchesCategory && matchesPrice && matchesDiscount;
    });
  }, [allProducts, initialProductsList, selectedCategories, priceRange, minDiscount, selectedPlatforms, searchTerm]);

  // Reset page to 1 whenever filters change the product list
  useEffect(() => {
    setDisplayPage(1);
  }, [filteredProducts.length]);

  // Client-side pagination logic
  const itemsPerPage = 50;
  const totalDisplayPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (displayPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, displayPage, itemsPerPage]);

  // CATEGORIZED FRAMES FOR THE BOTTOM
  const frames = useMemo(() => {
    const frameCategories = ['Fashion', 'Electronics', 'Beauty'];
    return frameCategories.map(cat => {
      // First try to find products in this category from the CURRENT search results
      let catProducts = allProducts.filter(p => p.category?.toLowerCase() === cat.toLowerCase());
      
      // If we don't have enough from current search results, pull from the INITIAL pool to ensure the frame is full
      if (catProducts.length < 6) {
        const initialCatProducts = initialProductsList.filter(p => p.category?.toLowerCase() === cat.toLowerCase());
        const missingCount = 6 - catProducts.length;
        const extraProducts = initialCatProducts
          .filter(p => !catProducts.find(cp => (cp.id === p.id || cp.asin === p.asin)))
          .sort(() => 0.5 - Math.random())
          .slice(0, missingCount);
        catProducts = [...catProducts, ...extraProducts];
      }

      // Final shuffle and take 6
      return {
        title: cat,
        products: catProducts.sort(() => 0.5 - Math.random()).slice(0, 6)
      };
    });
  }, [allProducts, initialProductsList]);

  // Handlers for the new filter menu actions
  const handleSelectAll = () => setSelectedCategories(allCategories);
  const handleDeselectAll = () => setSelectedCategories([]);

  return (
    <>
      <div className={styles.productsPageContainer}>
        <header id="products-header" className={styles.pageHeader} style={{ backgroundColor: '#c09758', backgroundImage: 'none' }}>
          <div className="w-full" style={{ position: 'relative' }}>
            <FiBox className={styles.headerIcon} />
            <h1 id="products-title" className={styles.pageTitle}>Explore All Products</h1>
            <p className={styles.pageSubtitle} style={{ color: '#ffffff', fontWeight: 'bold' }}>Discover our ultimate collection of handpicked tech, home, and lifestyle essentials.</p>
          </div>
        </header>

        <div className="w-full">
          <form id="search-controls" className={styles.controlsBar} onSubmit={handleSearchSubmit}>
            <div className={styles.searchAndFilter}>
                {/* --- UPDATED: Integrated Search Bar --- */}
                <div className={styles.searchBox}>
                    <input 
                      type="text" 
                      placeholder={`Try searching "${placeholderSearch}"...`}
                      className={styles.searchInput}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className={styles.searchButton} disabled={isLoading}>
                        {isLoading ? <FiLoader className={styles.spinningIcon} /> : <FiSearch />}
                    </button>
                </div>
                <button type="button" className={styles.controlButton} onClick={() => setShowFilterMenu(true)} disabled={isLoading || error}>
                    <FiFilter style={{ marginRight: '0.5em' }} /> Filters ({selectedCategories.length}/{allCategories.length})
                </button>
            </div>
          </form>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Main Content Area */}
            <div className="flex-1 w-full overflow-hidden">

        {/* Top Deals Sections Removed */}
        
        {showFilterMenu && (
          <div className={styles.filterOverlay} onClick={() => setShowFilterMenu(false)}>
            <div className={styles.filterMenu} onClick={(e) => e.stopPropagation()}>
              <header className={styles.filterHeader}>
                <h2><FiFilter /> Advanced Filters</h2>
                <button onClick={() => setShowFilterMenu(false)} className={styles.closeFilterButton}><FiX /></button>
              </header>

              <div className={styles.filterMenuContent}>
                {/* Category Selection */}
                <div className={styles.filterSection}>
                  <span className={styles.filterSectionTitle}>Categories</span>

                  <div className={styles.searchBox} style={{ marginBottom: '1rem' }}>
                    <input 
                      type="text" 
                      placeholder="Search categories..."
                      className={styles.searchInput}
                      value={categorySearchTerm}
                      onChange={(e) => setCategorySearchTerm(e.target.value)}
                    />
                  </div>

                  <div className={styles.filterActions}>
                    <button onClick={handleSelectAll}>All</button>
                    <button onClick={handleDeselectAll}>None</button>
                  </div>
                  <ul className={styles.categoryList}>
                    {allCategories
                      .filter(cat => cat.toLowerCase().includes(categorySearchTerm.toLowerCase()))
                      .map((cat) => (
                      <li key={cat}>
                        <label className={styles.categoryLabel}>
                          <input
                            type="checkbox"
                            className={styles.categoryCheckbox}
                            value={cat}
                            checked={selectedCategories.includes(cat)}
                            onChange={(e) => {
                              const { checked, value } = e.target;
                              setSelectedCategories((prev) =>
                                checked ? [...prev, value] : prev.filter((c) => c !== value)
                              );
                            }}
                          />
                          <span className={styles.customCheckbox}></span>
                          {cat}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price Range Selection */}
                <div className={styles.filterSection}>
                  <span className={styles.filterSectionTitle}>Price Range (INR)</span>
                  <div className={styles.rangeInputs}>
                    <input 
                      type="number" 
                      placeholder="Min" 
                      value={priceRange.min} 
                      onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                      className={styles.rangeInput}
                    />
                    <span className={styles.rangeSeparator}>-</span>
                    <input 
                      type="number" 
                      placeholder="Max" 
                      value={priceRange.max} 
                      onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                      className={styles.rangeInput}
                    />
                  </div>
                </div>

                {/* Discount Filter */}
                <div className={styles.filterSection}>
                  <span className={styles.filterSectionTitle}>Minimum Discount</span>
                  <div className={styles.discountOptions}>
                    {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((d) => (
                      <button 
                        key={d}
                        className={`${styles.discountPill} ${minDiscount === d ? styles.discountPillActive : ''}`}
                        onClick={() => setMinDiscount(prev => prev === d ? 0 : d)}
                      >
                        {d}%+ Off
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <footer className={styles.filterFooter}>
                <button className={styles.showResultsButton} onClick={() => setShowFilterMenu(false)}>
                  Show {filteredProducts.length} Results
                </button>
              </footer>
            </div>
          </div>
        )}

        <section id="products-listing" className={styles.productsGridSection}>
          <div className="w-full">
            {isLoading ? (
              <div className={styles.loadingState}>
                <FiLoader className={styles.loaderIcon} />
                <p>Loading products...</p>
              </div>
            ) : error ? (
              <div className={styles.noProductsMessage}>
                <h2>An Error Occurred</h2>
                <p>{error}</p>
              </div>
            ) : paginatedProducts.length > 0 ? (
                <div 
                  className={styles.productGrid}
                  style={{ backgroundColor: '#6d2808', borderRadius: '24px', padding: '1.5rem', opacity: 1 }}
                >
                  {paginatedProducts.map(product => (
                    <ProductCard key={product.id || product.asin} product={product} isDeal={false} />
                  ))}
                </div>
            ) : (
              <div className={styles.noProductsMessage}>
                <h2>No Products Found</h2>
                <p>Try searching for something else or adjusting your filters!</p>
              </div>
            )}
          </div>
        </section>

        {totalDisplayPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12 mb-8 select-none">
              <button 
                className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#c09758] text-[#c09758] hover:bg-[#c09758] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed group active:scale-95"
                onClick={() => setDisplayPage(p => Math.max(1, p - 1))}
                disabled={displayPage <= 1 || isLoading}
                aria-label="Previous Page"
              >
                <FiChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              
              <div className="flex overflow-hidden relative h-12 px-4 items-center bg-white border-2 border-[#c09758]/20 rounded-full shadow-sm">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={displayPage}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex flex-col items-center justify-center min-w-[120px]"
                  >
                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 leading-none mb-1">Navigation</span>
                    <span className="text-sm font-black text-gray-900 leading-none">
                      {displayPage} <span className="text-gray-300 mx-1">/</span> {totalDisplayPages}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

              <button 
                className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#c09758] text-[#c09758] hover:bg-[#c09758] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed group active:scale-95"
                onClick={() => setDisplayPage(p => Math.min(totalDisplayPages, p + 1))}
                disabled={displayPage >= totalDisplayPages || isLoading}
                aria-label="Next Page"
              >
                <FiChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
        )}

        {/* Featured Category Frames removed */}

        <section id="limited-time-deals-section" className="mt-20 pt-16 border-t-2 border-gray-100 mb-20">
           <LimitedTimeDeals productsByPlatform={productsByPlatform} allProducts={allProducts} />
        </section>
            </div> {/* End Main Content Area */}
          </div> {/* End flex flex-col md:flex-row gap-6 */}
        </div> {/* End w-full */}
      </div> {/* End productsPageContainer */}
    </>
  );
}
