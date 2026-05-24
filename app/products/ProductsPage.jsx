// app/products/page.jsx (or wherever your ProductsPage.jsx is located)
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '../../components/ProductCard';
import styles from '../../styles/ProductsPage.module.css';
import { FiBox, FiFilter, FiSearch, FiX, FiLoader, FiArrowLeft, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { createClient } from '../../prismicio'; 
import * as prismic from '@prismicio/client';
import Link from 'next/link';

export default function ProductsPage({ products: initialProductsList = [] }) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q');

  // State for all fetched products and API status
  const [allProducts, setAllProducts] = useState(initialProductsList);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for search and UI pagination
  const [searchQuery, setSearchQuery] = useState(initialQuery || '');
  
  // Randomizing the search term for placeholder
  const keywords = [
    "Air Fryer", "Blender Mixer Grinder", "Electric Kettle", "Knife Set", 
    "Sandwich Maker", "Hand Blender", "Food Processor", "Fitness Tracker",
    "Yoga Mat", "Protein Powder", "Supplements", "Massager Gun",
    "Dumbbells Set", "Smart Watch", "Bluetooth Speaker", "Wireless Earbuds",
    "Smartphone Accessories", "Power Bank", "Laptop Stand", "Gaming Mouse",
    "Portable SSD", "LED Ring Light", "Men’s T-Shirts", "Women’s Dresses",
    "Sneakers", "Casual Shoes", "Sunglasses", "Leather Wallet",
    "Men’s Watch", "Handbag", "Trendy Tops", "Ethnic Wear",
    "Vitamin C Face Serum", "Moisturizer", "Face Wash", "Face Mask",
    "Skin Brightening Cream", "Night Cream", "Aloe Vera Gel", "Desktop Keypad",
    "School Bag", "Study Table", "Summer Hats", "Men Caps", "Adidas Shoes",
    "Reebok Shoes", "Asus Laptops", "Laptop Batteries", "Soldering Station",
    "Oil Express Machine", "Induction Cooktop", "Nike Shoes", "Women Formal Shoes",
    "Tomatoes", "Bed Sheets", "Camera Lens", "Jackets", "Graphics Card",
    "Socks", "Boxer Shorts", "Trolley Bags", "Electronic Components",
    "Men Underwear", "Diving Deep Panties", "Cookware Set", "Digital Camera",
    "Trimmers", "Gum Set", "Trifold Barber Mirror", "Body Lotion", "Water Bottles"
  ];

  const placeholderSearch = keywords[Math.floor(Math.random() * keywords.length)];

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
  const allPlatforms = ['Amazon', 'Flipkart', 'Meesho', 'Ajio', 'TataCliQ', 'JioMart', 'Firstcry', 'Zara', 'Shopsy'];
  
  const [openSections, setOpenSections] = useState({ categories: true, platform: true, discount: true, price: true });
  const toggleSection = (s) => setOpenSections(prev => ({...prev, [s]: !prev[s]}));

  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [minDiscount, setMinDiscount] = useState(0);

  // Initialize categories from initialProductsList
  useEffect(() => {
    if (initialProductsList.length > 0) {
      const cats = Array.from(new Set(initialProductsList.map(p => p.category).filter(Boolean)));
      setAllCategories(cats);
      setSelectedCategories(cats);
    }
  }, [initialProductsList]);

  const fetchProducts = useCallback(async (query) => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch from API that combines Amazon + Prismic (all document types)
      let combined = [];
      try {
        const queryParam = query || 'All';
        const searchRes = await fetch(`/api/global-search?q=${encodeURIComponent(queryParam)}`);
        if (searchRes.ok) {
          const data = await searchRes.json();
          combined = data.results || [];
        }
      } catch (e) {
        console.error("Global search failed", e);
      }

      setAllProducts(combined);
      
      const newCategories = Array.from(new Set(combined.map(p => p.category).filter(Boolean)));
      if (newCategories.length > 0) {
        setAllCategories(newCategories);
        setSelectedCategories(newCategories);
      }

      if (combined.length === 0 && query !== 'All') {
         // Optionally we could fallback to EVERYTHING if a specific search fails
         // But usually search results should just be empty if no match.
         // However, if the user requested "All", we definitely want data.
      }

    } catch (err) {
      setError(err.message || 'An error occurred while fetching products.');
      setAllProducts(initialProductsList); 
    } finally {
      setIsLoading(false);
    }
  }, [initialProductsList]);

  // Effect to fetch data when the search term changes
  useEffect(() => {
    if (searchTerm) {
      fetchProducts(searchTerm);
    }
  }, [searchTerm, fetchProducts]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === '') return;
    setSearchTerm(searchQuery);
    setDisplayPage(1); // Reset to first page on new search
  };
  
  // Client-side filtering based on categories, price, and discount
  const filteredProducts = useMemo(() => {
    if (allCategories.length === 0) return [];
    
    return allProducts.filter(p => {
      if (selectedPlatforms.length > 0) {
        const matchesPlatform = selectedPlatforms.some(plat => p.platform?.toLowerCase() === plat.toLowerCase());
        if (!matchesPlatform) return false;
      }
      
      const matchesCategory = selectedCategories.includes(p.category);
      
      const price = parseFloat(p.price?.toString().replace(/[^0-9.]/g, '') || '0');
      const matchesPrice = (!priceRange.min || price >= parseFloat(priceRange.min)) &&
                           (!priceRange.max || price <= parseFloat(priceRange.max));
                           
      const discount = parseFloat(p.discount || '0');
      const matchesDiscount = discount >= minDiscount;
      
      return matchesCategory && matchesPrice && matchesDiscount;
    });
  }, [allProducts, selectedCategories, allCategories, priceRange, minDiscount, selectedPlatforms]);

  // Reset page to 1 whenever filters change the product list
  useEffect(() => {
    setDisplayPage(1);
  }, [filteredProducts.length]);

  // Client-side pagination logic
  const itemsPerPage = 12;
  const totalDisplayPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (displayPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, displayPage, itemsPerPage]);

  // Handlers for the new filter menu actions
  const handleSelectAll = () => setSelectedCategories(allCategories);
  const handleDeselectAll = () => setSelectedCategories([]);

  return (
    <>
      <div className={styles.productsPageContainer}>
        <header className={styles.pageHeader} style={{ backgroundColor: '#c09758', backgroundImage: 'none' }}>
          <div className="container" style={{ position: 'relative' }}>
            <Link href="/" style={{ position: 'absolute', top: '-1rem', left: '1rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>
              <FiArrowLeft /> Back to Home
            </Link>
            <FiBox className={styles.headerIcon} />
            <h1 className={styles.pageTitle}>Explore All Products</h1>
            <p className={styles.pageSubtitle} style={{ color: '#ffffff', fontWeight: 'bold' }}>The ultimate collection of our best finds and recommendations.</p>
          </div>
        </header>

        <div className="container">
          <form className={styles.controlsBar} onSubmit={handleSearchSubmit}>
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

        <section className={styles.productsGridSection}>
          <div className="container" style={{ backgroundColor: '#bd8c5c' }}>
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
              <div className={styles.productGrid}>
                {paginatedProducts.map(product => (
                  <ProductCard key={product.id || product.asin} product={product} isDeal={false} />
                ))}
              </div>
            ) : (
              <div className={styles.noProductsMessage}>
                <h2>No Products Found</h2>
                <p>We couldn't find any products matching your search or filters. Try another keyword!</p>
              </div>
            )}
          </div>
        </section>

        {totalDisplayPages > 1 && (
            <div className={styles.paginationControls}>
                <button 
                  className={styles.paginationButton} 
                  onClick={() => setDisplayPage(p => Math.max(1, p - 1))}
                  disabled={displayPage <= 1 || isLoading}
                >
                  &laquo; Previous
                </button>
                <span className={styles.pageInfo}>Page {displayPage} of {totalDisplayPages || 1}</span>
                <button 
                  className={styles.paginationButton}
                  onClick={() => setDisplayPage(p => Math.min(totalDisplayPages, p + 1))}
                  disabled={displayPage >= totalDisplayPages || isLoading}
                >
                  Next &raquo;
                </button>
            </div>
        )}
            </div> {/* End Main Content Area */}
          </div> {/* End flex flex-col md:flex-row gap-6 */}
        </div> {/* End container */}
      </div> {/* End productsPageContainer */}
    </>
  );
}
