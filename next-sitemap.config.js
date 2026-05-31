/** @type {import('next-sitemap').IConfig} */
// import products from './components/products';
// import allGuides from './components/guides';

export default {
  siteUrl: process.env.SITE_URL || 'https://clickys.in',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  autoLastmod: true,
  trailingSlash: false,

  additionalPaths: async (config) => {
    let prismicDocs = [];
    let googleGuides = [];

    // 1. Fetch from Google Sheets for Guides
    /* try {
      const { fetchGuidesFromSheet } = await import('./lib/guides.ts');
      googleGuides = await fetchGuidesFromSheet(false);
    } catch (e) {
      console.error('Error fetching from Google Sheets for sitemap:', e);
    } */

    // 2. Fetch from Prismic for other documents
    try {
      const { createClient } = await import('@prismicio/client');
      const sm = await import('./slicemachine.config.json', { with: { type: 'json' } });
      const client = createClient(sm.default.repositoryName);
      
      const results = await Promise.allSettled([
        client.getAllByType("product"),
        client.getAllByType("whatsnew"),
        client.getAllByType("deal"),
        client.getAllByType("partner")
      ]);
      
      prismicDocs = results
        .filter(result => result.status === 'fulfilled')
        .flatMap(result => result.value);
    } catch (e) {
      console.error('Error fetching from Prismic for sitemap:', e);
    }

    const paths = [];

    // Add Google Guides to paths
    googleGuides.forEach(guide => {
      paths.push({
        loc: `/guides/${guide.slug}`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.8,
      });
    });

    // Add Prismic Docs to paths
    prismicDocs.forEach(doc => {
      let routePrefix = '';
      if (doc.type === 'product') {
        routePrefix = '/products';
      } else if (doc.type === 'whatsnew') {
        routePrefix = '/whats-new';
      } else if (doc.type === 'deal') {
        routePrefix = '/deals';
      } else if (doc.type === 'partner') {
        routePrefix = '/partners';
      } else {
        return;
      }
      
      const slug = doc.uid || doc.data?.title?.toLowerCase().replace(/\s+/g, '-');
      if (slug) {
        paths.push({
          loc: `${routePrefix}/${slug}`,
          lastmod: doc.last_publication_date,
          changefreq: doc.type === 'product' ? 'daily' : 'monthly',
          priority: doc.type === 'product' ? 0.9 : 0.8,
        });
      }
    });
    return paths;
  }   
};
