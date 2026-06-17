import { Suspense } from 'react';
import { createClient } from "../../prismicio";
import WhatsNewGrid from './WhatsNewGrid';

export const metadata = {
  title: "What's New | Clickys product discovery",
  description: "Explore our latest affiliate guides, tech reviews, and amazing deals.",
};

export default async function WhatsNewListingPage() {
  const client = createClient();
  let pages = [];
  try {
    pages = await client.getAllByType("whatsnew", {
      orderings: [
        { field: "document.first_publication_date", direction: "desc" },
      ],
    });
  } catch (error) {
    console.warn("whatsnew type might not exist yet in Prismic:", error.message);
  }

  return (
    <>
      <div className="bg-[#f8f9fa] min-h-screen pb-24 pt-12">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <header className="mb-20 text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight">
              What's <span className="text-green-600">New</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              Curated finds, trending tech drops, and fresh ideas delivered exclusively for you.
            </p>
          </header>

          <Suspense fallback={<div className="h-96 flex items-center justify-center text-gray-400">Loading new content...</div>}>
            <WhatsNewGrid pages={pages} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
