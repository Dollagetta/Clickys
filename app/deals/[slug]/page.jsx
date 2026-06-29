import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import { createClient } from "../../../prismicio";
import { components } from "../../../slices";
import Link from 'next/link';
import { Suspense } from 'react';
import { FiArrowLeft, FiTag } from 'react-icons/fi';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const client = createClient();
  const page = await client.getByUID("sliceguide1", slug).catch(() => notFound());

  const title = `${page.data.meta_title || page.data.title || "Exclusive Deal"} | Clickys`;
  const description = page.data.meta_description || "Check out this amazing deal on Clickys! Limited time offer.";
  
  let ogImage = page.data.meta_image?.url || page.data.image?.url;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: `https://clickys.in/deals/${slug}`,
      siteName: "Clickys.in",
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ogImage ? [ogImage] : [],
    }
  };
}

export default async function DealDetailPage({ params }) {
  const { slug } = await params;
  const client = createClient();
  const page = await client.getByUID("sliceguide1", slug).catch(() => notFound());

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-12 pt-24">
        <Link 
          href="/deals" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors mb-8 font-semibold"
        >
          <FiArrowLeft /> Back to All Deals
        </Link>
        
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-4 text-orange-600 font-bold uppercase tracking-wider text-sm">
            <FiTag />
            <span>Limited Time Deal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            {page.data.title || "Special Offer"}
          </h1>
          {page.data.description && (
            <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
              {page.data.description}
            </p>
          )}
        </header>

        <main>
          <Suspense fallback={<div className="py-20 text-center">Loading deal details...</div>}>
            <SliceZone 
              slices={page.data.slices} 
              components={components} 
            />
          </Suspense>
        </main>
        
        <div className="mt-20 p-8 bg-gray-50 rounded-3xl text-center">
          <h3 className="text-2xl font-bold mb-4">Don't miss out!</h3>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            This deal is curated by our experts. Prices and availability are subject to change.
          </p>
          <Link 
            href="/deals" 
            className="inline-block bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg hover:shadow-orange-200"
          >
            Explore More Deals
          </Link>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const client = createClient();
  let pages = [];
  try {
    pages = await client.getAllByType("sliceguide1");
  } catch (error) {
    console.warn("Could not fetch deal documents for static params:", error.message);
  }

  return pages.map((page) => {
    return { slug: page.uid };
  });
}
