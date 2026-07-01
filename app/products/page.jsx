import ProductsPage from './ProductsPage';
import { products } from '../../components/products.js';
import { Suspense } from 'react';
import { ProductGridSkeleton } from '../../components/ProductGridSkeleton';
import { createClient } from '../../prismicio';
import { SliceZone } from '@prismicio/react';
import { components } from '../../slices';
import { fetchProductsFromSheet } from '../../lib/products';
import FloatingProducts from '../../components/FloatingProducts';

export const revalidate = 86400;

export const metadata = {
  title: 'Clickys – Amazon Products | Top Deals & Reviews',
  description: 'Discover Amazon bestsellers with Clickys. Explore electronics, fashion, health, kitchen essentials, laptops, Best AirPods, Best Smartphones, Alexa & more with trusted reviews and offers.',
  keywords: 'Amazon deals, Amazon products, Amazon reviews, laptops Amazon, AirPods Amazon, Alexa Amazon Echo, Amazon fashion, Amazon electronics',
  alternates: {
    canonical: '/products',
  },
};

const page = async () => {
    const rawSheetProductsResult = await fetchProductsFromSheet().catch(() => []);
    const rawSheetProducts = rawSheetProductsResult || [];
    
    // Add fallback to local products if sheet is empty
    const sourceProducts = rawSheetProducts.length > 0 ? rawSheetProducts : (products || []);
    
    // Standardize sourceProducts for ProductCard and LimitedTimeDeals
    const standardizedSheetProducts = (sourceProducts || []).map((p, idx) => ({
      id: p.id || `sheet-${idx}`,
      name: p.title || p.name || 'Product',
      title: p.title || p.name || 'Product', // Alias for component compatibility
      category: p.category || 'General',
      price: p.price || '',
      imageUrl: p.image || p.imageUrl || '',
      image: p.image || p.imageUrl || '', // Alias for component compatibility
      link: p.link || p.amazonLink || '',  // Alias for component compatibility
      amazonLink: p.link || p.amazonLink || '',
      platform: p.platform || 'Direct',
      discount: p.discount || '',
      description: p.description || ''
    }));
    
    // Calculate productsByPlatform here
    const fourHourIndex = Math.floor(new Date().getTime() / (1000 * 60 * 60 * 4));
    const getPlatformDeals = (platform, count = 12) => {
      let platformProducts = standardizedSheetProducts.filter(p => {
        const link = (p.link || p.amazonLink || '').toLowerCase();
        const pPlatform = (p.platform || '').toLowerCase();
        
        if (platform === 'amazon') {
          return pPlatform.includes('amazon') || link.includes('amazon') || link.includes('amzn');
        }
        return pPlatform.includes(platform.toLowerCase()) || link.includes(platform.toLowerCase());
      });
      
      // If we don't have enough platform specific products, use generic products and fake the platform for display
      if (platformProducts.length === 0) {
         platformProducts = standardizedSheetProducts.map(p => ({
             ...p,
             platform: p.platform || platform.charAt(0).toUpperCase() + platform.slice(1)
         }));
      }

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

  return (
    <div className="container py-12 relative z-10">
      <Suspense fallback={<ProductGridSkeleton count={8} />}>
        <ProductsPage products={standardizedSheetProducts} productsByPlatform={productsByPlatform} />
      </Suspense>
      <FloatingProducts />
    </div>
  )
}

export default page
