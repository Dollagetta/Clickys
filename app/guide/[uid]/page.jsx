import { createClient } from "../../../prismicio";
import { SliceZone, PrismicRichText } from "@prismicio/react";
import { components } from "../../../slices";
import Link from "next/link";
import { Suspense } from "react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";

export async function generateMetadata({ params }) {
  const { uid } = await params;
  const client = createClient();
  const guide = await client.getByUID("sliceguide1", uid).catch(() => null);

  if (!guide) {
    return {
      title: "Guide Not Found",
    };
  }

  // Assuming the first Guide slice has the primary title
  const firstGuideSlice = guide.data.slices.find(s => s.slice_type === 'guide');
  const title = firstGuideSlice?.primary?.title || "Buying Guide";
  // Extract a description (first snippet of rich text)
  const descriptionText = firstGuideSlice?.primary?.description?.[0]?.text || "Check out our latest buying guide, tips, and recommendations on Clickys.";
  const rawImageUrl = firstGuideSlice?.primary?.image?.url || "https://www.clickys.in/images/clickysbg.png"; // fallback image

  const absoluteImageUrl = rawImageUrl.startsWith('http') ? rawImageUrl : `https://www.clickys.in${rawImageUrl}`;

  return {
    title: `${title} | Clickys`,
    description: descriptionText,
    openGraph: {
      title: `${title} | Clickys`,
      description: descriptionText,
      url: `https://www.clickys.in/guide/${uid}`,
      siteName: 'Clickys',
      images: [
        {
          url: `https://www.clickys.in/api/og?title=${encodeURIComponent(title)}&category=${encodeURIComponent("Guide")}&image=${encodeURIComponent(absoluteImageUrl)}`,
          width: 1200,
          height: 630,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Clickys`,
      description: descriptionText,
      images: [`https://www.clickys.in/api/og?title=${encodeURIComponent(title)}&category=${encodeURIComponent("Guide")}&image=${encodeURIComponent(absoluteImageUrl)}`],
    },
  };
}

export default async function GuidePage({ params }) {
  const { uid } = await params;
  const client = createClient();
  const guide = await client.getByUID("sliceguide1", uid).catch(() => null);

  if (!guide) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Guide Not Found</h1>
        <Link href="/deals" className="text-blue-600 hover:underline">
          Return to Deals
        </Link>
      </div>
    );
  }

  // Render the whole document. Usually, documents are built with slices.
  // However, for Guide documents we could render them fully based on their slices.
  // We can pass down the full guide content if we have a Custom Slice for full page viewing,
  // but if the user just created the Guide with slices that are currently formatting as cards,
  // we might want to render them differently when viewed on their dedicated page.
  // Wait, the "Guide" slice renders as a CARD component currently in `slices/Guide/index.jsx`!
  // If we render `<SliceZone slices={guide.data.slices} components={components} />` here,
  // it will render the same Card. We probably want it to look like an ARTICLE.
  // Let's create a custom representation here inline, bypassing the slice zone if it only has "Guide" slices,
  // OR we can pass a special context or provide custom components for this specific page.

  return (
    <main className="container mx-auto py-12 px-4 max-w-4xl min-h-screen">
      <Link href="/deals" className="inline-flex items-center text-orange-600 hover:text-orange-800 font-bold mb-10 group bg-orange-50 px-4 py-2 rounded-full transition-all duration-300">
        <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Deals
      </Link>
      
      {guide.data.slices.map((slice, i) => {
        if (slice.slice_type === 'guide') {
          return (
            <article key={i} className="mb-20 bg-white rounded-[2.5rem] p-6 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <header className="mb-10 text-center md:text-left">
                {slice.primary.title && (
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6">
                    {slice.primary.title}
                  </h1>
                )}
                {slice.primary.date && (
                  <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-500 font-medium">
                    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{slice.primary.date}</span>
                  </div>
                )}
              </header>

              {slice.primary.image && (
                <div className="relative w-full h-[400px] md:h-[550px] rounded-[2rem] overflow-hidden mb-14 shadow-2xl ring-1 ring-black/5 group flex justify-center bg-gray-50">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                  <PrismicNextImage
                    field={slice.primary.image}
                    fill
                    className="object-contain transition-transform duration-700 group-hover:scale-105"
                    fallbackAlt=""
                  />
                </div>
              )}

              <div className="mt-8 max-w-[85ch] mx-auto">
                <PrismicRichText 
                  field={slice.primary.description} 
                  components={{
                    image: ({ node, key }) => (
                      <figure key={key} className="my-12 group relative overflow-hidden rounded-[1.5rem] shadow-lg transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.2)] hover:-translate-y-2 border border-gray-100 ring-1 ring-black/5 mx-auto max-w-2xl bg-gray-50">
                        <img
                          src={node.url}
                          alt={node.alt || ""}
                          className="w-full h-auto max-h-[400px] object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                        {node.alt && (
                          <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-white/20 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                            <figcaption className="text-center text-sm text-gray-700 font-medium">
                              {node.alt}
                            </figcaption>
                          </div>
                        )}
                      </figure>
                    ),
                    paragraph: ({ children, key }) => (
                      <p key={key} className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 font-medium">
                        {children}
                      </p>
                    ),
                    heading1: ({ children, key }) => (
                      <h1 key={key} className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 mt-16 tracking-tight">
                        {children}
                      </h1>
                    ),
                    heading2: ({ children, key }) => (
                      <h2 key={key} className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 mt-14 tracking-tight">
                        {children}
                      </h2>
                    ),
                    heading3: ({ children, key }) => (
                      <h3 key={key} className="text-xl md:text-2xl font-bold text-gray-900 mb-4 mt-10 tracking-tight">
                        {children}
                      </h3>
                    ),
                    list: ({ children, key }) => (
                      <ul key={key} className="list-none space-y-4 mb-10 pl-0">
                        {children}
                      </ul>
                    ),
                    listItem: ({ children, key }) => (
                      <li key={key} className="flex items-start text-lg text-gray-600">
                        <span className="flex-shrink-0 h-6 w-6 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mr-4 mt-1 shadow-sm">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        <span className="leading-relaxed font-medium">{children}</span>
                      </li>
                    ),
                    embed: ({ node, key }) => (
                      <div key={key} data-oembed={node.oembed.embed_url} className="w-full my-12 aspect-video rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 ring-1 ring-black/5 group transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
                        dangerouslySetInnerHTML={{ __html: node.oembed.html }}
                      />
                    ),
                    hyperlink: ({ children, node, key }) => (
                      <a key={key} href={node.data.url} target={node.data.target} className="text-orange-600 font-bold hover:text-orange-700 hover:underline decoration-orange-300 decoration-2 underline-offset-4 transition-all duration-300">
                        {children}
                      </a>
                    ),
                    strong: ({ children, key }) => (
                      <strong key={key} className="font-extrabold text-gray-900 bg-orange-50/50 px-1 rounded">
                        {children}
                      </strong>
                    )
                  }}
                />
              </div>

              {slice.primary.link && (
                <div className="mt-16 text-center">
                  <PrismicNextLink
                    field={slice.primary.link}
                    className="inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-white transition-all duration-500 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full shadow-[0_10px_20px_-10px_rgba(249,115,22,0.5)] hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.6)] hover:-translate-y-1 hover:scale-105"
                  >
                    Buy Now
                    <svg
                      className="w-6 h-6 ml-3 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      ></path>
                    </svg>
                  </PrismicNextLink>
                </div>
              )}
            </article>
          );
        }
        
        // If it's a different slice type, we can render it using the SliceZone
        return (
          <Suspense key={i} fallback={<div>Loading...</div>}>
            <SliceZone slices={[slice]} components={components} />
          </Suspense>
        );
      })}
    </main>
  );
}
