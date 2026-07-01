import ProductComparator from '../../components/ProductComparator';
import FloatingProducts from '../../components/FloatingProducts';

export const metadata = {
  title: 'Product Comparator | Clickys',
  description: 'Compare products side by side to make the best purchasing decisions.',
};

export default function ComparePage() {
  return (
    <div className="container mx-auto px-4 py-20 min-h-screen relative z-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Compare Products</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Compare features, prices, and specs side by side to find what's best for you.</p>
      </div>
      <div className="max-w-5xl mx-auto">
        <ProductComparator />
      </div>
      <FloatingProducts />
    </div>
  );
}