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
      let apiProducts = [];
      
      // Use internal products list as baseline
      const internalBase = initialProductsList.length > 0 ? initialProductsList : [];
      
      if (internalBase.length === 0) {
        try {
          const mod = await import('../../components/products');
          apiProducts = mod.products || [];
        } catch (e) {
          console.error("Local products failed", e);
        }
      } else {
        apiProducts = internalBase.map(p => ({
          ...p,
          platform: p.platform || 'Amazon' // Default to Amazon for local products
        }));
      }

      // If a specific query is provided, filter the local products
      if (query && query !== 'All') {
        const q = query.toLowerCase();
        apiProducts = apiProducts.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.category.toLowerCase().includes(q) ||
          p.platform?.toLowerCase().includes(q)
        );
      }

      // Fetch from Prismic
      const client = createClient();
      const predicates = [
        prismic.predicate.at('document.type', 'product')
      ];
      
      if (query && query !== 'All') {
        predicates.push(prismic.predicate.fulltext('my.product.title', query));
      }

      let prismicProducts = [];
      try {
        // Use getAllByType for comprehensive fetching
        const prismicRes = await client.getAllByType('product', { 
          predicates,
          orderings: [{ field: 'document.first_publication_date', direction: 'desc' }]
        });
        
        prismicProducts = prismicRes.map(p => ({
            id: p.id,
            name: p.data.title,
            category: p.data.category || 'General',
            price: p.data.price,
            imageUrl: p.data.image,
            amazonLink: p.data.link?.url,
            platform: p.data.platform || 'Amazon',
            rating: 0, 
            reviewCount: 0,
            discount: p.data.discount,
            featuredFind: p.data.featured_find === true,
            promotionalStatus: p.data.promotional_status || "",
            availabilityStatus: p.data.availability_status || "",
        }));
      } catch(e) {
        console.error("Prismic fetch failed", e);
      }

      let combined = [...apiProducts, ...prismicProducts];

      // De-duplicate by name or ID if needed, but for now just combine
      // If we still have nothing and it's a search, maybe fallback to all?
      // Or just show "No products found" which is better UX for search.

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
                <button type="button" className={`${styles.controlButton} md:hidden`} onClick={() => setShowFilterMenu(true)} disabled={isLoading || error}>
                    <FiFilter style={{ marginRight: '0.5em' }} /> Filters ({selectedCategories.length}/{allCategories.length})
                </button>
            </div>
          </form>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar Desktop Filter */}
            <aside className="hidden md:block w-72 shrink-0 bg-white border border-gray-200 p-6 rounded-2xl h-max sticky top-24 self-start shadow-sm">
              <h2 className="text-2xl font-extrabold mb-6 flex items-center pb-4 text-gray-900 border-b">Filter</h2>
              
              {/* CATEGORIES ACCORDION */}
              <div className="mb-6 border-b pb-6">
                <button 
                  onClick={() => toggleSection('categories')} 
                  className="w-full flex justify-between items-center font-bold text-gray-900 tracking-wider uppercase text-sm mb-4"
                >
                  CATEGORIES
                  {openSections.categories ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                </button>
                
                {openSections.categories && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="mb-3">
                      <input 
                        type="text" 
                        placeholder="Search categories..."
                        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={categorySearchTerm}
                        onChange={(e) => setCategorySearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2 mb-3">
                      <button className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 font-medium" onClick={handleSelectAll}>Select All</button>
                      <button className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 font-medium" onClick={handleDeselectAll}>Clear</button>
                    </div>
                    <ul className="max-h-64 overflow-y-auto pr-2 space-y-3 text-sm text-gray-800">
                      {allCategories
                        .filter(cat => cat.toLowerCase().includes(categorySearchTerm.toLowerCase()))
                        .map((cat) => (
                        <li key={cat}>
                          <label className="flex items-center cursor-pointer hover:text-orange-600 transition-colors">
                            <input
                              type="checkbox"
                              className="mr-3 w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                              value={cat}
                              checked={selectedCategories.includes(cat)}
                              onChange={(e) => {
                                const { checked, value } = e.target;
                                setSelectedCategories((prev) =>
                                  checked ? [...prev, value] : prev.filter((c) => c !== value)
                                );
                              }}
                            />
                            <span className="truncate text-base">{cat}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* PLATFORM ACCORDION */}
              <div className="mb-6 border-b pb-6">
                <button 
                  onClick={() => toggleSection('platform')} 
                  className="w-full flex justify-between items-center font-bold text-gray-900 tracking-wider uppercase text-sm mb-4"
                >
                  PLATFORM
                  {openSections.platform ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                </button>
                
                {openSections.platform && (
                  <ul className="space-y-3 text-sm text-gray-800 animate-in fade-in slide-in-from-top-2 duration-200">
                    {allPlatforms.map(plat => (
                      <li key={plat}>
                        <label className="flex items-center cursor-pointer hover:text-orange-600 transition-colors">
                          <input
                            type="checkbox"
                            className="mr-3 w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                            value={plat}
                            checked={selectedPlatforms.includes(plat)}
                            onChange={(e) => {
                              const { checked, value } = e.target;
                              setSelectedPlatforms(prev => 
                                checked ? [...prev, value] : prev.filter(p => p !== value)
                              );
                            }}
                          />
                          <span className="truncate text-base">{plat}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* DISCOUNT ACCORDION */}
              <div className="mb-6 border-b pb-6">
                <button 
                  onClick={() => toggleSection('discount')} 
                  className="w-full flex justify-between items-center font-bold text-gray-900 tracking-wider uppercase text-sm mb-4"
                >
                  DISCOUNT %
                  {openSections.discount ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                </button>

                {openSections.discount && (
                  <div className="space-y-3 text-sm text-gray-800 animate-in fade-in slide-in-from-top-2 duration-200">
                    {[10, 20, 30, 40, 50, 60, 70, 80].map((d) => (
                      <label key={d} className="flex items-center cursor-pointer hover:text-orange-600 transition-colors">
                        <input
                          type="radio"
                          name="discount_min"
                          className="mr-3 w-4 h-4 text-orange-600 focus:ring-orange-500"
                          checked={minDiscount === d}
                          onChange={() => setMinDiscount(d)}
                        />
                        <span className="text-base">Min {d}% Off</span>
                      </label>
                    ))}
                    {minDiscount > 0 && (
                      <button 
                        onClick={() => setMinDiscount(0)} 
                        className="text-xs text-blue-600 hover:underline mt-2 inline-block font-medium"
                      >
                        Clear Discount Filter
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* PRICE ACCORDION */}
              <div>
                <button 
                  onClick={() => toggleSection('price')} 
                  className="w-full flex justify-between items-center font-bold text-gray-900 tracking-wider uppercase text-sm mb-4"
                >
                  PRICE
                  {openSections.price ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                </button>

                {openSections.price && (
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <input 
                      type="number" 
                      placeholder="Min" 
                      value={priceRange.min} 
                      onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                      className="w-full text-base border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <span className="text-gray-400 font-bold">-</span>
                    <input 
                      type="number" 
                      placeholder="Max" 
                      value={priceRange.max} 
                      onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                      className="w-full text-base border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                )}
              </div>
            </aside>

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
