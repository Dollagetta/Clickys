import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import { createClient } from "../../../prismicio";
import { components } from "../../../slices";
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import NewLaunchesSection from "../../../components/NewLaunchesSection";

export async function generateMetadata({ params }) {
  const { uid } = await params;
  const client = createClient();
  const page = await client.getByUID("whatsnew", uid).catch(() => notFound());

  return {
    title: `${page.data.meta_title || page.data.title || "What's New"} | Clickys`,
    description: page.data.meta_description,
  };
}

export default async function WhatsNewPage({ params }) {
  const { uid } = await params;
  const client = createClient();
  const page = await client.getByUID("whatsnew", uid).catch(() => notFound());

  // Extract product images from any Shopping Grid slices to pass to the Burner
  const shoppingGridImages = page.data.slices
    ?.filter(s => s.slice_type === 'the_shopping_grid')
    ?.flatMap(s => s.primary.the_items || s.items || [])
    ?.map(item => item.product_image?.url)
    ?.filter(Boolean) || [];

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Link 
          href="/whats-new" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors mb-8 font-medium"
        >
          <FiArrowLeft /> Back to What's New
        </Link>
        
        <main>
          <NewLaunchesSection />
          <SliceZone 
            slices={page.data.slices} 
            components={components} 
            context={{ galleryImages: shoppingGridImages }}
          />
        </main>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const client = createClient();
  let pages = [];
  try {
    pages = await client.getAllByType("whatsnew");
  } catch (error) {
    console.warn("Could not fetch whatsnew documents for static params (the content type may not exist in Prismic yet):", error.message);
  }

  return pages.map((page) => {
    return { uid: page.uid };
  });
}
