import styles from '../styles/AffiliateCards.module.css';
import Skeleton from './Skeleton';

export default function AffiliateCardsSkeleton() {
  const SKELETON_COUNT = 6;
  
  return (
    <section className={styles.affiliateContainer}>
      <div className={`container ${styles.affiliateScroll}`}>
        <div className={styles.affiliateGrid}>
          {[...Array(SKELETON_COUNT)].map((_, i) => (
            <div key={i} className={styles.card} style={{ border: 'none', background: 'transparent' }}>
              <Skeleton className={styles.logoWrapper} />
              <Skeleton style={{ height: '14px', width: '60px', marginTop: '8px' }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
