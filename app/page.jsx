import NewsletterSubscription from '../components/NewsletterSubscription';

export const dynamic = 'force-dynamic';
import { searchAmazonProducts } from '../lib/amazon/search-products';

// app/page.js (Homepage)
// This is a Server Component by default.

import { Suspense } from 'react';
import CallToAction from '../components/CallToAction';
import ProductCard from '../components/ProductCard';         // From nextjs_app_router_presentational_comps_v2
import PartnerSection from '../components/PartnerSection';
import PromotionBanner from '../components/PromotionBanner'; // From nextjs_app_router_presentational_comps_v2
import CategoryHighlight from '../components/CategoryHighlight'; // From nextjs_app_router_presentational_comps_v2
import AffiliateCards from '../components/AffiliateCards';
import AffiliateCardsSkeleton from '../components/AffiliateCardsSkeleton';
import CompactSearchBar from '../components/CompactSearchBar';
import HomeSearchResults from '../components/HomeSearchResults';
import HeroSlider from '../components/HeroSlider';
import styles from '../styles/Home.module.css';
import { FiZap, FiShoppingCart, FiTrendingUp, FiGift, FiShield, FiThumbsUp, FiArrowRight, FiMessageSquare, FiAward, FiCheckCircle, FiClock } from 'react-icons/fi';
import Image from 'next/image'; // For Buying Guides section images
import Link from 'next/link'; // For guide card links
import {products} from '../components/products';
import { createClient } from "../prismicio";
import { asText } from "@prismicio/client";
import * as prismic from '@prismicio/client';
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";

/* Page-specific metadata
export const metadata = {
  title: "Clickys.in | Trending Tech & Home Essentials in India",
  description: "Discover the best Amazon and Flipkart deals on tech, home essentials, and grooming products. Shop curated combos, smartwatches, kitchen tools, and more at Clickys.in!",
  keywords: [
    "trending tech and home essentials",
    "top picks for kitchen and grooming",
    "stylish gadgets under budget",
    "buy household deals online India",
    "smartwatch and grooming sets online",
    "healthy living essentials 2025",
    "popular online buys this week",
    "curated Flipkart & Amazon combos",
    "online shopping hub for daily deals",
    "smart choices for home and health",
    "home and electronics saver packs",
    "best combo product picks in India",
    "online store for wellness and style"
  ],
  openGraph: {
    title: "Clickys.in | Best Tech & Home Deals in India",
    description: "Shop trending gadgets, kitchen essentials, and grooming combos at Clickys.in. Find top Amazon and Flipkart offers for smart living!",
    url: "https://www.clickys.in/",
    siteName: "Clickys.in",
    type: "website",
    locale: "en_IN"
  },
  twitter: {
    card: "summary_large_image",
    title: "Clickys.in | Trending Tech & Home Deals",
    description: "Explore curated Amazon and Flipkart deals on smartwatches, kitchen tools, and grooming essentials at Clickys.in!"
  }
};*/

export const metadata = {
  title: 'Clickys – Global Affiliate Hub, Smart Shopping Honest recommendations & Product Reviews',
  description: 'Clickys brings trusted reviews, smart shopping tips, affiliate deals, honest recommendations, and advertising services with top brands like Amazon, Flipkart.',
  keywords: 'Clickys, affiliate hub, product reviews, Amazon deals, Flipkart offers, Myntra discounts, Meesho shopping, Ajio deals, Blinkit offers, advertising services',
};

// Placeholder Data (Prismic will manage this later)
//const placeholderProducts = products.filter(product => product.onPromotion); // Import from products.js

let placeholderProducts;
const dealProducts = products.filter(product => product.isDeal); // Import from products.js


const placeholderCategories = [
  { id: 'cat1', name: 'Electronics', slug: 'electronics', icon: 'FiMonitor', color: '#3b82f6' },
  { id: 'cat2', name: 'Fashion', slug: 'fashion', icon: 'FiShoppingBag', color: '#ec4899' },
  { id: 'cat3', name: 'Kitchen', slug: 'kitchen', icon: 'FiCoffee', color: '#f59e0b' },
  { id: 'cat4', name: 'Health', slug: 'health', icon: 'FiActivity', color: '#10b981' },
  { id: 'cat5', name: 'Home', slug: 'home', icon: 'FiHome', color: '#8b5cf6' },
  { id: 'cat6', name: 'Games', slug: 'games', icon: 'FiPlayCircle', color: '#ef4444' },
  { id: 'cat7', name: 'Beauty', slug: 'beauty', icon: 'FiStar', color: '#f43f5e' },
  { id: 'cat8', name: 'Pet Supplies', slug: 'pet-supplies', icon: 'FiHeart', color: '#06b6d4' },
  { id: 'cat9', name: 'Automotive', slug: 'automotive', icon: 'FiTruck', color: '#f97316' },
  { id: 'cat10', name: 'Office', slug: 'office', icon: 'FiPaperclip', color: '#6366f1' },
];

export default async function HomePage() {
    placeholderProducts = products.filter(product => product.onPromotion);


    const client = createClient();
    
    // Parallelize all data fetching for better performance
    const [
      banner, 
      partnersResponseResult, 
      apiAmazonProducts, 
      prismicAmazonResResult,
      categoriesResResult
    ] = await Promise.allSettled([
      client.getAllByType("marketingbanner"),
      client.getAllByType("partner"),
      searchAmazonProducts('Trending Deals', 4),
      client.getAllByType('product', {
        predicates: [prismic.predicate.at('my.product.platform', 'Amazon')],
        limit: 4
      }),
      client.getAllByType('category')
    ]);

    const bannerData = banner.status === 'fulfilled' ? banner.value : [];

    let partners = [];
    if (partnersResponseResult.status === 'fulfilled') {
      partners = partnersResponseResult.value.map((doc) => ({
        id: doc.id,
        name: doc.data.partner_name,
        slug: doc.uid,
        logo: doc.data.partner_logo,
        bannerImage: doc.data.partner_banner_image,
        description: doc.data.partner_description,
        whatsapp: doc.data.whatsapp_number,
        instagram: doc.data.instagram_link,
        facebook: doc.data.facebook_link,
        promotionStripe: doc.data.promotion_stripe,
        themeColor: doc.data.theme_color || "#3b82f6",
        featuredStatus: doc.data.featured_status,
      }));
    }

    const amazonProducts = apiAmazonProducts.status === 'fulfilled' ? apiAmazonProducts.value : [];
    
    let prismicAmazonProducts = [];
    if (prismicAmazonResResult.status === 'fulfilled') {
      prismicAmazonProducts = prismicAmazonResResult.value.map(p => ({
        id: p.id,
        name: p.data.title,
        category: p.data.category || 'General',
        price: p.data.price,
        imageUrl: p.data.image,
        amazonLink: p.data.link?.url,
        platform: p.data.platform || 'Amazon',
        rating: 0, 
        reviewCount: 0,
        discount: p.data.discount,
      }));
    }

    let categories = [...placeholderCategories];
    if (categoriesResResult.status === 'fulfilled' && categoriesResResult.value.length > 0) {
      categories = categoriesResResult.value.map(doc => ({
        id: doc.id,
        slug: doc.uid || doc.data.title?.toLowerCase().replace(/\s+/g, '-'),
        name: doc.data.title || 'Category',
        imageField: doc.data.image,
        icon: doc.data.icon || 'FiStar',
        color: doc.data.color || '#3dd370'
      }));
    }


  return (
    <>
      <Suspense fallback={<div>Loading search...</div>}>
        <CompactSearchBar />
        <HomeSearchResults />
      </Suspense>
      
      {/* Dynamic Affiliate Showcase Hero Slider */}
      <header className={`${styles.heroSection} relative`} data-aos="fade-in" data-aos-duration="800" style={{ backgroundImage: 'none', padding: '0', minHeight: '400px' }}>
        <HeroSlider />
        <div className="absolute inset-0 z-20 flex flex-col justify-between pt-4 pb-8 h-full w-full pointer-events-none">
          <div className="w-full pointer-events-auto">
            <Suspense fallback={<AffiliateCardsSkeleton />}>
              <AffiliateCards />
            </Suspense>
          </div>
          
          <div className="container mx-auto px-4 flex flex-col items-center pointer-events-auto mt-auto">
            <div className={styles.heroActions} data-aos="fade-up" data-aos-delay="200" style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <CallToAction text="Explore All Products" link="/products" type="secondary" className={styles.heroCtaButton} icon={<FiZap />} iconPosition="left" premium />
              <CallToAction text="Browse Amazon Products" link="/products?platform=Amazon" type="primary" className={`${styles.heroCtaButton} ${styles.heroCtaOutline}`} icon={<FiShoppingCart />} iconPosition="left" style={{ backgroundColor: '#cc851f', borderColor: '#ffb300', color: '#ffffff', fontWeight: 'bold', backdropFilter: 'blur(8px)' }} premium />
            </div>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.75rem', textAlign: 'center', textShadow: '0 2px 4px rgba(0,0,0,0.8)', fontWeight: '500', background: 'rgba(0,0,0,0.3)', padding: '4px 12px', borderRadius: '100px', backdropFilter: 'blur(4px)' }} data-aos-delay="400">
              As an Amazon Associate, we earn from qualifying purchases.
            </p>
          </div>
        </div>
      </header>

      {/* Featured Products Section */}
      <section className={`${styles.section} ${styles.featuredProductsSection}`} style={{ borderColor: '#d49e32', borderStyle: 'solid', borderWidth: '1px' }}>
        <div className="container" style={{ backgroundColor: '#ffffff', borderColor: '#d48408', borderWidth: '5px', borderStyle: 'solid', borderRadius: '34px' }}>
          <h2 className={styles.sectionTitle} data-aos="fade-up">
            <FiTrendingUp className={styles.titleIcon} /> Featured Finds
          </h2>
          <p className={styles.sectionSubtitle} data-aos="fade-up" data-aos-delay="100" style={{ color: '#0c0d0e' }}>
            Handpicked selections that our experts and community love right now.
          </p>
          <div className={styles.productGrid}>
            {placeholderProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} isDeal={false} />
            ))}
          </div>
          <div className={styles.viewMoreLink} data-aos="fade-up" data-aos-delay="200">
            <CallToAction text="See All Featured Products" link="/products" type="outline-dark" icon={<FiArrowRight />} style={{ backgroundColor: '#e28021', color: '#ffffff', borderRadius: '999px' }} />
          </div>
        </div>
      </section>
      
      <PartnerSection partners={partners} />

      {bannerData && bannerData.length > 0 && bannerData[0] ? (
        <PromotionBanner slice={bannerData[0]} />
      ) : null}
      {/* Promotion Banner Section 
      <div className="container" data-aos="zoom-in-up" data-aos-duration="600">
        <PromotionBanner
            alignText="center" // Can be 'left', 'center', or 'right'
            overlayOpacity={0.55}
            buttonType="primary" // Green button for this banner
        />
      </div> */}

      {/* Category Highlights Section */}
      <section className={`${styles.section} ${styles.categorySection}`}>
        <div className="container">
          <h2 className={styles.sectionTitle} data-aos="fade-up">
            Explore by Category
          </h2>
          <p className={styles.sectionSubtitle} data-aos="fade-up" data-aos-delay="100">
            Find exactly what you&#39;re looking for in our curated product categories.
          </p>
          <div className={styles.categoryGrid}>
            {categories.map(category => (
              <CategoryHighlight key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Deals of the Day Section */}
      <section className={`${styles.section} ${styles.dealsSection}`} style={{ backgroundColor: '#f97316', border: 'none', height: 'auto', minHeight: 'fit-content', borderRadius: '40px', margin: '2rem 0.5rem', padding: '3rem 1rem' }}>
        <div className="container mx-auto max-w-7xl px-2 sm:px-4">
          <h2 className={styles.sectionTitle} data-aos="fade-up" style={{ color: '#fff', fontSize: '1.75rem' }}>
            <FiGift className={styles.titleIcon} /> Amazon&#39;s Top Deals
          </h2>
          <p className={styles.sectionSubtitle} data-aos="fade-up" data-aos-delay="100" style={{ color: 'rgba(255,255,255,0.9)' }}>
            Limited-time offers on fantastic products. Grab them before they&#39;re gone!
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {amazonProducts.map((product) => (
              <ProductCard key={product.id} product={product} isDeal={false} />
            ))}
            {prismicAmazonProducts.map((product) => (
              <ProductCard key={`prismic-${product.id}`} product={product} isDeal={false} />
            ))}
          </div>
          <div className="mt-12 text-center" data-aos="fade-up" data-aos-delay="200">
            <CallToAction text="View All Daily Deals" link="https://amzn.to/4nUHKao" type="primary" icon={<FiArrowRight />} style={{ backgroundColor: '#fff', color: '#f97316', border: 'none' }} />
          </div>
        </div>
      </section>



      {/* Trust Signals Section */}
      <section className={`${styles.section} ${styles.trustSection} bg-white py-12 md:py-20`}>
        <div className="container mx-auto px-4">
          <h2 className={`${styles.sectionTitle} text-3xl md:text-4xl font-extrabold text-gray-900 mb-6`}>Why Trust Clickys?</h2>
          <p className={`${styles.sectionSubtitle} text-lg text-gray-600 max-w-2xl mx-auto mb-10`}>
            We're committed to providing you with the best, most reliable shopping advice.
          </p>
          <div className={`${styles.trustElementsGrid} grid grid-cols-1 md:grid-cols-3 gap-8`}>
            <div className={styles.trustElement} data-aos="fade-up" data-aos-delay="150">
              <FiThumbsUp className={styles.trustIcon} />
              <h4 className={styles.trustTitle}>Honest & Unbiased Reviews</h4>
              <p className={styles.trustText}>Our recommendations are based on thorough research and genuine opinions, not just commissions.</p>
            </div>
            <div className={styles.trustElement} data-aos="fade-up" data-aos-delay="250">
              <FiCheckCircle className={styles.trustIcon} />
              <h4 className={styles.trustTitle}>Expertly Curated Selection</h4>
              <p className={styles.trustText}>We handpick the best products, so you don't have to sift through endless options online.</p>
            </div>
            <div className={styles.trustElement} data-aos="fade-up" data-aos-delay="350">
              <FiAward className={styles.trustIcon} />
              <h4 className={styles.trustTitle}>Focus on Quality & Value</h4>
              <p className={styles.trustText}>We prioritize products that offer the best quality and true value for your hard-earned money.</p>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}

