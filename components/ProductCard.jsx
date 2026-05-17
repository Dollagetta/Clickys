// components/ProductCard.jsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/ProductCard.module.css';
import { FiShoppingCart, FiHeart, FiStar, FiShare2, FiEye } from 'react-icons/fi';
import { PrismicNextImage } from "@prismicio/next";
import { useWishlist } from './WishlistContext';
import QuickViewModal from './QuickViewModal';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
   
  const affiliateColors = {
  Amazon: "#FF9900",
  Clickbank: "#B22234",
  Cj: "#0A9C55",
  Rakuten: "#BF0030",
  Shareasale: "#003595",
  Impact: "#FF2234",
  Awin: "#F37324",
  Fiverr: "#1DBF73",
  Booking: "#003580",
  Bluehost: "#0059B3",
  Amazonin: "#FF9900",
  Flipkart: "#FFD600",
  Vcommission: "#34A853",
  Cuelinks: "#2B84EA",
  Admitad: "#3056D3",
  Involveasia: "#F24B6A",
  Optimise: "#F58023",
  Makemytrip: "#008CFF",
  Nykaa: "#E80071",
  Myntra: "#FF3F6C",
  Meesho: "#E72E77",
  Ajio: "#2C4152",
  Blinkit: "#FFD600",
  Shopsy: "#0C3C60",
  Topsy: "#6C63FF",
  Jumia: "#F68B1E",
  Travelstart: "#0098DA",
  Yellowcard: "#FFD600",
  Luno: "#1736E4",
  Alison: "#283891",
  Takealot: "#0057B8",
  Superbalist: "#000000",
  Loot: "#E87722",
  Bidorbuy: "#FFD500",
  Travelstartsa: "#0098DA",
  Konga: "#D6006D",
  Wakanow: "#F37021",
  Binance: "#F3BA2F",
  Deriv: "#FF444F",
  Maxbounty: "#E1261C",
  Hostinger: "#673DE6",
  Coursera: "#2A73CC",
  Udemy: "#A435F0",
  Etsy: "#F1641E",
  Aliexpress: "#FF4747",
  Samsung: "#1428A0",
  Acer: "#83B81A",
  Addidas: "#000",
  Nike: "#111",
  Reebok: "#00539F"
};


  if (!product) {
    return <div className={styles.cardSkeleton}>Loading...</div>;
  }

  // Destructure with defaults, now including the price string from Amazon
  const {
    id = 'default-id',
    name = 'Product Name Placeholder',
    category = 'Category',
    price = 'On Sale', // Expecting a formatted string like "₹1,299.00"
    amazonLink = '#',
    rating = 0,
    reviewCount = 0,
    platformValue = 'Amazon',
    discount = false,
    isPartner = false,
    contactLink = '#',
    featuredFind = false,
    promotionalStatus = '',
    availabilityStatus = '',
  } = product;

  const imageUrl = product.imageUrl || `https://placehold.co/600x400/2ECC71/1A1A1A?text=${encodeURIComponent(name)}&font=Inter`;


    const platform = String(platformValue || 'Amazon');
    const hasValidPlatform = platform && platform !== 'null' && platform.trim() !== '';
    const displayPlatform = hasValidPlatform ? String(platform) : '';
    const normalizedPlatform = displayPlatform ? (displayPlatform.charAt(0).toUpperCase() + displayPlatform.slice(1).toLowerCase()) : '';
    
    // Check if category matches an affiliate name (fallback)
    const hasValidCategory = category && category !== 'null' && category.trim() !== '';
    const displayCategory = hasValidCategory ? String(category) : '';
    const normalizedCategory = displayCategory ? (displayCategory.charAt(0).toUpperCase() + displayCategory.slice(1).toLowerCase()) : '';

    let tagText = '';
    let buttonText = isPartner ? 'Contact Seller' : 'Buy now';
    let finalAffiliateColor = '#F97316';
    let finalLink = isPartner ? contactLink : amazonLink;

    if (!isPartner) {
        if (hasValidPlatform && affiliateColors[normalizedPlatform] !== undefined) {
            tagText = displayPlatform;
            finalAffiliateColor = affiliateColors[normalizedPlatform];
            buttonText = `Buy on ${displayPlatform}`;
        } else if (hasValidCategory && affiliateColors[normalizedCategory] !== undefined) {
            tagText = displayCategory;
            finalAffiliateColor = affiliateColors[normalizedCategory];
            buttonText = `Buy on ${displayCategory}`;
        } else if (hasValidPlatform) {
            tagText = displayPlatform;
            buttonText = `Buy on ${displayPlatform}`;
        }
    } else {
        tagText = ''; // Can keep empty or use platform
        finalAffiliateColor = '#3b82f6'; // some default for partner
    }

  const isPrismicImage = typeof imageUrl === 'object' && imageUrl !== null && imageUrl.url;

  const cardVariants = {
    rest: { y: 0, boxShadow: "var(--shadow-md)" },
    hover: { y: -6, scale: 1.03, boxShadow: "var(--shadow-lg)", transition: { type: "spring", stiffness: 300, damping: 15 } }
  };

  const imageVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.08 }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: name,
        text: `Check out this deal on ${name}!`,
        url: finalLink,
      }).catch(console.error);
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(finalLink);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className={styles.productCardWrapper} style={{ "--affcolor": finalAffiliateColor }}>
      <motion.div
        className={styles.card}
        style={{ 
          borderColor: finalAffiliateColor 
        }}
        variants={cardVariants}
        initial="rest"
        whileHover="hover"
        layout
      >
        <div className={styles.cardLinkWrapper}>
          <motion.div className={styles.imageWrapper} variants={imageVariants}>
            {!isPrismicImage && <Image
              src={imageUrl}
              alt={name}
              width={200}
              height={150}
              style={{ objectFit: 'contain' }}
              priority={true}
              unoptimized={true}
              className={styles.productImage}
              onError={(e) => e.currentTarget.src = `https://placehold.co/200x150/CCCCCC/1A1A1A?text=Error&font=Inter`}
            />}
            {isPrismicImage && <PrismicNextImage field={imageUrl} priority={true} className={styles.productImage} />}
            
            {tagText && <span className={styles.promoTag}>{tagText}</span>}
            {featuredFind && <span className={styles.featuredBadge}>Featured Find</span>}
            
            <div className={styles.quickActions}>
              { (discount && discount > 0) && <button aria-label="Discount" className={styles.discountBadge}>{discount}% Off</button> }
              <button 
                aria-label="Add to wishlist" 
                title="Add to wishlist"
                className={`${styles.actionButton} ${isInWishlist(id) ? styles.wishlistActive : ''}`}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
              >
                <FiHeart fill={isInWishlist(id) ? "currentColor" : "none"} />
              </button>
              <button 
                aria-label="Share" 
                title="Share"
                className={styles.actionButton}
                onClick={(e) => { e.preventDefault(); handleShare(e); }}
              >
                <FiShare2 />
              </button>
            </div>
          </motion.div>
          <div className={styles.cardContent}>
            <p className={styles.productCategory}>{category}</p>
            <h3 className={styles.productName}>{name}</h3>
            
            {(product.shortDescription || (typeof product.description === 'string' ? product.description : typeof product.longDescription === 'string' ? product.longDescription.replace(/<[^>]+>/g, '') : '')) && (
              <p className="text-xs text-gray-500 mt-1 mb-2 line-clamp-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {product.shortDescription || (typeof product.description === 'string' ? product.description : typeof product.longDescription === 'string' ? product.longDescription.replace(/<[^>]+>/g, '') : '')}
              </p>
            )}

            <div className={styles.ratingContainer}>
              {rating > 0 && [...Array(5)].map((_, i) => (
                <FiStar key={i} className={i < Math.round(rating) ? styles.starFilled : styles.starEmpty} />
              ))}
              {reviewCount > 0 && <span className={styles.reviewCount}>({reviewCount})</span>}
            </div>
            
            {/* Availability Status */}
            {availabilityStatus && (
              <div className={styles.statusRow}>
                <span className={`${styles.statusBadge} ${(String(availabilityStatus).toLowerCase().includes('in stock') || availabilityStatus === true || String(availabilityStatus).toLowerCase() === 'true' || String(availabilityStatus).toLowerCase() === 'available') ? styles.inStock : styles.outOfStock}`}>
                  { (availabilityStatus === true || String(availabilityStatus).toLowerCase() === 'true') ? 'In Stock' : 
                    (availabilityStatus === false || String(availabilityStatus).toLowerCase() === 'false') ? 'Out of Stock' : String(availabilityStatus) }
                </span>
              </div>
            )}
  
            <div className={styles.priceActionRow}>
              <div className={styles.priceContainer}>
                { price != 0 && <span className={styles.currentPrice}>{price}</span> }
                { (!price || price == 0) && <span className={styles.currentPrice}>On Sale</span> }
              </div>
              <motion.a
                href={finalLink}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className={`btn btn-primary ${styles.amazonButton}`}
                title={buttonText}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ backgroundColor: 'var(--affcolor)', borderColor: 'var(--affcolor)' }}
              >
                {buttonText} <FiShoppingCart style={{ marginLeft: '0.2em' }} />
              </motion.a>
            </div>
          </div>
        </div>
      </motion.div>
      <div className={styles.previewButtonContainer}>
        <button
          className={styles.previewButtonExt}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsQuickViewOpen(true); }}
        >
          <FiEye size={14} /> Preview
        </button>
      </div>
      
      {/* Quick View Modal rendered outside typical container flow */}
      <QuickViewModal 
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        product={product}
        finalAffiliateColor={finalAffiliateColor}
        finalLink={finalLink}
        buttonText={buttonText}
        isPrismicImage={isPrismicImage}
        imageUrl={imageUrl}
        tagText={tagText}
      />
    </div>
  );
};

export default ProductCard;
