"use client";
// This will be a Server Component by default.
// Client Components (like ProductCard, CallToAction, AnimatedPageWrapper) will be used within it.
 // Adjust path if your components folder is elsewhere
import ProductCard from '../../components/ProductCard';
import CallToAction from '../../components/CallToAction';
import styles from '../../styles/DealsPage.module.css'; // Create this CSS Module
import { FiTag, FiFilter, FiArrowRight, FiAlertCircle } from 'react-icons/fi'; // Icons for the page
import {useMemo, useState } from 'react';


export default function DealsPage({products}) {
  // For now, we'll display all placeholder deal products.
  const [filterTerm, setFilterTerm] = useState('all');

  const allCategories = useMemo(
      () => Array.from(new Set(products.map((p) => p.category))),
      [products]
    );
    
const currentDeals = useMemo(() => {
  if (filterTerm === 'all') {
    return products;
  }
  return products.filter(product => product.category === filterTerm);
}
, [filterTerm, products]);

    
  return (
    <>
      <div className={styles.dealsPageContainer}>
        {/* Page Header */}
        <header className={styles.pageHeader} data-aos="fade-in" data-aos-duration="600">
          <div className="container">
            <FiTag className={styles.headerIcon} />
            <h1 className={styles.pageTitle}>Today's Hottest FlipKart Deals</h1>
            <p className={styles.pageSubtitle}>
              Exclusive discounts and special offers, updated regularly. Don't miss out on these amazing savings!
            </p>
          </div>
        </header>

        {/* Filters Section */}
        <section className={styles.filtersSection} data-aos="fade-up">
            <div className="container">
                <div className={styles.filterControls}>
                    <h3 className={styles.filterTitle}><FiFilter /> Filter Deals By:</h3>
                    <div className={styles.filterButtons}>
                        {/* These would typically be interactive buttons */}
                        <button className={`${styles.filterButton} ${filterTerm === 'all' ?  styles.active : ''} `} onClick={() => setFilterTerm('all')} id="all-deals-button">
                        All Deals</button>
                        {allCategories.map((category) => (
                            <button 
                                key={category} 
                                className={`${styles.filterButton} ${filterTerm === category ?  styles.active : ''}`} 
                                onClick={() => setFilterTerm(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
        {/* Deals Grid Section */}
        <section className={styles.dealsGridSection}>
          <div className="container">
            {currentDeals.length > 0 ? (
              <div className={styles.productGrid}>
                {currentDeals.map(product => (
                  // Pass `isDeal={false}` to ProductCard
                  <ProductCard key={product.name} product={product} isDeal={false} />
                ))}
              </div>
            ) : (
              <div className={styles.noDealsMessage} data-aos="fade-up">
                <FiAlertCircle className={styles.noDealsIcon} />
                <h2>No Deals Currently Available</h2>
                <p>We couldn't find any active deals matching your criteria right now. Please check back later, as we update our offers frequently!</p>
                <CallToAction text="Explore All Products" link="/products" type="primary" icon={<FiArrowRight />} />
              </div>
            )}
          </div>
        </section>

       {/* Pagination cntrols */ }
        
        {/* Optional: Call to action for newsletter or other pages */}

      </div>
    </>
  );
}
