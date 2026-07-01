import { getGuideBySlug } from '../../../lib/guides';
import { notFound } from 'next/navigation';
import { PrismicRichText, SliceZone } from '@prismicio/react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from "../../../prismicio";
import { components } from "../../../slices";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { Suspense } from "react";

import { fetchProductsFromSheet } from '../../../lib/products';
import ProductCard from '../../../components/ProductCard';

export const revalidate = 86400;

function ContentRenderer({ field }) {
  if (!field) return null;
  if (Array.isArray(field)) {
    return <PrismicRichText field={field} />;
  }
  return <p>{field}</p>;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  // Try Sheets first
  const sheetGuide = await getGuideBySlug(slug);
  if (sheetGuide) {
    const title = `${sheetGuide.title} | Clickys Buying Guide`;
    const description = sheetGuide.description || `Comprehensive buying guide for ${sheetGuide.title}. Compare features, pros, and cons.`;
    return { 
      title,
      description,
      alternates: { canonical: `https://www.clickys.in/guides/${slug}` },
      openGraph: {
        title,
        description,
        url: `https://www.clickys.in/guides/${slug}`,
        siteName: "Clickys.in",
        images: sheetGuide.image ? [{ url: sheetGuide.image, width: 1200, height: 630, alt: title }] : [],
        type: "article",
      }
    };
  }

  // Try Prismic
  const client = createClient();
  const prismicGuide = await client.getByUID("sliceguide1", slug).catch(() => null);
  if (prismicGuide) {
    const firstGuideSlice = prismicGuide.data.slices.find(s => s.slice_type === 'guide');
    const title = firstGuideSlice?.primary?.title || "Buying Guide";
    const descriptionText = firstGuideSlice?.primary?.description?.[0]?.text || "Check out our latest buying guide, tips, and recommendations on Clickys.";
    return {
      title: `${title} | Clickys`,
      description: descriptionText,
      openGraph: {
        title: `${title} | Clickys`,
        description: descriptionText,
        url: `https://www.clickys.in/guides/${slug}`,
        images: [{ url: firstGuideSlice?.primary?.image?.url || "https://www.clickys.in/images/clickysbg.png" }],
        type: 'article',
      },
    };
  }

  return { title: 'Guide Not Found' };
}

export default async function GuidePage({ params }) {
  const { slug } = await params;
  const client = createClient();
  
  // Fetch from both sources
  const sheetGuide = await getGuideBySlug(slug);
  const prismicGuide = !sheetGuide ? await client.getByUID("sliceguide1", slug).catch(() => null) : null;

  if (!sheetGuide && !prismicGuide) notFound();

  // Fetch products for sidebar/bottom
  const allProducts = await fetchProductsFromSheet().catch(() => []);

  // RENDER PRISMIC GUIDE
  if (prismicGuide) {
    return (
      <main className="container mx-auto py-12 px-4 max-w-none w-full min-h-screen">
        <Link href="/guides" className="inline-flex items-center text-orange-600 hover:text-orange-800 font-bold mb-10 group bg-orange-50 px-4 py-2 rounded-full transition-all duration-300">
          <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Guides
        </Link>
        
        {prismicGuide.data.slices.map((slice, i) => {
          if (slice.slice_type === 'guide') {
            return (
              <article key={i} className="mb-20 bg-white rounded-[2.5rem] p-6 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                <header className="mb-10 text-center md:text-left">
                  {slice.primary.title && (
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6">
                      {slice.primary.title}
                    </h1>
                  )}
                </header>

                {slice.primary.image && (
                  <div className="relative w-full h-[400px] md:h-[600px] rounded-[2rem] overflow-hidden mb-14 shadow-2xl ring-1 ring-black/5 group flex justify-center bg-gray-50">
                    <PrismicNextImage
                      field={slice.primary.image}
                      fill
                      className="object-contain transition-transform duration-700 group-hover:scale-105"
                      fallbackAlt=""
                    />
                  </div>
                )}

                <div className="mt-8 w-full max-w-none">
                  <PrismicRichText 
                    field={slice.primary.description} 
                    components={{
                      paragraph: ({ children, key }) => (
                        <p key={key} className="text-lg md:text-2xl text-gray-600 leading-relaxed mb-8 font-medium">
                          {children}
                        </p>
                      ),
                      heading1: ({ children, key }) => <h1 key={key} className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 mt-16">{children}</h1>,
                      heading2: ({ children, key }) => <h2 key={key} className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 mt-14">{children}</h2>,
                      image: ({ node, key }) => (
                        <figure key={key} className="my-12 w-full rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100 bg-gray-50">
                          <img src={node.url} alt={node.alt || ""} className="w-full h-auto max-h-[600px] object-contain" />
                        </figure>
                      )
                    }}
                  />
                </div>

                {slice.primary.link && (
                  <div className="mt-16 text-center">
                    <PrismicNextLink
                      field={slice.primary.link}
                      className="inline-flex items-center justify-center px-12 py-6 text-2xl font-bold text-white transition-all duration-500 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full shadow-2xl hover:scale-105"
                    >
                      Buy Now
                    </PrismicNextLink>
                  </div>
                )}
              </article>
            );
          }
          return (
            <Suspense key={i} fallback={<div>Loading...</div>}>
              <SliceZone slices={[slice]} components={components} />
            </Suspense>
          );
        })}
      </main>
    );
  }

  // RENDER SHEET GUIDE
  const relatedProducts = allProducts
    .filter(p => p.category && sheetGuide.category && p.category.toLowerCase() === sheetGuide.category.toLowerCase())
    .slice(0, 3);
  const finalRelated = relatedProducts.length > 0 ? relatedProducts : allProducts.sort(() => 0.5 - Math.random()).slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8 max-w-none w-full">
      <Link href="/guides" className="inline-block mb-6 font-bold text-[#ef731b] hover:text-[#ef731b]/90 transition-colors">
        ← Back to Guides
      </Link>
      <h1 className="text-4xl md:text-6xl font-black mb-8">{sheetGuide.title}</h1>
      
      <div className="bg-white p-6 md:p-12 rounded-[2.5rem] border border-gray-200 shadow-sm mb-8 mt-8 w-full">
        <h2 className="text-3xl font-black mb-6">Description</h2>
        <div className="prose max-w-none text-lg md:text-xl text-gray-700 leading-relaxed">
          <ContentRenderer field={sheetGuide.description} />
        </div>
        {sheetGuide.image && (
          <div className="mt-12 relative h-[400px] md:h-[600px] w-full rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100">
            <Image
              src={sheetGuide.image}
              alt={sheetGuide.title}
              fill
              className="object-contain p-4 mix-blend-multiply"
              referrerPolicy="no-referrer"
              unoptimized
            />
          </div>
        )}
      </div>

      {sheetGuide.features && (
          <div className="bg-white p-6 md:p-12 rounded-[2.5rem] border border-gray-200 shadow-sm mb-8 w-full">
            <h2 className="text-3xl font-black mb-6">Features</h2>
            <div className="prose max-w-none">
              <ContentRenderer field={sheetGuide.features} />
            </div>
          </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {sheetGuide.pros && (
            <div className="bg-white p-6 md:p-12 rounded-[2.5rem] border border-gray-200 shadow-sm">
              <h2 className="text-3xl font-black mb-6 text-green-600">Pros</h2>
              <div className="prose max-w-none">
                <ContentRenderer field={sheetGuide.pros} />
              </div>
            </div>
        )}
        {sheetGuide.cons && (
            <div className="bg-white p-6 md:p-12 rounded-[2.5rem] border border-gray-200 shadow-sm">
              <h2 className="text-3xl font-black mb-6 text-red-600">Cons</h2>
              <div className="prose max-w-none">
                <ContentRenderer field={sheetGuide.cons} />
              </div>
            </div>
        )}
      </div>

      {sheetGuide.alternatives && (
          <div className="bg-white p-6 md:p-12 rounded-[2.5rem] border border-gray-200 shadow-sm mb-8 w-full">
            <h2 className="text-3xl font-black mb-6">Alternatives</h2>
            <div className="prose max-w-none mb-8">
              <ContentRenderer field={sheetGuide.alternatives} />
            </div>
            {sheetGuide.link && (
                <a href={sheetGuide.link} target="_blank" rel="noopener noreferrer" className="inline-block bg-[#eb7125] text-white px-10 py-5 rounded-full font-black uppercase tracking-widest hover:bg-[#eb7125]/90 transition-all transform hover:scale-105 shadow-xl">
                  Buy Now
                </a>
            )}
          </div>
      )}

      {sheetGuide.faq && (
          <div className="bg-white p-6 md:p-12 rounded-[2.5rem] border border-gray-200 shadow-sm mb-8 w-full">
            <h2 className="text-3xl font-black mb-6">FAQ</h2>
            <div className="prose max-w-none">
              <ContentRenderer field={sheetGuide.faq} />
            </div>
          </div>
      )}

      {finalRelated.length > 0 && (
        <section className="mt-20 pt-16 border-t border-gray-200">
          <h2 className="text-4xl font-black mb-12 text-center">You Might Also Like These Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {finalRelated.map((product, idx) => (
              <ProductCard key={idx} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
