// components/PromotionBanner.jsx
"use client";

import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import { PrismicRichText } from '@prismicio/react';
import { motion } from 'framer-motion';
import styles from '../styles/PromotionBanner.module.css';

/**
 * @typedef {import("@prismicio/client").Content.PromotionBannerSlice} PromotionBannerSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<PromotionBannerSlice>} PromotionBannerProps
 * @param {PromotionBannerProps}
 */
const PromotionBanner = ({ slice }) => {
  // Destructure the fields from the Prismic slice for easier access
  const { image, title, short_paragraph, link, offer } = slice.data;

  // --- Recommended fields for more control (add these to your Prismic model) ---
  // A 'Select' field for text alignment ('left', 'center', 'right')
  const textAlign = slice.primary.text_alignment || 'left';
  // A 'Text' field for the button's label
  const buttonText = slice.primary.button_text || 'Explore Now'; 

  return (
    <section className={styles.bannerContainer}>
      {/* 1. Offer Marquee: Renders only if the 'offer' field has content */}
      {offer && (
        <div className={styles.offerStrip}>
          {/* The text is duplicated to create a seamless, infinite scrolling effect */}
          <div className={styles.offerText}>
            <span>{offer}</span>
            <span>{offer}</span>
          </div>
        </div>
      )}

      {/* 2. Background Image Wrapper */}
      <div className={styles.bannerImageWrapper}>
        <PrismicNextImage
          field={image}
          fill
          quality={80}
          className={styles.bannerImage}
          alt={image.alt || ''}
        />
      </div>

      {/* 3. Dark Overlay to ensure text readability */}
      <div className={styles.bannerOverlay} />

      {/* 4. Main Text Content */}
      <motion.div
        className={`${styles.bannerContent} ${styles[`align-${textAlign}`]}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className={styles.titleWrapper}>
          {title}
        </div>

        <div className={styles.subtitleWrapper}>
          {short_paragraph}
        </div>

        {/* The PrismicNextLink component correctly resolves internal or external links */}
        <PrismicNextLink field={link} className={styles.bannerButton}>
          {buttonText}
        </PrismicNextLink>
      </motion.div>
    </section>
  );
};

export default PromotionBanner;
