import GiftFinder from '../../components/GiftFinder';


export const metadata = {
  title: 'Smart Gift Finder | Clickys',
  description: 'Find the perfect gift for your loved ones with our interactive Smart Gift Finder. Get personalized gift ideas instantly.',
  alternates: {
    canonical: 'https://www.clickys.in/gifts'
  }
};

export default function GiftsPage() {
  return (
   <div className="w-full px-4 sm:px-6 lg:px-8 py-20 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Smart Gift Finder</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Answer three quick questions and we'll find the perfect, thoughtful gift recommendations instantly.</p>
      </div>
      <div className="w-full mx-auto">
        <GiftFinder />
      </div>
     
    </div>
  );
}