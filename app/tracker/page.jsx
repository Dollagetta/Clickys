import PriceTracker from '../../components/PriceTracker';

export const metadata = {
  title: 'Price Tracker | Clickys',
  description: 'Track prices and get alerts for your favorite products on Clickys.',
};

export default function TrackerPage() {
  return (
    <div className="container mx-auto px-4 py-20 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Price Tracker</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Never miss a deal. Set up price alerts and get notified instantly when prices drop.</p>
      </div>
      <div className="max-w-3xl mx-auto">
        <PriceTracker />
      </div>
    </div>
  );
}