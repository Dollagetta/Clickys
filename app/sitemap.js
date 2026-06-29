import { fetchGuidesFromSheet } from '../lib/guides';
import { createClient } from '../prismicio';

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

  // Fetch Prismic Documents
  let prismicPaths = [];
  try {
    const client = createClient();
    const [products, whatsnews, sliceguides, partners] = await Promise.all([
      client.getAllByType('product'),
      client.getAllByType('whatsnew'),
      client.getAllByType('sliceguide1'),
      client.getAllByType('partner'),
    ]);

    const productPaths = products.map(p => ({
      url: `${baseUrl}/products/${p.uid}`,
      lastModified: p.last_publication_date,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    const wnPaths = whatsnews.map(p => ({
      url: `${baseUrl}/whats-new/${p.uid}`,
      lastModified: p.last_publication_date,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    const sgPaths = sliceguides.map(p => ({
      url: `${baseUrl}/guide/${p.uid}`,
      lastModified: p.last_publication_date,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    const pPaths = partners.map(p => ({
      url: `${baseUrl}/partners/${p.uid}`,
      lastModified: p.last_publication_date,
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

    prismicPaths = [...productPaths, ...wnPaths, ...sgPaths, ...pPaths];
  } catch (err) {
    console.error('Prismic sitemap fetch failed', err);
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // ... rest of the static pages ...
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
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tracker`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gifts`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/affiliate`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/partners`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/daily-deals`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/whats-new`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/wishlist`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...guidePaths,
    ...prismicPaths,
  ];
}
