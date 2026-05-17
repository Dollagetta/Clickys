// components/ProductCard.js
"use client"; // Uses Framer Motion for hover effects

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from '../styles/ProductCard.module.css'; // Create this CSS Module
import { FiShoppingCart, FiHeart, FiStar, FiShare2 } from 'react-icons/fi';
import { useWishlist } from './WishlistContext';

const ProductCard = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) {
    return <div className={styles.cardSkeleton}>Loading...</div>; // Basic skeleton
  }

  const {
    slug = 'default-product',
    name = 'Product Name Placeholder',
    category = 'Category',
    price = '0.00',
    oldPrice,
    imageUrl = `https://placehold.co/600x400/2ECC71/1A1A1A?text=${encodeURIComponent(name)}&font=Inter`,
    amazonLink = '#',
    rating = 4.5,
    reviewCount = 0,
    platformValue = product.platform || 'Amazon',
    discount = false,
  } = product;

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: name,
        text: `Check out this deal on ${name}!`,
        url: amazonLink,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(amazonLink);
    }
  };

  const cardVariants = {
    rest: { y: 0, boxShadow: "var(--shadow-md)" },
    hover: { y: -6, scale: 1.03, boxShadow: "var(--shadow-lg)", transition: { type: "spring", stiffness: 300, damping: 15 } }
  };

  const imageVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.08 }
  };

  return (
    <motion.div
      className={styles.card}
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      data-aos="fade-up"
    >
      <Link href={`/products/${slug}`} className={styles.cardLinkWrapper}> {/* Updated Link */}
        <motion.div className={styles.imageWrapper} variants={imageVariants}>
          <Image
            src={imageUrl}
            alt={name}
            width={400}
            height={300}
            style={{ objectFit: 'cover' }}
            className={styles.productImage}
            onError={(e) => e.currentTarget.src = `https://placehold.co/600x400/CCCCCC/1A1A1A?text=Error&font=Inter`}
          />
          {product.onPromotion && <span className={styles.promoTag}>Offer</span>}
          <div className={styles.quickActions}>
            { discount && <button aria-label="Discount" className={styles.discountBadge}>{discount}% Off</button> }
            <button 
              aria-label="Add to wishlist" 
              className={`${styles.actionButton} ${isInWishlist(slug) ? styles.wishlistActive : ''}`}
              onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
            >
              <FiHeart fill={isInWishlist(slug) ? "currentColor" : "none"} />
            </button>
            <button 
              aria-label="Share" 
              className={styles.actionButton}
              onClick={handleShare}
            >
              <FiShare2 />
            </button>
          </div>
        </motion.div>
        <div className={styles.cardContent}>
          <p className={styles.productCategory}>{category}</p>
          <h3 className={styles.productName}>{name}</h3>
          {/* <div className={styles.priceContainer}>
            <span className={styles.currentPrice}>${price}</span>
            {oldPrice && <span className={styles.oldPrice}>${oldPrice}</span>}
          </div> */}
        </div>
      </Link>
      <motion.a
        href={amazonLink}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className={`btn btn-primary ${styles.amazonButton}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        View on Amazon <FiShoppingCart style={{ marginLeft: '0.5em' }} />
      </motion.a>
    </motion.div>
  );
};

export default ProductCard;
