import DealsPage from "./DealsPage"
//import { products } from '../../components/products'
import { products } from '../../components/flipkartProducts'
import { createClient } from '../../prismicio';
import PaginatedGuides from './PaginatedGuides';
import { Suspense } from 'react';

// Metadata for the Deals page

/*export const metadata = {
  title: "Flipkart Deals | Best Offers on Clickys.in",
  description: "Shop the best Flipkart deals on smartwatches, cookware, grooming kits, and more. Find affordable combos and daily essentials at Clickys.in!",
  keywords: [
    "Flipkart smartwatches under ₹1500",
    "Flipkart beard grooming kits",
    "Flipkart cookware sale India",
    "water bottle combo under ₹500 Flipkart",
    "Flipkart skin lotion with aloe vera",
    "multivitamin tablets Flipkart health",
    "knife and gum cutter Flipkart set",
    "Flipkart irons for bachelors",
    "fitness supplements on Flipkart sale",
    "Flipkart essentials for men grooming",
    "affordable kitchen deals Flipkart",
    "Flipkart best offers today electronics",
    "home gadgets Flipkart trending"
  ],
  openGraph: {
    title: "Flipkart Deals on Clickys.in | Affordable Gadgets & More",
    description: "Explore Flipkart’s best offers on smartwatches, grooming essentials, and kitchen tools at Clickys.in. Shop now for great savings!",
    url: "https://www.clickys.in/deals",
    siteName: "Clickys.in",
    type: "website",
    locale: "en_IN"
  },
  twitter: {
    card: "summary_large_image",
    title: "Flipkart Deals | Clickys.in Offers",
    description: "Get Flipkart’s top deals on smartwatches, cookware, and grooming products at Clickys.in. Shop affordable combos today!"
  }
};*/

export const metadata = {
  title: 'Clickys – All Products | Amazon, Flipkart & More',
  description: 'Shop Amazon, Flipkart, Myntra, Meesho, Ajio & Blinkit deals. Explore trending products, compare offers, and save big with Clickys.',
  keywords: 'all products, Amazon deals, Flipkart offers, Myntra sale, Meesho products, Ajio discounts, Blinkit shopping, trending products, save big',
};
//const dealProducts = products.filter(product => product.isDeal);
//const dealProducts = products;

const page = async () => {
  const client = createClient();
  let allSlices = [];
  
  try {
    const guideDocuments = await client.getAllByType('sliceguide1', {
      orderings: [
        { field: 'document.first_publication_date', direction: 'desc' }
      ]
    });
    
    allSlices = guideDocuments.flatMap(doc => {
      return (doc.data?.slices || []).map(slice => ({
        ...slice,
        docUid: doc.uid
      }));
    });
  } catch (error) {
    console.error("Failed to fetch sliceguide1:", error);
  }

  return (
    <>
      <Suspense fallback={<div>Loading deals...</div>}>
        <DealsPage products={ products }/>
      </Suspense>
      {allSlices.length > 0 && (
        <section className="w-full max-w-7xl mx-auto px-4 py-16 mt-8 border-t border-gray-100">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              Latest Highlights
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
              Our latest insights and carefully curated selections.
            </p>
          </div>
          <Suspense fallback={<div>Loading highlights...</div>}>
            <PaginatedGuides slices={allSlices} />
          </Suspense>
        </section>
      )}
    </>
  )
}

export default page;
