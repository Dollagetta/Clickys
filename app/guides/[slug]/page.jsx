import { getGuideBySlug } from '../../../lib/guides';
import { notFound } from 'next/navigation';
import { PrismicRichText } from '@prismicio/react';
import Link from 'next/link';

import { fetchProductsFromSheet } from '../../../lib/products';
import ProductCard from '../../../components/ProductCard';

function ContentRenderer({ field }) {
  if (!field) return null;
  if (Array.isArray(field)) {
    return <PrismicRichText field={field} />;
  }
  return <p>{field}</p>;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) return { title: 'Guide Not Found' };
  return { title: guide.title };
}

export default async function GuidePage({ params }) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);

  if (!guide) notFound();

  // Fetch some products for "You Might Also Like"
  const allProducts = await fetchProductsFromSheet().catch(() => []);
  const relatedProducts = allProducts
    .filter(p => p.category && guide.category && p.category.toLowerCase() === guide.category.toLowerCase())
    .slice(0, 3);
  
  // Fallback to random if no category match
  const finalRelated = relatedProducts.length > 0 ? relatedProducts : allProducts.sort(() => 0.5 - Math.random()).slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/guides" className="inline-block mb-6 font-bold text-[#ef731b] hover:text-[#ef731b]/90 transition-colors">
        ← Back to Guides
      </Link>
      <h1 className="text-4xl font-bold mb-4">{guide.title}</h1>
      
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-300 mb-8 mt-8">
        <h2 className="text-2xl font-bold mb-4">Description</h2>
        <div className="prose">
          <ContentRenderer field={guide.description} />
        </div>
      </div>

      {guide.features && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-300 mb-8">
            <h2 className="text-2xl font-bold mb-4">Features</h2>
            <div className="prose">
              <ContentRenderer field={guide.features} />
            </div>
          </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {guide.pros && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-300">
              <h2 className="text-2xl font-bold mb-4">Pros</h2>
              <div className="prose">
                <ContentRenderer field={guide.pros} />
              </div>
            </div>
        )}
        {guide.cons && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-300">
              <h2 className="text-2xl font-bold mb-4">Cons</h2>
              <div className="prose">
                <ContentRenderer field={guide.cons} />
              </div>
            </div>
        )}
      </div>

      {guide.alternatives && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-300 mb-8">
            <h2 className="text-2xl font-bold mb-4">Alternatives</h2>
            <div className="prose mb-6">
              <ContentRenderer field={guide.alternatives} />
            </div>
            {guide.link && (
                <a href={guide.link} target="_blank" rel="noopener noreferrer" className="inline-block bg-[#eb7125] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#eb7125]/90 transition-colors">
                  Buy Now
                </a>
            )}
          </div>
      )}

      {guide.faq && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-300 mb-8">
            <h2 className="text-2xl font-bold mb-4">FAQ</h2>
            <div className="prose">
              <ContentRenderer field={guide.faq} />
            </div>
          </div>
      )}

      {/* Related Products Section */}
      {finalRelated.length > 0 && (
        <section className="mt-16 pt-12 border-t border-gray-200">
          <h2 className="text-3xl font-bold mb-8 text-center">You Might Also Like These Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {finalRelated.map((product, idx) => (
              <ProductCard key={idx} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
