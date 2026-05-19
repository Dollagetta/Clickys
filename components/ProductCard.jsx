// components/ProductCard.jsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/ProductCard.module.css';
import { FiShoppingCart, FiHeart, FiStar, FiShare2, FiEye, FiX } from 'react-icons/fi';
import { PrismicNextImage } from "@prismicio/next";
import { useWishlist } from './WishlistContext';
import { useCompare } from './CompareContext';
import { FiCheckSquare, FiSquare } from 'react-icons/fi';
import PriceHistoryChart from './PriceHistoryChart';

const ProductCard = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { compareItems, toggleCompare, setIsCompareDrawerOpen } = useCompare();
  const [showPreview, setShowPreview] = useState(false);
   
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
    price: rawPrice = 'On Sale', // Expecting a formatted string like "₹1,299.00"
    amazonLink = '#',
    rating = 4.5,
    reviewCount = 120,
    platformValue = product.platform || 'Amazon',
    discount = false,
    isPartner = false,
    contactLink = '#',
    featuredFind = false,
    promotionalStatus = '',
    availabilityStatus = '',
  } = product;

  const formatPrice = (p) => {
    if (!p || p == 0 || p === '0' || String(p).trim() === '' || String(p).toLowerCase() === 'on sale') {
      return "On Sale";
    }
    let strClean = String(p).trim();
    if (strClean.includes('₹')) return strClean;
    if (strClean.toLowerCase().includes('rs') || strClean.toLowerCase().includes('rs.')) {
      return strClean.replace(/rs\.?\s*/i, '₹');
    }
    // Check if it already has other currency symbols to avoid double adding
    // If it starts with a number, slap a ₹ in front of it.
    if (/^[0-9]/.test(strClean)) {
        return `₹${strClean}`;
    }
    return strClean;
  };

  const formattedPrice = formatPrice(rawPrice);

  const imageUrl = product.imageUrl || `https://placehold.co/600x400/2ECC71/1A1A1A?text=${encodeURIComponent(name)}&font=Inter`;


    const platform = String(platformValue || 'Amazon');
    const hasValidPlatform = platform && platform !== 'null' && platform.trim() !== '';
    const displayPlatform = hasValidPlatform ? String(platform) : '';
    const normalizedPlatform = displayPlatform ? (displayPlatform.charAt(0).toUpperCase() + displayPlatform.slice(1).toLowerCase()) : '';
    
    // Check if category matches an affiliate name (fallback)
    const hasValidCategory = category && category !== 'null' && category.trim() !== '';
    const displayCategory = hasValidCategory ? String(category) : '';
    const normalizedCategory = displayCategory ? (displayCategory.charAt(0).toUpperCase() + displayCategory.slice(1).toLowerCase()) : '';

    // Default properties (fallback to Amazon)
    let tagText = 'Amazon';
    let buttonText = isPartner ? (product.partnerName ? `Buy on ${product.partnerName}` : 'Contact Seller') : 'Buy on Amazon';
    let finalAffiliateColor = affiliateColors['Amazon'];
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
        tagText = product.partnerName || ''; // Use partner name if available
        finalAffiliateColor = affiliateColors['Amazon']; // default for partner
    }

  const isComparing = compareItems.some(p => p.id === (product.id || id) || (p.asin && p.asin === product.asin));

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
      alert('Link copied to clipboard!');
    }
  };

  return (
    <>
    <motion.div
      className={styles.card}
      style={{ 
        "--affcolor": finalAffiliateColor,
        borderColor: finalAffiliateColor 
      }}
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      layout
    >
      <div className={styles.cardLinkWrapper}>
        <motion.div className={isPartner ? `${styles.imageWrapper} ${styles.partnerImageWrapper}` : styles.imageWrapper} variants={imageVariants}>
          {!isPrismicImage && <Image
            src={imageUrl}
            alt={name}
            width={isPartner ? 400 : 200}
            height={isPartner ? 300 : 150}
            style={{ objectFit: isPartner ? 'cover' : 'contain' }}
            priority={true}
            unoptimized={true}
            className={styles.productImage}
            onError={(e) => e.currentTarget.src = `https://placehold.co/200x150/CCCCCC/1A1A1A?text=Error&font=Inter`}
          />}
          {isPrismicImage && <PrismicNextImage field={imageUrl} priority={true} className={styles.productImage} style={{ objectFit: isPartner ? 'cover' : 'contain' }} />}
          
          {tagText && <span className={styles.promoTag}>{tagText}</span>}
          {featuredFind && <span className={styles.featuredBadge}>Featured Find</span>}
          
          <div className={styles.quickActions}>
            { (discount && discount > 0) && <button aria-label="Discount" className={styles.discountBadge}>{discount}% Off</button> }
            <button 
              aria-label="Add to wishlist" 
              title="Add to wishlist"
              className={`${styles.actionButton} ${isInWishlist(id) ? styles.wishlistActive : ''}`}
              onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
            >
              <FiHeart fill={isInWishlist(id) ? "currentColor" : "none"} />
            </button>
            <button 
              aria-label="Share" 
              title="Share"
              className={styles.actionButton}
              onClick={handleShare}
            >
              <FiShare2 />
            </button>
          </div>
        </motion.div>
        <div className={styles.cardContent}>
          <p className={styles.productCategory}>{category}</p>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
            <h3 className={styles.productName} style={{ flex: 1 }}>{name}</h3>
            
            <button 
              onClick={(e) => { 
                e.preventDefault(); 
                e.stopPropagation(); 
                toggleCompare(product);
                setIsCompareDrawerOpen(true);
              }}
              className="mt-1 flex items-center justify-center p-1.5 rounded text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              title={isComparing ? "Remove from Compare" : "Add to Compare"}
            >
              {isComparing ? <FiCheckSquare className="text-blue-600 w-5 h-5" /> : <FiSquare className="w-5 h-5" />}
            </button>
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
              <span className={styles.currentPrice}>{formattedPrice}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <motion.a
                href={finalLink}
                target="_blank"
                rel="noopener noreferrer sponsored"
                onClick={(e) => e.stopPropagation()}
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
          
          <div style={{ marginTop: '0.75rem' }}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowPreview(true); }}
                className={`btn btn-secondary`}
                title="Quick View"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: '100%',
                  padding: '0.5rem 0.8rem', 
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc', 
                  color: '#475569', 
                  border: '1px solid #cbd5e1',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                <FiEye style={{ marginRight: '0.3rem' }} /> Preview
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
    <AnimatePresence>
        {showPreview && (
          <div 
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              backdropFilter: 'blur(4px)'
            }}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowPreview(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                padding: '2rem',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
              }}
            >
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowPreview(false); }}
                style={{
                  position: 'absolute',
                  top: '1rem', right: '1rem',
                  background: 'none', border: 'none',
                  fontSize: '1.5rem', cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                <FiX />
              </button>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ textAlign: 'center' }}>
                  {!isPrismicImage && <Image
                    src={imageUrl}
                    alt={name}
                    width={300}
                    height={250}
                    style={{ objectFit: 'contain', margin: '0 auto', display: 'block' }}
                    unoptimized={true}
                    onError={(e) => e.currentTarget.src = `https://placehold.co/300x250/CCCCCC/1A1A1A?text=Error&font=Inter`}
                  />}
                  {isPrismicImage && <PrismicNextImage field={imageUrl} style={{ objectFit: 'contain', width: '100%', height: 'auto', maxHeight: '250px' }} />}
                </div>

                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.5rem' }}>{name}</h3>
                  <p style={{ color: '#64748b', marginBottom: '1rem', fontWeight: '500' }}>{formattedPrice}</p>
                  
                  {(() => {
                    let descNodes = null;
                    const descField = product.description || product.product_description || product.shortDescription;
                    
                    if (typeof descField === 'string' && descField.trim() !== '') {
                      descNodes = <p>{descField}</p>;
                    } else if (Array.isArray(descField) && descField.length > 0) {
                      const hasText = descField.some(d => d.text && d.text.trim() !== '');
                      if (hasText) {
                        descNodes = descField.map((block, i) => <p key={i} style={{ marginBottom: '0.5rem' }}>{block.text}</p>);
                      }
                    }
                    
                    if (descNodes) {
                      return (
                        <div style={{ color: '#334155', lineHeight: '1.6', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                          {descNodes}
                        </div>
                      );
                    }
                    return null;
                  })()}

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', marginBottom: '1.5rem' }}>
                    <motion.a
                      href={finalLink}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className={`btn btn-primary`}
                      style={{ 
                        backgroundColor: finalAffiliateColor, 
                        borderColor: finalAffiliateColor,
                        flex: 1,
                        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem',
                        padding: '0.75rem', color: '#fff', borderRadius: '8px', fontWeight: '600', textDecoration: 'none'
                      }}
                    >
                      {buttonText} <FiShoppingCart />
                    </motion.a>
                  </div>
                  
                  <PriceHistoryChart currentPrice={formattedPrice} />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductCard;
