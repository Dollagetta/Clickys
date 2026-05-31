import { fetchGuidesFromSheet } from '../lib/guides';

export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const baseUrl = process.env.SITE_URL || 'https://www.clickys.in';

  let googleGuides = [];
  try {
    googleGuides = await fetchGuidesFromSheet(false);
  } catch (e) {
    console.error('Error fetching Guides for sitemap:', e);
  }

  const guidePaths = googleGuides.map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/deals`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...guidePaths,
  ];
}
