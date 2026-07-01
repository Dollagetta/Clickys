import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import { createClient } from "../../prismicio";
import { components } from "../../slices";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ChevronLeft } from "lucide-react";

export default async function Page({ params }) {
  const { uid } = await params;
  const client = createClient();
  let page;
  try {
    page = await client.getByUID("pinterestgrid", uid);
  } catch (e) {
    page = await client.getByID(uid).catch(() => notFound());
  }

  const data = page.data || {};
  
  // Extract text fields helper
  const getAsString = (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    if (Array.isArray(field)) {
      try {
        return field.map(node => node.text || '').join(' ');
      } catch (e) {
        return '';
      }
    }
    return '';
  };

  const heading = getAsString(data.heading) || 'Curated Product';
  const description = getAsString(data.description) || '';
  const platform = getAsString(data.platform) || 'Clickys';
  const affiliateUrl = data.affiliate_link?.url || (typeof data.affiliate_link === 'string' ? data.affiliate_link : '#');
  const imageUrl = data.product_image?.url || '';
  const videoUrl = data.video?.url || (typeof data.video === 'string' ? data.video : '');
  const isVideo = Boolean(data.is_video);

  const cleanPlatform = platform.toLowerCase().startsWith('via') ? platform.replace(/via\s+/i, '') : platform;

  return (
    <main className="min-h-screen bg-gray-50/50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back navigation thread */}
        <Link 
          href="/#inspiration-grid" 
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-orange-600 transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Inspiration
        </Link>

        {/* Hero showcase board */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-0 md:min-h-[550px]">
          
          {/* Showcase visual bay */}
          <div className="md:col-span-6 bg-gray-100 flex items-center justify-center relative min-h-[350px] md:min-h-full">
            {isVideo && videoUrl ? (
              <video 
                src={videoUrl}
                className="w-full h-full object-cover min-h-[350px] md:absolute md:inset-0"
                autoPlay
                muted
                loop
                playsInline
                controls
              />
            ) : imageUrl ? (
              <div className="relative w-full h-full min-h-[350px] md:absolute md:inset-0">
                <Image 
                  src={imageUrl} 
                  alt={heading}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  referrerPolicy="no-referrer"
                  priority
                />
              </div>
            ) : (
              <div className="p-12 text-center text-gray-400 font-mono text-sm leading-6">
                No visual media preview available.
              </div>
            )}
            
            {/* Platform floating badge */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full shadow-sm text-xs font-black text-gray-900 uppercase tracking-widest border border-gray-200/50">
              {cleanPlatform}
            </div>
          </div>

          {/* Core content side */}
          <div className="md:col-span-6 p-8 md:p-12 md:p-16 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="h-1.5 w-1.5 bg-orange-600 rounded-full animate-ping" />
                <span className="text-[10px] uppercase tracking-[0.25em] font-black text-orange-600">Curator Choice</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-6 tracking-tight">
                {heading}
              </h1>

              <div className="prose prose-orange max-w-none text-gray-600 leading-relaxed text-base">
                <p className="whitespace-pre-wrap">{description || "No review content provided for this curated recommendation yet."}</p>
              </div>

              <div className="mt-8 p-4 bg-orange-50/70 border border-orange-100/50 rounded-2xl">
                <p className="text-xs text-orange-850 font-semibold italic">
                  "Each curated choice represents handpicked value. By using my exclusive link, you support detailed on-the-ground research for amazing lifestyle tech."
                </p>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-100">
              <a 
                href={affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-black py-4 px-8 rounded-2xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                Buy Now from {cleanPlatform} <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* SliceZone for additional subelements */}
        {page.data?.slices && (
          <div className="mt-16 pt-16 border-t border-gray-200/60">
            <Suspense fallback={<div className="container mx-auto py-10 text-center text-gray-400">Loading details...</div>}>
              <SliceZone slices={page.data.slices} components={components} />
            </Suspense>
          </div>
        )}

      </div>
    </main>
  );
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType("pinterestgrid").catch(() => []);

  return pages.map((page) => {
    return { uid: page.uid };
  });
}
