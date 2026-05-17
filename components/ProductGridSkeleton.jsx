import React from 'react';
import Skeleton from './Skeleton';
import styles from '../styles/ProductCard.module.css';

const ProductCardSkeleton = () => {
  return (
    <div className={styles.card} style={{ borderColor: '#e2e8f0' }}>
      <div className={styles.cardLinkWrapper}>
        <div className={styles.imageWrapper}>
          <Skeleton style={{ height: '180px', width: '100%', borderRadius: '0' }} />
        </div>
        <div className={styles.cardContent}>
          <Skeleton style={{ height: '14px', width: '40%', marginBottom: '8px' }} />
          <Skeleton style={{ height: '24px', width: '90%', marginBottom: '12px' }} />
          
          <div className="flex items-center gap-2 mb-4">
            <Skeleton style={{ height: '14px', width: '60px' }} />
            <Skeleton style={{ height: '14px', width: '30px' }} />
          </div>
          
          <div className={styles.priceActionRow}>
            <Skeleton style={{ height: '24px', width: '60px' }} />
            <Skeleton style={{ height: '40px', width: '120px', borderRadius: '9999px' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export { ProductCardSkeleton, ProductGridSkeleton };
