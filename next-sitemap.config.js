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
    let guidesResponse = [];
    try {
      const { createClient } = await import('@prismicio/client');
      const sm = await import('./slicemachine.config.json', { with: { type: 'json' } });
      const client = createClient(sm.default.repositoryName);
      guidesResponse = await client.getAllByType("guide", {
        orderings: {
          field: 'my.guide.date',
          direction: 'desc'
        },
        fetch: [
          'guide.title',
          'guide.image',
          'guide.author',
          'guide.date',
          'guide.guide'
        ]
      });
    } catch (e) {}

    const paths = [];
    guidesResponse.forEach(guide => {
      paths.push({
        loc: `/guides/${guide.uid}`,
        lastmod: guide.last_publication_date,
        changefreq: 'monthly',
        priority: 0.8,
      });
    });
    return paths;
  }   
};
