import AIShopperClient from '../../components/AIShopperClient';
import { FiShoppingCart } from 'react-icons/fi';

export const metadata = {
  title: 'Smart Shop | Clickys',
  description: 'Let our AI find the best products and deals across the web for you.',
};

export default function AIShopperPage() {
  return (
    <>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
            <span style={{ fontSize: '2.5rem', color: '#ff7b00' }}><FiShoppingCart /></span> Smart Shop
          </h1>
        </div>
        
        <AIShopperClient />
      </div>
    </>
  );
}
