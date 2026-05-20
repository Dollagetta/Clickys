/** @type {import('next-sitemap').IConfig} */
// import products from './components/products';
// import allGuides from './components/guides';

module.exports = {
  siteUrl: process.env.SITE_URL || 'https://clickys.in',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  autoLastmod: true,
  trailingSlash: false,

  additionalPaths: async (config) => {
    let prismicDocs = [];
    try {
      const { createClient } = await import('@prismicio/client');
      const sm = await import('./slicemachine.config.json', { with: { type: 'json' } });
      const client = createClient(sm.default.repositoryName);
      
      // Fetch multiple types of documents
      const [guides, products] = await Promise.all([
        client.getAllByType("guide"),
        client.getAllByType("product")
      ]);
      
      prismicDocs = [...guides, ...products];
    } catch (e) {
      console.error('Error fetching from Prismic for sitemap:', e);
    }

    const paths = [];
    prismicDocs.forEach(doc => {
      let routePrefix = '';
      if (doc.type === 'guide') {
        routePrefix = '/guides';
      } else if (doc.type === 'product') {
        routePrefix = '/products';
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
