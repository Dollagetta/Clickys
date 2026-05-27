import React, { Suspense } from 'react';
import { fetchProductsFromSheet } from '@/lib/products';
import DailyDealsClient from './DailyDealsClient';

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
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Prismic CMS headers/nav can easily sit above this section in your RootLayout */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Daily Deals</h1>
        <p className="text-gray-500 mt-2">Discover the best hand-picked deals from top platforms like Amazon, Flipkart, Myntra, and more.</p>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded mb-6">
          <h3 className="font-bold">Error loading products:</h3>
          <p>{message}</p>
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
