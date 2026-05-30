"use client";

import { useState, useEffect, useCallback, Suspense } from 'react';
// --- Prismic Client Imports ---
// 1. Import the createClient function from prismic.ts/js file
import { createClient } from '../../prismicio'; 
// 2. Import the prismic client for building queries
import * as prismic from '@prismicio/client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

import ProductCard from '../../components/ProductCard';
import CallToAction from '../../components/CallToAction';
import BrandGrid from '../../components/BrandGrid';
import styles from '../../styles/DealsPage.module.css';
import { 
  FiTag, 
  FiFilter, 
  FiArrowRight, 
  FiAlertCircle, 
  FiChevronLeft, 
  FiChevronRight,
  FiSearch,
  FiLoader,
  FiX,
  FiChevronDown,
  FiArrowLeft
} from 'react-icons/fi';

// To avoid useSearchParams causing a build error in page.js, DealsPage Content will be inside a Suspense Wrapper
function DealsPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q');
  const initialCategory = searchParams.get('category');
  
  // --- State Management ---
  const [products, setProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]); // Will be fetched from Prismic
  const [affiliates, setAffiliates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search, Filter, and Sort State
  const [searchTerm, setSearchTerm] = useState(initialQuery || '');
  const [searchQuery, setSearchQuery] = useState(initialQuery || ''); // Temporary state for the input field
  const [selectedCategories, setSelectedCategories] = useState(initialCategory && initialCategory !== 'All' ? [initialCategory] : []);
  const [sortBy, setSortBy] = useState('default'); // 'default', 'price_asc', 'price_desc'
  
  // Advanced Filter State
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [minDiscount, setMinDiscount] = useState(0);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  
  // UI State
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [categorySearchTerm, setCategorySearchTerm] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  // --- Data Fetching ---
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const client = createClient(); 
    
    try {
      let normalizedProducts = [];
      let total_pages = 1;

      if (searchTerm) {
        // Broad search across the entire site
        try {
          const res = await fetch(`/api/global-search?q=${encodeURIComponent(searchTerm)}`);
          if (res.ok) {
            let data = {};
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
               data = await res.json();
            } else {
               throw new Error("Received HTML instead of JSON from server");
            }
            normalizedProducts = data.results || [];
            
            // Apply local advanced filters on the global results
            if (selectedCategories.length > 0) {
              normalizedProducts = normalizedProducts.filter(p => selectedCategories.includes(p.category));
            }
            if (priceRange.min) {
              normalizedProducts = normalizedProducts.filter(p => p.price >= Number(priceRange.min));
            }
            if (priceRange.max) {
              normalizedProducts = normalizedProducts.filter(p => p.price <= Number(priceRange.max));
            }
            if (minDiscount > 0) {
              normalizedProducts = normalizedProducts.filter(p => p.discount >= minDiscount);
            }
            if (selectedPlatforms.length > 0) {
              normalizedProducts = normalizedProducts.filter(p => selectedPlatforms.includes(p.platform));
            }

            // Client-side sort
            if (sortBy === 'price_asc') {
              normalizedProducts.sort((a, b) => a.price - b.price);
            } else if (sortBy === 'price_desc') {
              normalizedProducts.sort((a, b) => b.price - a.price);
            }
          }
        } catch (err) {
          console.error("Global search failed on deals page", err);
        }
      } else {
        // Standard Prismic filtered search without a strict searchTerm
        const predicates = [
          prismic.predicate.at('document.type', 'product')
        ];
        
        if (selectedCategories.length > 0) {
          predicates.push(prismic.predicate.any('my.product.category', selectedCategories));
        }

        // Advanced Filters
        if (priceRange.min) {
          predicates.push(prismic.predicate.number.greaterThan('my.product.price', Number(priceRange.min)));
        }
        if (priceRange.max) {
          predicates.push(prismic.predicate.number.lessThan('my.product.price', Number(priceRange.max)));
        }
        if (minDiscount > 0) {
          predicates.push(prismic.predicate.number.greaterThan('my.product.discount', minDiscount));
        }
        if (selectedPlatforms.length > 0) {
          predicates.push(prismic.predicate.any('my.product.platform', selectedPlatforms));
        }

        let orderings = [];
        if (sortBy === 'price_asc') {
          orderings.push({ field: 'my.product.price', direction: 'asc' });
        } else if (sortBy === 'price_desc') {
          orderings.push({ field: 'my.product.price', direction: 'desc' });
        } else {
          orderings.push({ field: 'document.first_publication_date', direction: 'desc' });
        }

        const response = await client.get({
          predicates,
          orderings,
          page: currentPage,
          pageSize: itemsPerPage,
        });

        total_pages = response.total_pages;

        normalizedProducts = response.results.map(p => ({
            id: p.id,
            name: p.data.title,
            category: p.data.category,
            price: p.data.price,
            imageUrl: p.data.image,
            amazonLink: p.data.link?.url,
            platform: p.data.platform,
            rating: 0, 
            reviewCount: 0,
            discount: p.data.discount,
        }));
      }

      setProducts(normalizedProducts);
      setTotalPages(total_pages);

    } catch (err) {
      setError("We couldn't load the deals right now. Please try again later.");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedCategories, sortBy, currentPage, priceRange, minDiscount, selectedPlatforms]);

  // Effect to fetch products when dependencies change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // OPTIMIZED: Effect to fetch only the 'category' field to build the filter list
  useEffect(() => {
    const fetchCategories = async () => {
      const client = createClient();
      try {
        // This is much more performant as it only fetches the category field, not the whole document
        const allProductDocs = await client.getAllByType('product', {
            fetch: 'product.category'
        });
        const categories = new Set(allProductDocs.map(p => p.data.category).filter(Boolean)); // .filter(Boolean) removes any null/undefined categories
        setAllCategories(Array.from(categories));
        if (initialCategory && initialCategory !== 'All' && categories.has(initialCategory)) {
          setSelectedCategories([initialCategory]);
        } else if (!initialCategory) {
          setSelectedCategories(Array.from(categories)); // Initially select all
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        // Handle error if needed
      }
    };
    fetchCategories();
  }, []);

  // Fetch Affiliates
  useEffect(() => {
    const fetchAffiliates = async () => {
      const client = createClient();
      try {
        const affiliatesResponse = await client.getAllByType("affiliate");
        const formattedAffiliates = affiliatesResponse.map(doc => ({
          id: doc.id,
          name: doc.data.site_name,
          slug: doc.uid,
          logo: doc.data.logo,
          color: doc.data.brand_colour || '#000000',
        }));
        setAffiliates(formattedAffiliates);
      } catch (err) {
        console.error("Failed to fetch affiliates:", err);
      }
    };
    fetchAffiliates();
  }, []);


  // --- Event Handlers ---
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(searchQuery);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      document.querySelector(`.${styles.dealsGridSection}`)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectAll = () => setSelectedCategories(allCategories);
  const handleDeselectAll = () => setSelectedCategories([]);
  
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };
  
  const applyFilters = () => {
      setCurrentPage(1);
      setShowFilterMenu(false);
      // The main useEffect will automatically refetch the data
  }

  return (
    <>
      <div className={styles.dealsPageContainer}>
        {/* Page Header */}
        <header className={styles.pageHeader} data-aos="fade-in" data-aos-duration="600">
          <div className="container" style={{ position: 'relative' }}>
            <FiTag className={styles.headerIcon} />
            <h1 className={styles.pageTitle}>Find Your Next Great Deal</h1>
            <p className={styles.pageSubtitle}>
              Search top products from Amazon, Flipkart, and more—all in one place, handpicked by experts.
            </p>
            <p className={styles.disclaimer} style={{ color: '#0a0909' }}>We might earn commission on qualifying purchases at no extra cost to you.</p>
          </div>
        </header>

        {/* --- Search, Filter, and Sort Controls --- */}
        <section className={styles.controlsSection} data-aos="fade-up">
          <div className="container">
            <form className={styles.controlsBar} onSubmit={handleSearchSubmit}>
              <div className={styles.searchBox}>
                  <input 
                    type="text" 
                    placeholder="Search for products..."
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className={styles.searchButton} disabled={isLoading}>
                      {isLoading && searchTerm === searchQuery ? <FiLoader className={styles.spinningIcon} /> : <FiSearch />}
                  </button>
              </div>
              
              <div className={styles.filterAndSort}>
                <button type="button" className={styles.controlButton} onClick={() => setShowFilterMenu(true)} disabled={isLoading || error || allCategories.length === 0}>
                    <FiFilter style={{ marginRight: '0.5em' }} /> 
                    Filters ({selectedCategories.length > 0 ? `${selectedCategories.length}/${allCategories.length}` : 'All'})
                </button>
                
                <div className={styles.sortContainer}>
                    <select 
                        className={styles.sortSelect} 
                        value={sortBy} 
                        onChange={(e) => {
                            setSortBy(e.target.value);
                            setCurrentPage(1);
                        }}
                        disabled={isLoading}
                    >
                        <option value="default">Sort by: Newest</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                    </select>
                    <FiChevronDown className={styles.sortIcon} />
                </div>
              </div>
            </form>
          </div>
        </section>

        <BrandGrid affiliates={affiliates} />

        {/* --- Filter Menu Modal --- */}
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
                            onChange={() => handleCategoryChange(cat)}
                          />
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

                {/* Platform Selection */}
                <div className={styles.filterSection}>
                  <span className={styles.filterSectionTitle}>Platforms</span>
                  <div className={styles.categoryList}>
                    {affiliates.length > 0 ? (
                      affiliates.map((plat) => (
                        <div key={plat.id}>
                          <label className={styles.categoryLabel}>
                            <input
                              type="checkbox"
                              className={styles.categoryCheckbox}
                              checked={selectedPlatforms.includes(plat.name)}
                              onChange={() => setSelectedPlatforms(prev => 
                                prev.includes(plat.name) ? prev.filter(p => p !== plat.name) : [...prev, plat.name]
                              )}
                            />
                            {plat.name}
                          </label>
                        </div>
                      ))
                    ) : (
                      ['Amazon', 'Flipkart', 'Ajio', 'Myntra', 'Meesho', 'Blinkit'].map((plat) => (
                        <div key={plat}>
                          <label className={styles.categoryLabel}>
                            <input
                              type="checkbox"
                              className={styles.categoryCheckbox}
                              checked={selectedPlatforms.includes(plat)}
                              onChange={() => setSelectedPlatforms(prev => 
                                prev.includes(plat) ? prev.filter(p => p !== plat) : [...prev, plat]
                              )}
                            />
                            {plat}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Discount Filter */}
                <div className={styles.filterSection}>
                  <span className={styles.filterSectionTitle}>Minimum Discount</span>
                  <div className={styles.discountOptions}>
                    {[10, 20, 30, 50].map((d) => (
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
                <button className={styles.applyFiltersButton} onClick={applyFilters}>
                    Apply Filters
                </button>
              </footer>
            </div>
          </div>
        )}

        {/* Deals Grid Section */}
        <section className={styles.dealsGridSection}>
          <div className="container">
            {isLoading ? (
              <div className={styles.loadingState}>
                <FiLoader className={styles.spinningIcon} />
                <p>Loading Deals...</p>
              </div>
            ) : error ? (
              <div className={styles.noDealsMessage}>
                <FiAlertCircle className={styles.noDealsIcon} />
                <h2>No deals available at the moment. Check again soon!!.</h2>
                <p>{error}</p>
              </div>
            ) : products.length > 0 ? (
              <div className={styles.productGrid}>
                {products.map(product => (
                  <ProductCard key={product.id} product={product} isDeal={false} />
                ))}
              </div>
            ) : (
              <div className={styles.noDealsMessage} >
                <FiAlertCircle className={styles.noDealsIcon} />
                <h2>No Deals Found</h2>
                <p>We couldn't find any deals matching your criteria. Try adjusting your search or filters!</p>
                <CallToAction text="Explore All Products" link="/deals" type="primary" icon={<FiArrowRight />} />
              </div>
            )}
          </div>
        </section>

       {/* Pagination Controls */}
       {!isLoading && totalPages > 1 && (
        <section className={styles.paginationSection}>
          <div className={styles.paginationControls}>
            <button 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1}
              className={styles.pageButton}
            >
              <FiChevronLeft /> Prev
            </button>
            <span className={styles.pageInfo}>Page {currentPage} of {totalPages}</span>
            <button 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === totalPages}
              className={styles.pageButton}
            >
              Next <FiChevronRight />
            </button>
          </div>
        </section>
       )}
      </div>
    </>
  );
}

export default function DealsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading products...</div>}>
      <DealsPageContent />
    </Suspense>
  )
}

