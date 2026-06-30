"use client";

import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import styles from '../styles/ProductDetailPage.module.css';

export default function RecentlyViewed({ currentProduct }) {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    if (!currentProduct || (!currentProduct.id && !currentProduct.slug)) return;

    // Load from local storage
    const stored = localStorage.getItem('recentlyViewed');
    let items = stored ? JSON.parse(stored) : [];

    // Filter out current
    const existsIndex = items.findIndex(item => (item.id && item.id === currentProduct.id) || (item.slug && item.slug === currentProduct.slug));
    
    // Determine the product to save (we need enough data for the ProductCard)
    const productToSave = { ...currentProduct };

    if (existsIndex > -1) {
      items.splice(existsIndex, 1);
    }
    
    // Add to front
    items.unshift(productToSave);
    
    // Keep only last 10
    if (items.length > 10) {
      items = items.slice(0, 10);
    }

    localStorage.setItem('recentlyViewed', JSON.stringify(items));
    
    // Set for display (excluding current product)
    setRecentlyViewed(items.filter(item => item.slug !== currentProduct.slug).slice(0, 4));
  }, [currentProduct]);

  if (recentlyViewed.length === 0) return null;

  return (
    <section className={styles.relatedProductsSection} data-aos="fade-up" style={{ marginTop: '3rem' }}>
      <h2 className={styles.sectionTitle} style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Recently Viewed</h2>
      <div className={styles.relatedGrid}>
        {recentlyViewed.map(prod => (
          <ProductCard key={prod.id || prod.slug || Math.random()} product={prod} />
        ))}
      </div>
    </section>
  );
}
