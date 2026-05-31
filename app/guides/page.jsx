import { fetchGuidesFromSheet } from '../../lib/guides';
import GuidesListClient from './GuidesListClient';

export const metadata = {
  title: 'Shopping Guides',
  description: 'Explore our comprehensive product guides and buying recommendations to help you make the best purchase decisions.',
  alternates: {
    canonical: '/guides',
  },
};

export default async function GuidesPage() {
  const allGuides = await fetchGuidesFromSheet(false);
  const limit = 12;
  const initialGuides = allGuides.slice(0, limit).map(g => ({
    slug: g.slug,
    title: g.title,
    image: g.image,
    price: g.price,
    discount: g.discount,
    description: g.description,
    category: g.category,
    platform: g.platform
  }));
  const totalPages = Math.ceil(allGuides.length / limit);
  const allPlatforms = [...new Set(allGuides.map(g => g.platform).filter(Boolean))];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
          Clickys <span className="text-green-600">Guides</span>
        </h1>
        <p className="text-xl text-gray-600">
          In-depth product reviews, features comparison, and buying advice to help you shop smarter.
        </p>
      </div>

      <GuidesListClient initialGuides={initialGuides} initialTotalPages={totalPages} allPlatforms={allPlatforms} />
    </div>
  );
}
