import { Suspense } from 'react';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import ProductCard from '../../../components/ProductCard';
import { products } from '../../../components/products';
import { allGuides } from '../../../components/guides';
import { createClient } from "../../../prismicio";
import { asText } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import styles from '../../../styles/Home.module.css';

export const revalidate = 86400;

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  
  // Format slug back to Name (e.g. "pet-supplies" -> "Pet Supplies")
  const categoryName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const client = createClient();

  const [guidesResponseResult, prismicProductsResResult] = await Promise.allSettled([
    client.getAllByType("whatsnew", {
      orderings: { field: 'my.whatsnew.date', direction: 'desc' },
    }),
    client.getAllByType('product')
  ]);

  // Prismic Guides (whatsnew)
  let guidesData = [];
  if (guidesResponseResult.status === 'fulfilled') {
    guidesData = guidesResponseResult.value.map(doc => {
      let excerptText = 'No excerpt available.';
      if (doc.data.slices && doc.data.slices.length > 0) {
        const textSlice = doc.data.slices.find(s => s.slice_type === 'text' || s.primary?.description);
        if (textSlice && textSlice.primary?.description) {
           excerptText = asText(textSlice.primary.description).substring(0, 150) + '...';
        }
      }
      return {
        id: doc.id,
        slug: doc.uid,
        title: doc.data.title || doc.data.name || 'Untitled',
        imageField: doc.data.image || doc.data.hero_image,
        category: doc.tags[0] || 'General',
        excerpt: excerptText,
      };
    });
  }

  // Prismic Products
  let prismicProducts = [];
  if (prismicProductsResResult.status === 'fulfilled') {
    prismicProducts = prismicProductsResResult.value.map(p => ({
      id: p.id,
      name: p.data.title,
      category: p.data.category || 'General',
      price: p.data.price,
      imageUrl: p.data.image,
      amazonLink: p.data.link?.url,
      platform: p.data.platform || 'Amazon',
      rating: 0,
    }));
  }

  // Also include the local fallback products and guides
  const allProductsCombined = [...products, ...prismicProducts];
  const allGuidesCombined = [...allGuides, ...guidesData];

  // Filter based on the requested category
  const filteredProducts = allProductsCombined.filter(p => 
    p.category && p.category.toLowerCase() === categoryName.toLowerCase()
  );
  
  const filteredGuides = allGuidesCombined.filter(g => 
    g.category && g.category.toLowerCase() === categoryName.toLowerCase()
  );

  return (
    <>
      <div className="container mx-auto max-w-7xl px-4 py-8">
        
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors font-semibold bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
            <FiArrowLeft /> Back to Home
          </Link>
        </div>

        <div className="flex items-center gap-4 mb-10">
          <h1 className="text-4xl font-bold text-gray-900 capitalize">
            {categoryName}
          </h1>
          <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">{filteredProducts.length} Products</span>
        </div>

        {/* Products Section */}
        {filteredProducts.length > 0 ? (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 border-gray-200">Top Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} isDeal={false} />
              ))}
            </div>
          </section>
        ) : (
          <div className="mb-16 p-8 bg-gray-50 rounded-2xl text-center border border-gray-200">
            <p className="text-gray-500">We couldn't find any products specifically listed under "{categoryName}" right now.</p>
          </div>
        )}

        {/* Guides Section */}
        {filteredGuides.length > 0 && (
          <section className={`${styles.section} ${styles.guidesSection} bg-gray-50 rounded-3xl p-8`}>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 border-gray-200">Related Guides</h2>
            <div className={styles.guidesGrid}>
              {filteredGuides.map((guide, index) => (
                <div key={guide.id} className={styles.guideCard}>
                  <Link href={`/whats-new/${guide.slug}`} className={styles.guideLink}>
                    <div className={styles.guideImageWrapper}>
                      {guide.imageField ? (
                        <PrismicNextImage field={guide.imageField} fill style={{objectFit: 'cover'}} />
                      ) : (
                        <img src={guide.imageUrl || 'https://placehold.co/600x400?text=Guide'} alt={guide.title} style={{objectFit: 'cover', width: '100%', height: '100%'}} />
                      )}
                      <div className={styles.tagWrapper}>
                        <span className={styles.guideCategoryTag}>{guide.category}</span>
                      </div>
                    </div>
                    <div className={styles.guideContent}>
                      <h3 className={styles.guideTitle}>{guide.title}</h3>
                      <p className={styles.guideExcerpt}>{guide.excerpt}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </>
  );
}
