import React, { Suspense } from 'react';
import { fetchProductsFromSheet } from '@/lib/products';
import DailyDealsClient from './DailyDealsClient';
import { FiSearch } from 'react-icons/fi';

export const revalidate = 86400; // Cache for 24 hours to maximize speed and minimize API cost

export default async function DealsPage() {
  let products = [];
  let error = false;
  let message = "";

  try {
    products = await fetchProductsFromSheet();
  } catch (err: any) {
    error = true;
    message = err.message;
  }

  // Pre-map the initial products for the client
  const mappedProducts = products.map((product: any, idx: number) => ({
    id: `daily-deal-${idx}`,
    name: product.title || '',
    category: product.category || 'Uncategorized',
    price: product.price || '0',
    amazonLink: product.link || '#',
    imageUrl: product.image || '',
    discount: product.discount || '',
    platform: product.platform || '',
    description: product.description || '',
    shortDescription: product.description || '', // Aliased for ProductCard consistency
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Prismic CMS headers/nav can easily sit above this section in your RootLayout */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Daily Deals</h1>
        <p className="text-gray-500 mt-2">Discover the best hand-picked deals from top platforms like Amazon, Flipkart, Myntra, and more.</p>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl mb-8 flex items-start gap-4 shadow-sm">
          <div className="bg-red-100 p-2 rounded-full mt-1">
            <FiSearch className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg">Unable to load deals</h3>
            <p className="text-red-600/80 mt-1">{message || "The platform is currently undergoing maintenance. Please try again in 5 minutes."}</p>
            <a 
              href="/daily-deals"
              className="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors"
            >
              Retry Loading
            </a>
          </div>
        </div>
      ) : mappedProducts.length === 0 ? (
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded mb-6">
          No deals found matching your criteria.
        </div>
      ) : (
        <Suspense fallback={<div>Loading deals...</div>}>
          <DailyDealsClient initialProducts={mappedProducts} />
        </Suspense>
      )}
    </div>
  );
}
