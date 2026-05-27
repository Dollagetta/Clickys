// components/CategoryHighlight.jsx
"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { PrismicNextImage } from '@prismicio/next';
import { 
  FiMonitor, FiShoppingBag, FiCoffee, FiActivity, 
  FiHome, FiPlayCircle, FiStar, FiHeart, FiTruck, FiPaperclip
} from 'react-icons/fi';
import styles from '../styles/CategoryHighlight.module.css';

const iconMap = {
  FiMonitor, FiShoppingBag, FiCoffee, FiActivity, 
  FiHome, FiPlayCircle, FiStar, FiHeart, FiTruck, FiPaperclip
};

const CategoryHighlight = ({ category, aosData = "zoom-in" }) => {
  if (!category) return null;

  const { slug, name, icon, color = '#3dd370', imageField } = category;
  const IconComponent = iconMap[icon] || FiHome;

  return (
    <motion.div
      className={styles.compactCard}
      data-aos={aosData}
      whileHover={{ y: -5, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link href={`/daily-deals?category=${name}`} className={styles.categoryLink}>
        {imageField?.url ? (
          <div className={styles.imageContainer}>
            <PrismicNextImage 
              field={imageField} 
              alt={name} 
              className={styles.categoryImage} 
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          </div>
        ) : (
          <div className={styles.iconContainer} style={{ backgroundColor: `${color}15`, color: color }}>
            <IconComponent className={styles.categoryIcon} />
          </div>
        )}
        <span className={styles.categoryName}>{name}</span>
      </Link>
    </motion.div>
  );
};

export default CategoryHighlight;
