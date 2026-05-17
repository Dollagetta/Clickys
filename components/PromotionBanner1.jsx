// components/PromotionBanner.js
"use client"; // Uses Framer Motion

import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/PromotionBanner.module.css'; // Create this CSS Module
import { motion } from 'framer-motion';
import CallToAction from './CallToAction'; // Re-using our CTA component

const PromotionBanner = ({
  title = 'Default Promotion Title!',
  subtitle = 'Check out this amazing limited-time offer.',
  buttonText = 'Shop Now',
  buttonLink = '/deals',
  imageUrl = `https://placehold.co/1200x400/F1C40F/1A1A1A?text=Promotion+Banner&font=Inter`,
  imageAlt = 'Promotional banner',
  aosData = "zoom-in-up", // Default AOS animation for the whole banner
  alignText = "center", // 'left', 'center', 'right'
  overlayOpacity = 0.6,
  textColor = 'var(--neutral-white)',
  buttonType = 'secondary', // 'primary' or 'secondary' for the button
}) => {

  const textAlignmentClass = styles[`align-${alignText}`] || styles['align-center'];

  return (
    <div className={styles.bannerContainer} data-aos={aosData}>
      <div className={styles.bannerImageWrapper}>
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={imageAlt}
            layout="fill"
            objectFit="cover"
            priority // Important banners might be above the fold
            className={styles.bannerImage}
            onError={(e) => e.currentTarget.src = `https://placehold.co/1200x400/CCCCCC/1A1A1A?text=Img+Error&font=Inter`}
          />
        )}
        <div className={styles.bannerOverlay} style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}></div>
      </div>

      <div className={`${styles.bannerContent} ${textAlignmentClass} container`}>
        <motion.h2
          className={styles.bannerTitle}
          style={{ color: textColor }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          {title}
        </motion.h2>
        {subtitle && (
          <motion.p
            className={styles.bannerSubtitle}
            style={{ color: textColor }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          >
            {subtitle}
          </motion.p>
        )}
        {buttonText && buttonLink && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: 0.4, type: "spring", stiffness: 100 }}
          >
            <CallToAction
                text={buttonText}
                link={buttonLink}
                type={buttonType}
                className={styles.bannerButton} // For any specific banner button overrides
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PromotionBanner;
