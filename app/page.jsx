import NewsletterSubscription from '../components/NewsletterSubscription';

export const revalidate = 14400; // Cache for 4 hours to align with deal refresh cycles
// export const dynamic = 'force-dynamic'; // Removed to allow caching and improve "heaviness"

// app/page.js (Homepage)
// This is a Server Component by default.

import { Suspense } from 'react';
import CallToAction from '../components/CallToAction';
import ProductCard from '../components/ProductCard';         // From nextjs_app_router_presentational_comps_v2
import PartnerSection from '../components/PartnerSection';
import PinterestGrid from '../components/PinterestGrid';
import PromotionBanner from '../components/PromotionBanner'; // From nextjs_app_router_presentational_comps_v2
import CategoryHighlight from '../components/CategoryHighlight'; // From nextjs_app_router_presentational_comps_v2
import AffiliateCards from '../components/AffiliateCards';
import AffiliateCardsSkeleton from '../components/AffiliateCardsSkeleton';
import CompactSearchBar from '../components/CompactSearchBar';
import HomeSearchResults from '../components/HomeSearchResults';
import HeroSlider from '../components/HeroSlider';
import PriceTracker from '../components/PriceTracker';
import ProductComparator from '../components/ProductComparator';
import GiftFinder from '../components/GiftFinder';
import { components } from "../slices";
import styles from '../styles/Home.module.css';
import { FiZap, FiShoppingCart, FiTrendingUp, FiGift, FiShield, FiThumbsUp, FiArrowRight, FiMessageSquare, FiAward, FiCheckCircle, FiClock } from 'react-icons/fi';
import Image from 'next/image'; // For Buying Guides section images
import Link from 'next/link'; // For guide card links
import { products } from '../components/products.js';
import NewLaunchesSection from '../components/NewLaunchesSection';
import HomeSidebar from '../components/HomeSidebar';
import SearchPinterestGrid from '../components/SearchPinterestGrid';
import FeaturedFrames from '../components/FeaturedFrames';

import { createClient } from "../prismicio";
import { asText } from "@prismicio/client";
import * as prismic from '@prismicio/client';
import { PrismicNextImage } from "@prismicio/next";
import { SliceZone, PrismicRichText } from "@prismicio/react";

export const metadata = {
  title: "Clickys.in | Trending Tech & Home Essentials in India",
  description: "Discover the best Amazon and Flipkart deals on tech, home essentials, and grooming products. Shop curated combos, smartwatches, kitchen tools, and more at Clickys.in!",
  alternates: {
    canonical: '/',
  },
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
  ].join(', '),
  openGraph: {
    title: "Clickys.in | Trending Tech & Home Essentials in India",
    description: "Discover the best Amazon and Flipkart deals on tech, home essentials, and grooming products. Shop curated combos, smartwatches, kitchen tools, and more at Clickys.in!",
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
    
    console.log('[HomePage] Starting data fetch...');
    const fetchWithTimeout = (promise, ms = 15000) => 
      Promise.race([
        promise, 
        new Promise((_, reject) => setTimeout(() => reject(new Error('Fetch Timeout')), ms))
      ]);

    const fetchData = async () => {
      try {
        console.log('[HomePage] Fetching all data types...');
        const results = await Promise.allSettled([
          fetchWithTimeout(client.getAllByType("marketingbanner")).catch(() => []),
          fetchWithTimeout(client.getAllByType("partner")).catch(() => []),
          fetchWithTimeout(client.getAllByType('product', { limit: 12 })).catch(() => []),
          fetchWithTimeout(client.getAllByType('category')).catch(() => []),
          fetchWithTimeout(client.getAllByType('pinterestgrid')).catch(() => []),
          fetchWithTimeout(import('../lib/products').then(m => m.fetchProductsFromSheet())).catch(() => [])
        ]);
        return results;
      } catch (err) {
        console.error('[HomePage] Critical fetch wrap error:', err);
        return Array(6).fill({ status: 'rejected', reason: err });
      }
    };

    const results = await fetchData();
    const [
      banner, 
      partnersResponseResult, 
      prismicProductsResResult,
      categoriesResResult,
      homePageDocResult,
      sheetProductsResult
    ] = results;

    const sheetProducts = sheetProductsResult.status === 'fulfilled' ? sheetProductsResult.value : [];

    // Filter deals for LimitedTimeDeals component
    const fourHourIndex = Math.floor(new Date().getTime() / (1000 * 60 * 60 * 4));
    const getPlatformDeals = (platform, count = 4) => {
      const platformProducts = sheetProducts.filter(p => 
        p.platform?.toLowerCase().includes(platform.toLowerCase())
      );
      if (platformProducts.length === 0) return [];
      const startIndex = (fourHourIndex * count) % platformProducts.length;
      const result = [];
      for (let i = 0; i < count; i++) {
          result.push(platformProducts[(startIndex + i) % platformProducts.length]);
      }
      return result;
    };

    const productsByPlatform = {
      myntra: getPlatformDeals('myntra', 12),
      amazon: getPlatformDeals('amazon', 24),
      flipkart: getPlatformDeals('flipkart', 12),
      ajio: getPlatformDeals('ajio', 12)
    };

    console.log('[HomePage] Data fetch completed');

    const homePageData = homePageDocResult.status === 'fulfilled' ? homePageDocResult.value : null;

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


    let prismicProducts = [];
    if (prismicProductsResResult.status === 'fulfilled') {
      prismicProducts = prismicProductsResResult.value.map(p => {
        let deducedPlatform = "Amazon";
        if (p.data.platform) {
          deducedPlatform = p.data.platform;
        } else if (p.data.link?.url) {
          const url = p.data.link.url.toLowerCase();
          if (url.includes('myntra')) deducedPlatform = 'Myntra';
          else if (url.includes('ajio')) deducedPlatform = 'Ajio';
          else if (url.includes('flipkart')) deducedPlatform = 'Flipkart';
          else if (url.includes('meesho')) deducedPlatform = 'Meesho';
          else deducedPlatform = 'Store';
        }

        const prismicAsText = (field) => {
          if (!field) return "";
          if (typeof field === 'string') return field;
          try { return asText(field); } catch (e) { return ""; }
        };

        return {
          id: p.id,
          name: p.data.title,
          category: p.data.category || 'General',
          price: p.data.price,
          imageUrl: p.data.image,
          amazonLink: p.data.link?.url,
          platform: deducedPlatform,
          rating: 0, 
          reviewCount: 0,
          discount: p.data.discount,
          description: prismicAsText(p.data.description) || prismicAsText(p.data.short_description) || "",
        };
      });
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
      
      <div className="container mx-auto mt-6 px-4 flex flex-col lg:flex-row gap-6 relative z-10">
        <HomeSidebar />

        <div className="flex-1 w-full min-w-0">
          {/* Dynamic Affiliate Showcase Hero Slider */}
          <header className={`${styles.heroSection} relative rounded-[32px] overflow-hidden`} data-aos="fade-in" data-aos-duration="800" style={{ backgroundImage: 'none', padding: '0', minHeight: '400px' }}>
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
                  <CallToAction text="Browse Partner Products" link="/products" type="primary" className={`${styles.heroCtaButton} ${styles.heroCtaOutline}`} icon={<FiShoppingCart />} iconPosition="left" style={{ backgroundColor: '#cc851f', borderColor: '#ffb300', color: '#ffffff', fontWeight: 'bold', backdropFilter: 'blur(8px)' }} premium />
                </div>
                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.75rem', textAlign: 'center', textShadow: '0 2px 4px rgba(0,0,0,0.8)', fontWeight: '500', background: 'rgba(0,0,0,0.3)', padding: '4px 12px', borderRadius: '100px', backdropFilter: 'blur(4px)' }} data-aos-delay="400">
                  Affiliate links help support our mission of bringing you the best tech & home essentials.
                </p>
              </div>
            </div>
          </header>
          
          <Suspense fallback={null}>
            <SearchPinterestGrid initialItems={Array.isArray(homePageData) ? homePageData : []} />
          </Suspense>

          <FeaturedFrames 
            pinterestItems={Array.isArray(homePageData) ? homePageData : []}
            localProducts={products}
            sheetProducts={sheetProducts}
          />
          
          <NewLaunchesSection />
        </div>
      </div>

      {/* Modern Interactive Tools Section */}
      <section className="py-16 my-10 mx-4 md:mx-auto max-w-7xl relative overflow-hidden rounded-[40px] text-gray-900 font-bold" style={{ backgroundColor: '#f26b0d' }}>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-pink-200 opacity-30 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] rounded-full bg-orange-200 opacity-30 blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-transparent via-white/40 to-transparent pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10 w-full">
          <div className="text-center mb-10" data-aos="fade-up">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Smart Shopping Tools</h2>
            <p className="text-lg max-w-2xl mx-auto text-gray-900/80">Track prices, compare products, and find the perfect gifts seamlessly.</p>
          </div>
          
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 pt-2 px-1 md:grid md:grid-cols-3 md:overflow-visible md:snap-none md:gap-6 hide-scrollbar max-w-[1400px] mx-auto items-stretch h-auto min-h-[420px]">
            <div className="flex-none w-[85vw] md:w-auto h-full snap-center">
               <PriceTracker />
            </div>
            <div className="flex-none w-[85vw] md:w-auto h-full snap-center">
               <ProductComparator />
            </div>
            <div className="flex-none w-[85vw] md:w-auto h-full snap-center">
               <GiftFinder />
            </div>
          </div>
          
        </div>
      </section>

      <PartnerSection partners={partners} />
      
      <Suspense fallback={null}>
        <PinterestGrid initialItems={Array.isArray(homePageData) ? homePageData : []} />
      </Suspense>

      {homePageData && !Array.isArray(homePageData) && homePageData.data?.slices && (
        <SliceZone slices={homePageData.data.slices} components={components} />
      )}

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
            <FiGift className={styles.titleIcon} /> Top Deals
          </h2>
          <p className={styles.sectionSubtitle} data-aos="fade-up" data-aos-delay="100" style={{ color: 'rgba(255,255,255,0.9)' }}>
            Limited-time offers on fantastic products. Grab them before they&#39;re gone!
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {prismicProducts.map((product) => (
              <ProductCard key={`prismic-${product.id}`} product={product} isDeal={false} />
            ))}
          </div>
          <div className="mt-12 text-center" data-aos="fade-up" data-aos-delay="200">
            <CallToAction text="View All Products" link="/daily-deals" type="primary" icon={<FiArrowRight />} style={{ backgroundColor: '#fff', color: '#f97316', border: 'none' }} />
          </div>
        </div>
      </section>



      {/* Trust Signals Section */}
      <section className={`${styles.section} ${styles.trustSection} py-12 md:py-20`} style={{ backgroundColor: '#29a629' }}>
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

