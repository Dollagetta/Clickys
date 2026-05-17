'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { PrismicNextImage } from "@prismicio/next";
import styles from '../styles/BrandGrid.module.css';

export default function BrandGrid({ affiliates = [] }) {
  if (!affiliates || affiliates.length === 0) return null;

  return (
    <section className={styles.brandSection}>
      <div className="container">
        <div className={styles.grid}>
          {affiliates.map((brand, index) => (
            <motion.div
              key={brand.id}
              className={styles.brandCard}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              style={{ borderColor: brand.color }}
            >
              <Link href={`/affiliate/${brand.slug || brand.name.toLowerCase()}`} className={styles.brandLink}>
                <div className={styles.brandFrame}>
                  <div className={styles.brandIconWrapper} style={{ backgroundColor: brand.color }}>
                    {brand.logo && brand.logo.url ? (
                      <PrismicNextImage field={brand.logo} className={styles.brandLogo} />
                    ) : (
                      <span className={styles.brandIconText}>{brand.name?.substring(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  <h3 className={styles.brandName}>{brand.name}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
