import { Suspense } from 'react';
import { createClient } from "../../prismicio";
import { fetchProductsFromSheet } from '../../lib/products';
import WhatsNewGrid from './WhatsNewGrid';
import LimitedTimeDeals from './LimitedTimeDeals';


export const revalidate = 86400;

export const metadata = {
  title: "What's New & Trending | Clickys",
  description: "Explore our latest affiliate guides, tech reviews, fresh arrivals, and amazing trending deals.",
  alternates: {
    canonical: "https://www.clickys.in/whats-new"
  }
};

export default async function WhatsNewListingPage() {
  const client = createClient();
  let pages = [];
  try {
    pages = await client.getAllByType("whatsnew", {
      orderings: [
        { field: "document.first_publication_date", direction: "desc" },
      ],
    });
  } catch (error) {
    console.warn("whatsnew type might not exist yet in Prismic:", error.message);
  }

  // Fetch products for Limited Time Deals
  let allProducts = [];
  try {
    allProducts = await fetchProductsFromSheet();
  } catch (error) {
    console.error("Error fetching products for deals:", error);
  }

  // Selection logic for 4-hour windows
  const now = new Date();
  const fourHourIndex = Math.floor(now.getTime() / (1000 * 60 * 60 * 4));

  const getPlatformDeals = (platform, count = 4) => {
    const platformProducts = allProducts.filter(p => 
      p.platform?.toLowerCase().includes(platform.toLowerCase())
    );
    if (platformProducts.length === 0) return [];
    
    // Use a stable offset for the current 4-hour window
    const startIndex = (fourHourIndex * count) % platformProducts.length;
    const result = [];
    for (let i = 0; i < count; i++) {
        result.push(platformProducts[(startIndex + i) % platformProducts.length]);
    }
    return result;
  };

  const productsByPlatform = {
    myntra: getPlatformDeals('myntra', 4),
    amazon: getPlatformDeals('amazon', 8), // 4 + 4 as requested
    flipkart: getPlatformDeals('flipkart', 4),
    ajio: getPlatformDeals('ajio', 4)
  };

  return (
    <>
     <div className="bg-[#f8f9fa] min-h-screen pb-24 pt-12">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <header className="mb-20 text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight">
              What's <span className="text-green-600">New</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              Curated finds, trending tech drops, and fresh ideas delivered exclusively for you.
            </p>
          </header>

          <Suspense fallback={<div className="h-96 flex items-center justify-center text-gray-400">Loading new content...</div>}>
            <WhatsNewGrid pages={pages} />
          </Suspense>

          <Suspense fallback={<div className="h-48 border-2 border-dashed border-gray-200 rounded-3xl flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest mt-24">Syncing latest deals...</div>}>
            <LimitedTimeDeals productsByPlatform={productsByPlatform} allProducts={allProducts} />
          </Suspense>
        </div>
       
      </div>
    </>
  );
}
