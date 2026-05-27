import React from 'react';

async function getProducts() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/products`, { cache: 'no-store' });
    const data = await res.json();
    if (!res.ok) return { error: true, message: data.error || 'Fetch failed', raw: data };
    return { data };
  } catch (err: any) {
    return { error: true, message: err.message };
  }
}

export default async function DealsPage() {
  const response = await getProducts();
  const products = response.data || [];
  const error = response.error;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Prismic CMS headers/nav can easily sit above this section in your RootLayout */}
      <h1 className="text-3xl font-bold mb-8">Daily Deals</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded mb-6">
          <h3 className="font-bold">Error loading products:</h3>
          <p>{response.message}</p>
          {response.raw && <pre className="mt-2 text-xs overflow-auto max-h-40">{JSON.stringify(response.raw, null, 2)}</pre>}
        </div>
      )}

      {products.length === 0 && !error && (
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded mb-6">
          No products found. (API returned an empty array).
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product: any, idx: number) => (
          <div key={idx} className="border rounded-lg overflow-hidden flex flex-col p-4 shadow-sm hover:shadow-md transition">
            <img src={product.image || 'https://placehold.co/600x400/eeeeee/333333?text=No+Image'} alt={product.title} className="w-full h-48 object-contain mb-4 rounded bg-gray-50 p-2" />
            <span className="text-xs text-blue-600 font-semibold mb-1">{product.category}</span>
            <h2 className="font-medium text-sm line-clamp-2 mb-3 h-10">{product.title}</h2>
            <div className="flex justify-between items-center mt-auto">
              <span className="font-bold text-lg">{product.price}</span>
              {product.discount && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">{product.discount}</span>}
            </div>
            <a href={product.link} target="_blank" className="mt-4 bg-black text-white text-center py-2 rounded text-sm hover:bg-gray-800">
              Buy Now
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
