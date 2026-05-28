'use client';
import Link from 'next/link';
import { PrismicNextImage } from "@prismicio/next";
import { motion } from 'framer-motion';
import styles from '../styles/AffiliateCards.module.css';

export default function AffiliateCardsClient({ affiliates }) {
  if (!affiliates || affiliates.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <section className={styles.affiliateContainer}>
      <div className="container mx-auto px-4">
        <motion.div 
          className={styles.affiliateScroll}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className={styles.affiliateGrid}>
            {affiliates.map((aff) => (
              <motion.div key={aff.id} variants={itemVariants} className="group">
                <Link 
                  href={aff.url || `/affiliate/${aff.slug || aff.name.toLowerCase()}`} 
                  className={styles.card} 
                  style={{ '--brand-color': aff.color }}
                  target={aff.url ? "_blank" : "_self"}
                  rel={aff.url ? "noopener noreferrer" : ""}
                >
                  <div className={styles.logoWrapper}>
                    {aff.logo && aff.logo.url ? (
                      <PrismicNextImage field={aff.logo} className={styles.logo} />
                    ) : (
                      <span className={styles.fallbackName}>{aff.name?.substring(0, 2)}</span>
                    )}
                  </div>
                  <span className={styles.name}>{aff.name}</span>
                  
                  {/* Subtle hover icon */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <svg className="w-3 h-3 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
