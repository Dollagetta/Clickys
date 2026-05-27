import React from 'react';
import { fetchProductsFromSheet } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Prismic CMS headers/nav can easily sit above this section in your RootLayout */}
      <h1 className="text-3xl font-bold mb-8">Daily Deals</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded mb-6">
          <h3 className="font-bold">Error loading products:</h3>
          <p>{message}</p>
        </div>
      )}

      {products.length === 0 && !error && (
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded mb-6">
          No products found. (API returned an empty array).
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product: any, idx: number) => {
          const mappedProduct = {
            id: `daily-deal-${idx}`,
            name: product.title,
            category: product.category,
            price: product.price,
            amazonLink: product.link,
            imageUrl: product.image,
            discount: product.discount,
            platform: 'Amazon',
          };
          return <ProductCard key={idx} product={mappedProduct} />;
        })}
      </div>
    </div>
  );
}
