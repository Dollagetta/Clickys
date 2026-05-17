'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from './ProductCard';
import { ProductGridSkeleton } from './ProductGridSkeleton';
import styles from '../styles/DealsPage.module.css'; // Just reuse some styles
import { FiLoader, FiAlertCircle, FiChevronLeft, FiChevronRight, FiArrowLeft } from 'react-icons/fi';
import { createClient } from '../prismicio';
import * as prismic from '@prismicio/client';

export default function HomeSearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q');
  const cat = searchParams.get('category');
  const discount = parseInt(searchParams.get('discount') || '0', 10);
  const isSearching = searchParams.has('q') || searchParams.has('category') || (searchParams.has('discount') && searchParams.get('discount') !== '0');

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const fetchProducts = useCallback(async () => {
    if (!isSearching) {
      setProducts([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      let apiProducts = [];
      try {
        // For Amazon, if no query, use a generic high-volume term or the category
        const queryParam = (q && q.trim() !== '') ? q : (cat && cat !== 'All' ? cat : 'Trending'); 
        const amazonRes = await fetch(`/api/amazon/search?q=${encodeURIComponent(queryParam)}`);
        if (amazonRes.ok) {
          const data = await amazonRes.json();
          apiProducts = data.products || [];
        }
      } catch (err) {
        console.error('Failed to load Amazon API products', err);
      }

      const client = createClient();
      const predicates = [prismic.predicate.at('document.type', 'product')];
      if (q && q.trim() !== '') {
         predicates.push(prismic.predicate.fulltext('my.product.title', q));
      }
      if (cat && cat !== 'All') {
         predicates.push(prismic.predicate.at('my.product.category', cat));
      }

      let prismicProducts = [];
      try {
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
            discount: p.data.discount || 0,
        }));
      } catch (e) {
         console.error("Prismic fetch failed", e);
      }

      let combined = [...apiProducts, ...prismicProducts];
      if (discount > 0) {
        combined = combined.filter(p => p.discount >= discount);
      }
      
      if (combined.length === 0) {
        setError('No products found matching your search. Try adjusting your filters.');
      }
      setProducts(combined);
      setCurrentPage(1);
    } catch (err) {
      setError('An error occurred while fetching products.');
    } finally {
      setIsLoading(false);
    }
  }, [isSearching, q, cat, discount]);

  useEffect(() => {
    if (isSearching) {
      fetchProducts();
    }
  }, [isSearching, fetchProducts]);

  if (!isSearching) return null;

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (p) => {
    setCurrentPage(p);
    // Maybe scroll to top of this section
  };

  return (
    <section className={styles.section} style={{ padding: '4rem 0', backgroundColor: '#f9f9f9', borderTop: '2px solid #eaeaea', borderBottom: '2px solid #eaeaea' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#111', margin: 0 }}>
            Search Results {q && q !== 'All' ? `for "${q}"` : ''}
          </h2>
          <button 
            onClick={() => window.location.href = '/'}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              padding: '0.6rem 1.2rem', 
              backgroundColor: '#fff', 
              border: '2px solid #e2e8f0', 
              borderRadius: '100px', 
              color: '#475569', 
              fontWeight: 600, 
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.color = '#10b981'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; }}
          >
            <FiArrowLeft /> Back to Home
          </button>
        </div>
        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            <FiAlertCircle size={40} style={{ margin: '0 auto 1rem', color: '#e99d14' }} />
            <p>{error}</p>
          </div>
        ) : currentProducts.length > 0 ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {currentProducts.map(p => (
                <ProductCard key={p.id} product={p} isDeal={false} />
              ))}
            </div>
            {totalPages > 1 && (
               <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
                 <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: currentPage === 1 ? '#eee' : '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}>
                   <FiChevronLeft /> Prev
                 </button>
                 <span style={{ fontWeight: 600 }}>Page {currentPage} of {totalPages}</span>
                 <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: currentPage === totalPages ? '#eee' : '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}>
                   Next <FiChevronRight />
                 </button>
               </div>
            )}
          </>
        ) : null}
      </div>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
