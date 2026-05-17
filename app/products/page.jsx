import ProductsPage from './ProductsPage';
import {products} from '../../components/products'
import { Suspense } from 'react';
import { ProductGridSkeleton } from '../../components/ProductGridSkeleton';

/*export const metadata = {
  title: "Amazon Products | Best Deals on Clickys.in",
  description: "Explore top Amazon deals on smartwatches, trimmers, kitchen tools, and wellness products. Shop curated combos at Clickys.in for the best prices in India!",
  keywords: [
    "boat smartwatch with heart rate monitor",
    "Amazon trimmer cordless rechargeable",
    "camera for kids and hobby photography",
    "cooking set Amazon India top seller",
    "BPA-free water bottles Amazon India",
    "herbal body lotions Amazon brand",
    "energy booster supplements Amazon India",
    "Amazon kitchen tools combo offer",
    "travel-size dry iron Amazon portable",
    "grooming electronics on Amazon deals",
    "Amazon daily use kitchen items",
    "smart wearable offers Amazon",
    "body care essentials Amazon only"
  ],
  openGraph: {
    title: "Amazon Deals on Clickys.in | Smartwatches, Kitchen & More",
    description: "Find the best Amazon products like smartwatches, trimmers, and kitchen essentials at Clickys.in. Shop now for exclusive deals!",
    url: "https://www.clickys.in/products",
    siteName: "Clickys.in",
    type: "website",
    locale: "en_IN"
  },
  twitter: {
    card: "summary_large_image",
    title: "Amazon Products | Clickys.in Deals",
    description: "Discover Amazon’s top smartwatches, grooming kits, and kitchen tools at Clickys.in. Shop now for exclusive offers!"
  }
};*/

export const metadata = {
  title: 'Clickys – Amazon Products | Top Deals & Reviews',
  description: 'Discover Amazon bestsellers with Clickys. Explore electronics, fashion, health, kitchen essentials, laptops, Best AirPods, Best Smartphones, Alexa & more with trusted reviews and offers.',
  keywords: 'Amazon deals, Amazon products, Amazon reviews, laptops Amazon, AirPods Amazon, Alexa Amazon Echo, Amazon fashion, Amazon electronics',
};

const page = () => {
  return (
    <div className="container py-12">
      <Suspense fallback={<ProductGridSkeleton count={8} />}>
        <ProductsPage products={products} />
      </Suspense>
    </div>
  )
}

export default page
