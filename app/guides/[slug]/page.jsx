import { getGuideBySlug } from '../../../lib/guides';
import { notFound } from 'next/navigation';
import { PrismicRichText } from '@prismicio/react';

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{guide.title}</h1>
      <div className="prose">
        {Array.isArray(guide.description) ? (
          <PrismicRichText field={guide.description} />
        ) : (
          <p>{guide.description}</p>
        )}
      </div>
    </div>
  );
}
