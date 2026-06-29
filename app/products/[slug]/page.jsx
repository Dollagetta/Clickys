export const revalidate = 86400;
// app/products/[slug]/page.js
// This is a Server Component that handles dynamic product routes.

import Image from 'next/image';
import Link from 'next/link';
 // Adjust path
import CallToAction from '../../../components/CallToAction'; // Adjust path
import ProductCard from '../../../components/ProductCard'; // For related products, adjust path
import styles from '../../../styles/ProductDetailPage.module.css'; // Create this CSS Module
import { FiShoppingCart, FiTag, FiStar, FiCheckSquare, FiInfo, FiArrowLeft, FiChevronsRight, FiShare2 } from 'react-icons/fi';
import MoreInfo from './MoreInfo';
import PriceHistoryChart from '../../../components/PriceHistoryChart'; // Price History Chart
import RecentlyViewed from '../../../components/RecentlyViewed'; // Recently Viewed Tracker
import {products} from '../../../components/products.js'; // Adjust path to your products data
// Placeholder data - In a real app, this would be fetched from Prismic based on the slug


import { fetchProductsFromSheet } from '../../../lib/products';
import { createClient } from '../../../prismicio';

// Function to fetch product data from multiple sources
async function getProductData(slug) {
  // 1. Check local static data first
  const localProduct = products.find(product => product.slug === slug);
  if (localProduct) return localProduct;

  // 2. Fallback to Prismic if not found locally
  try {
    const client = createClient();
    const doc = await client.getByUID("product", slug);
    
    if (doc) {
      // Helper to extract text from Prismic rich text or string
      const extractText = (field) => {
        if (!field) return '';
        if (typeof field === 'string') return field;
        if (Array.isArray(field) && field[0] && field[0].text) return field[0].text;
        return '';
      };

      return {
        id: doc.id,
        name: extractText(doc.data.title) || extractText(doc.data.product_name) || "Product",
        slug: doc.uid,
        price: doc.data.price || "On Sale",
        category: doc.data.category || "Products",
        imageUrl: doc.data.image?.url || doc.data.featured_image?.url || doc.data.cover_image?.url || "https://placehold.co/600x600/E5E7EB/475569?text=No+Image",
        shortDescription: extractText(doc.data.description) || extractText(doc.data.short_description) || extractText(doc.data.meta_description) || "",
        amazonLink: doc.data.link?.url || doc.data.amazon_link?.url || doc.data.affiliate_link?.url || "#",
        rating: Number(doc.data.rating) || 4.5,
        reviewCount: Number(doc.data.review_count) || 25,
        galleryImages: (doc.data.gallery || []).map(item => item.image?.url).filter(Boolean),
        isDeal: doc.data.is_deal || false
      };
    }
  } catch (error) {
    console.warn(`[Products] Prismic fetch failed for slug: ${slug}`, error.message);
  }

  return null;
}

async function getRelatedProducts(slugs, currentSlug, currentCategory) {
  let combined = [];

  // 1. Get from local products
  const localRelated = products.filter(p => p.category === currentCategory && p.slug !== currentSlug);
  combined = [...combined, ...localRelated];

  // 2. Get from Google Sheet
  try {
    const rawSheet = await fetchProductsFromSheet().catch(() => []);
    const sheetProducts = rawSheet.filter(p => p.category === currentCategory).map((p, idx) => ({
      id: `sheet-${idx}-${p.title}`,
      name: p.title,
      price: p.price,
      category: p.category || "Deals",
      imageUrl: p.image,
      description: p.description || p.title,
      amazonLink: p.link || "#",
      rating: 4.2,
      reviewCount: 30,
    }));
    combined = [...combined, ...sheetProducts];
  } catch (e) {
    console.error("Related sheet error", e);
  }

  // 3. Get from Prismic
  try {
    const client = createClient();
    const prismicDocs = await client.getAllByType("product");
    const prismicProducts = prismicDocs
      .filter(doc => doc?.data?.category === currentCategory)
      .map(doc => ({
        id: doc.id,
        name: doc?.data?.title || doc?.data?.product_name || "Product",
        price: doc?.data?.price || "On Sale",
        category: doc?.data?.category || "Products",
        imageUrl: doc?.data?.image || "https://placehold.co/600x600/E5E7EB/475569?text=No+Image",
        description: doc?.data?.description,
        amazonLink: doc?.data?.link?.url || "#",
      }));
    combined = [...combined, ...prismicProducts];
  } catch (e) {
    console.error("Related prismic error", e);
  }

  // Shuffle and pick 3
  return combined.sort(() => 0.5 - Math.random()).slice(0, 3);
}


export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductData(slug);
  if (!product) {
    return { title: 'Product Not Found' };
  }
  
  const title = `${product.name} | Clickys`;
  const description = product.shortDescription || `Check out the ${product.name} - ${product.category}. Read reviews and find the best price.`;
  const rawOgImage = product.imageUrl || 'https://www.clickys.in/images/logosvg.svg';
  
  // Facebook strictly requires absolute URLs for og:image.
  const absoluteOgImage = rawOgImage.startsWith('http') ? rawOgImage : `https://www.clickys.in${rawOgImage}`;
  
  const ogImage = `https://www.clickys.in/api/og?title=${encodeURIComponent(product.name)}&category=${encodeURIComponent(product.category || 'Product')}&image=${encodeURIComponent(absoluteOgImage)}`;
  
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: `https://www.clickys.in/products/${slug}`,
      siteName: "Clickys.in",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [ogImage],
    }
  };
}

// Sub-components for better organization and performance
const MainImage = ({ src, alt }) => {
  const actualSrc = src || `https://placehold.co/600x400/2ECC71/1A1A1A?text=${encodeURIComponent(alt)}&font=Inter`;
  return (
  <div className={styles.mainImageContainer} data-aos="fade-right">
    <Image src={actualSrc} alt={alt} width={700} height={525} style={{ objectFit: 'contain', borderRadius: 'var(--rounded-lg)' }} priority referrerPolicy="no-referrer" />
  </div>
  );
};

const ThumbnailImages = ({ images, current, productName }) => (
  <div className={styles.thumbnailContainer} data-aos="fade-right" data-aos-delay="100">
    {images && images.map((imgSrc, index) => (
      <div key={index} className={`${styles.thumbnail} ${imgSrc === current ? styles.activeThumbnail : ''}`}>
        <Image src={imgSrc} alt={`${productName} thumbnail ${index + 1}`} width={100} height={75} style={{ objectFit: 'cover', borderRadius: 'var(--rounded-md)' }} referrerPolicy="no-referrer" />
      </div>
    ))}
  </div>
);

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getProductData(slug);
  const relatedProducts = product ? await getRelatedProducts(product.relatedProductSlugs, slug, product.category) : [];


  if (!product) {
    return (
        <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <h1>Product Not Found</h1>
            <p>Sorry, we couldn't find the product you were looking for.</p>
            <Link href="/products" className="btn btn-primary" style={{marginTop: '1rem'}}>Back to All Products</Link>
        </div>
    );
  }

  return (
    <div className={styles.productDetailPageContainer}>
      <div className={`container ${styles.productDetailLayout}`}>
        {/* Breadcrumbs */}
        <nav aria-label="breadcrumb" className={styles.breadcrumbs} data-aos="fade-in">
            <Link href="/">Home</Link> <FiChevronsRight size={12} />
            <Link href="/products">Products</Link> <FiChevronsRight size={12} />
            {product.category && (<><Link href={`/categories/${product.category.toLowerCase().replace(/\s+/g, '-')}`}>{product.category}</Link><FiChevronsRight size={12} /></>)}
            <span>{product.name.length > 40 ? product.name.substring(0,37) + "..." : product.name}</span>
        </nav>

        {/* Product Gallery & Main Info Column */}
        <div className={styles.galleryAndInfo}>
          <div className={styles.imageGallery}>
            <MainImage src={product.imageUrl} alt={product.name} />
            {product.galleryImages && product.galleryImages.length > 0 && (
              <ThumbnailImages images={product.galleryImages} current={product.imageUrl} productName={product.name} />
            )}
          </div>

          <div className={styles.productInfo} data-aos="fade-left" data-aos-delay="150">
            <h1 className={styles.productTitle}>{product.name}</h1>
            <div className={styles.metaInfo}>
              <span className={styles.categoryLinkWrapper}>
                Category: <Link href={`/categories/${product.category.toLowerCase().replace(/\s+/g, '-')}`} className={styles.categoryLink}>{product.category}</Link>
              </span>
              <div className={styles.rating}>
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className={i < Math.round(product.rating) ? styles.starFilled : styles.starEmpty} />
                ))}
                <span>{product.rating.toFixed(1)} ({product.reviewCount} reviews)</span>
              </div>
            </div>

            <p className={styles.shortDescription}>{product.shortDescription}</p>

            <CallToAction
              text="View on Amazon"
              link={product.amazonLink}
              type="primary"
              className={styles.amazonButton}
              icon={<FiShoppingCart />}
              target="_blank"
              rel="noopener noreferrer sponsored"
            />
            <p className={styles.affiliateNote}>Prices and availability are subject to change. As an affiliate partner, we earn from qualifying purchases.</p>

            <div className={styles.shareProduct}>
              <button className={styles.actionButtonSmall}><FiShare2 /> Share this product</button>
            </div>
          </div>
        </div>

        {/* Price History Section */}
        {product && <PriceHistoryChart currentPrice={product.price || product.discounted_price} />}

        {/* More Info Space */}
        <MoreInfo product={product} />

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className={styles.relatedProductsSection} data-aos="fade-up">
            <h2 className={styles.sectionTitle}>You Might Also Like</h2>
            <div className={styles.relatedGrid}>
              {relatedProducts.map(relatedProd => (
                <ProductCard key={relatedProd.id || Math.random()} product={relatedProd} />
              ))}
            </div>
          </section>
        )}

        <RecentlyViewed currentProduct={product} />

        <div className="container" style={{ textAlign: 'center', marginTop: '3rem' }}>
          <CallToAction text="Back to All Products" link="/products" type="outline-dark" icon={<FiArrowLeft />} iconPosition="left" />
        </div>

      </div>
    </div>
  );
}
