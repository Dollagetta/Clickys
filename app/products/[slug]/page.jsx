export const dynamic = 'force-dynamic';
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
import {products} from '../../../components/products'; // Adjust path to your products data
// Placeholder data - In a real app, this would be fetched from Prismic based on the slug


// Function to fetch product data (simulated)
async function getProductData(slug) {
  return products.find(product => product.slug === slug);
}

async function getRelatedProducts(slugs, slug) {
    if (!slugs || slugs.length === 0) return [];
    // In a real app, you'd fetch these products. Here, we filter from products.
    return products.filter(product => slugs.includes(product.slug) && product.slug !== slug).slice(0, 3); // Avoid self-relation, limit to 3
}


// Dynamic metadata generation for each product page
export async function generateMetadata({ params }) {
  const product = await getProductData( params.slug);
  if (!product) {
    return { title: 'Product Not Found' };
  }
  return {
    title: `${product.name} | Clickys`,
    description: product.shortDescription || `Check out the ${product.name} - ${product.category}. Read reviews and find the best price.`,
    openGraph: {
      title: `${product.name} | Clickys`,
      description: product.shortDescription || `Discover the ${product.name} on Clickys.`,
      images: [product.imageUrl || '/og-images/default-product.jpg'],
      // Add more product-specific OG tags if needed (price, availability, etc.)
    },
  };
}

// Optional: generateStaticParams to pre-render dynamic routes at build time
export async function generateStaticParams() {
    return products.map((product) => ({
        slug: product.slug,
    }));
}


export default async function ProductDetailPage({ params }) {
  const { slug } = params;
  const product = await getProductData(slug);
  const relatedProducts = product ? await getRelatedProducts(product.relatedProductSlugs, slug) : [];


  if (!product) {
    return (
        <>
            <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                <h1>Product Not Found</h1>
                <p>Sorry, we couldn't find the product you were looking for.</p>
                <Link href="/products" className="btn btn-primary" style={{marginTop: '1rem'}}>Back to All Products</Link>
            </div>
        </>
    );
  }

  // For a real image gallery, you'd use a client component with state for the selected image.
  // Here, we'll just display the main image and list thumbnails.
  const MainImage = ({ src, alt }) => (
    <div className={styles.mainImageContainer} data-aos="fade-right">
      <Image src={src} alt={alt} width={700} height={525} style={{ objectFit: 'contain', borderRadius: 'var(--rounded-lg)' }} priority />
    </div>
  );

  const ThumbnailImages = ({ images, current }) => (
    <div className={styles.thumbnailContainer} data-aos="fade-right" data-aos-delay="100">
      {images && images.map((imgSrc, index) => (
        <div key={index} className={`${styles.thumbnail} ${imgSrc === current ? styles.activeThumbnail : ''}`}>
          <Image src={imgSrc} alt={`${product.name} thumbnail ${index + 1}`} width={100} height={75} style={{ objectFit: 'cover', borderRadius: 'var(--rounded-md)' }} />
        </div>
      ))}
    </div>
  );

  return (
    <>
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
                <ThumbnailImages images={product.galleryImages} current={product.imageUrl} />
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

              {/*
              <div className={styles.priceSection}>
                <span className={styles.currentPrice}>${product.price}</span>
                {product.oldPrice && <span className={styles.oldPrice}>${product.oldPrice}</span>}
                {product.onPromotion && <span className={styles.savingsBadge}>Save {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%</span>}
              </div>
              */}

              <CallToAction
                text="View on Amazon"
                link={product.amazonLink}
                type="primary" // Green button
                className={styles.amazonButton}
                icon={<FiShoppingCart />}
                target="_blank"
                rel="noopener noreferrer sponsored"
              />
              <p className={styles.affiliateNote}>Prices and availability are subject to change. As an Amazon Associate, we earn from qualifying purchases.</p>

              <div className={styles.shareProduct}>
                <button className={styles.actionButtonSmall}><FiShare2 /> Share this product</button>
              </div>
            </div>
          </div>

          {/* More Info Space */}
          <MoreInfo product={product} />

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <section className={styles.relatedProductsSection} data-aos="fade-up">
              <h2 className={styles.sectionTitle}>You Might Also Like</h2>
              <div className={styles.relatedGrid}>
                {relatedProducts.map(relatedProd => (
                  <ProductCard key={relatedProd.id} product={relatedProd} />
                ))}
              </div>
            </section>
          )}

          <div className="container" style={{ textAlign: 'center', marginTop: '3rem' }}>
            <CallToAction text="Back to All Products" link="/products" type="outline-dark" icon={<FiArrowLeft />} iconPosition="left" />
          </div>

        </div>
      </div>
    </>
  );
}
