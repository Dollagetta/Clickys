import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import { createClient } from "../../prismicio";
import { components } from "../../slices";
import { Suspense } from "react";

export default async function Page({ params }) {
  const { uid } = await params;
  const client = createClient();
  const page = await client.getByUID("pinterestgrid", uid).catch(() => notFound());

  return (
    <main className="min-h-screen pt-20">
      {page.data.heading && (
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4">
                {page.data.heading}
            </h1>
            <div className="h-1.5 w-24 bg-orange-500 mx-auto rounded-full" />
        </div>
      )}
      <Suspense fallback={<div className="container mx-auto py-20 text-center text-gray-500">Loading contents...</div>}>
        <SliceZone slices={page.data.slices} components={components} />
      </Suspense>
    </main>
  );
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType("pinterestgrid");

  return pages.map((page) => {
    return { uid: page.uid };
  });
}
