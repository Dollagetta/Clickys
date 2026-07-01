import PriceTracker from '../../components/PriceTracker';
import FloatingProducts from '../../components/FloatingProducts';

export const metadata = {
  title: 'Price Tracker | Clickys',
  description: 'Track prices and get alerts for your favorite products on Clickys.',
};

export default function TrackerPage() {
  return (
    <div className="container mx-auto px-4 py-20 min-h-screen relative z-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Price Tracker</h1>
        <p className="text-lg text-[#161414] max-w-2xl mx-auto">Never miss a deal. Set up price alerts and get notified instantly when prices drop.</p>
      </div>
      <div className="max-w-3xl mx-auto bg-[#9e2525]">
        <PriceTracker />
      </div>
      <FloatingProducts />
    </div>
  );
}