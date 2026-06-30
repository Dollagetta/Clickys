import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import { createClient } from "../../../prismicio";
import { components } from "../../../slices";
import Link from 'next/link';
import { Suspense } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import NewLaunchesSection from "../../../components/NewLaunchesSection";

export async function generateMetadata({ params }) {
  const { uid } = await params;
  const client = createClient();
  const page = await client.getByUID("whatsnew", uid).catch(() => notFound());

  const title = `${page.data.meta_title || page.data.title || "What's New"} | Clickys`;
  const description = page.data.meta_description || "Discover what's new on Clickys! Check out the latest products and offers.";
  
  // Try to find a featured image
  let ogImage = page.data.meta_image?.url;
  if (!ogImage) {
    const shoppingGridImages = page.data.slices
      ?.filter(s => s.slice_type === 'the_shopping_grid')
      ?.flatMap(s => s.primary?.the_items || s.items || [])
      ?.map(item => item.product_image?.url)
      ?.filter(Boolean) || [];
    if (shoppingGridImages.length > 0) {
      ogImage = shoppingGridImages[0];
    }
  }

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: `https://www.clickys.in/whats-new/${uid}`,
      siteName: "Clickys.in",
      images: ogImage ? [{ 
        url: `https://www.clickys.in/api/og?title=${encodeURIComponent(title)}&category=${encodeURIComponent("What's New")}&image=${encodeURIComponent(ogImage)}`, 
        width: 1200, 
        height: 630, 
        alt: title 
      }] : [{
        url: `https://www.clickys.in/api/og?title=${encodeURIComponent(title)}&category=${encodeURIComponent("What's New")}`,
        width: 1200,
        height: 630,
        alt: title
      }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ogImage ? [`https://www.clickys.in/api/og?title=${encodeURIComponent(title)}&category=${encodeURIComponent("What's New")}&image=${encodeURIComponent(ogImage)}`] : [],
    }
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
          <Suspense fallback={<div>Loading section...</div>}>
            <SliceZone 
              slices={page.data.slices} 
              components={components} 
              context={{ galleryImages: shoppingGridImages }}
            />
          </Suspense>
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
