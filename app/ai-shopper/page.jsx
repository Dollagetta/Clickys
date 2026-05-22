import SmartShopFeatures from '../../components/SmartShopFeatures';
import Link from 'next/link';

export const metadata = {
  title: 'Smart Shop | Clickys',
  description: 'Let our AI find the best products and deals across the web for you.',
};

export default function AIShopperPage() {
  return (
    <>
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* PREMIUM HERO SECTION */}
        <div className="mb-12 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-none mb-6 mt-8">
            Welcome to Clickys <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-green-600">Smart Shop</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl font-medium">
            Smart product discovery powered by intelligent recommendations.
          </p>
        </div>

        <SmartShopFeatures />
      </div>
    </>
  );
}
