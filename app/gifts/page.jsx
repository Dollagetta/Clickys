import GiftFinder from '../../components/GiftFinder';

export const metadata = {
  title: 'Gift Finder | Clickys',
  description: 'Find the perfect gift for your loved ones with our interactive Smart Gift Finder.',
};

export default function GiftsPage() {
  return (
    <div className="container mx-auto px-4 py-20 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Smart Gift Finder</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Answer three quick questions and we'll find the perfect, thoughtful gift recommendations instantly.</p>
      </div>
      <div className="max-w-4xl mx-auto">
        <GiftFinder />
      </div>
    </div>
  );
}