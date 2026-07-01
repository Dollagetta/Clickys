/** @type {import('next-sitemap').IConfig} */

// Helper to fetch guides from Google Sheets using standard ESM JS
async function fetchGuidesFromSheet() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  let sheetId = process.env.GUIDE_SHEET_ID || process.env.PRODUCT_SHEET_ID;
  
  if (sheetId && sheetId.includes('docs.google.com/spreadsheets/d/')) {
    const match = sheetId.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match) {
      sheetId = match[1];
    }
  }

  if (!clientEmail || !privateKey || !sheetId) {
    console.warn('[Sitemap] Missing Google Auth credentials or Sheet ID for Google Sheets guides.');
    return [];
  }

  try {
    const { GoogleAuth } = await import('google-auth-library');
    const auth = new GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const accessTokenObject = await auth.getAccessToken();
    const accessToken = typeof accessTokenObject === 'string' ? accessTokenObject : accessTokenObject.token;

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A:H`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      console.error(`[Sitemap] Google Sheets API Error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    const rows = data.values;
    if (!rows || rows.length <= 1) return [];

    const slugify = (text) => {
      if (!text) return '';
      return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
    };

    let dataRows = (rows[0] && rows[0][0] === 'Title') ? rows.slice(1) : rows;
    dataRows = dataRows.filter((row) => row && row[0]);
    dataRows.reverse();

    const seenSlugs = new Set();
    const guides = [];

    dataRows.forEach((row) => {
      const baseSlug = slugify(row[0] || '');
      let slug = baseSlug;
      let counter = 1;
      while (seenSlugs.has(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      seenSlugs.add(slug);

      guides.push({
        slug,
        title: row[0] || '',
      });
    });

    return guides;
  } catch (error) {
    console.error('[Sitemap] Error fetching Google guides:', error);
    return [];
  }
}

// Get and normalize the site URL so it always has the correct https:// protocol.
let siteUrl = process.env.SITE_URL || 'https://clickys.in';
if (siteUrl && !siteUrl.startsWith('http://') && !siteUrl.startsWith('https://')) {
  siteUrl = 'https://' + siteUrl;
}

export default {
  siteUrl,
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  autoLastmod: true,
  trailingSlash: false,

  additionalPaths: async (config) => {
    let prismicDocs = [];
    let googleGuides = [];

    // 1. Fetch Google Guides
    try {
      googleGuides = await fetchGuidesFromSheet();
    } catch (e) {
      console.error('[Sitemap] Failed to fetch Google Guides:', e);
    }

    // 2. Fetch Prismic documents
    try {
      const { createClient } = await import('@prismicio/client');
      const sm = await import('./slicemachine.config.json', { with: { type: 'json' } });
      const client = createClient(sm.default.repositoryName);
      
      const results = await Promise.allSettled([
        client.getAllByType("product"),
        client.getAllByType("whatsnew"),
        client.getAllByType("sliceguide1"),
        client.getAllByType("partner")
      ]);
      
      prismicDocs = results
        .filter(result => result.status === 'fulfilled')
        .flatMap(result => result.value);
    } catch (e) {
      console.error('[Sitemap] Error fetching from Prismic for sitemap:', e);
    }

    const paths = [];

    // Explicitly add the root homepage path with the highest priority!
    paths.push({
      loc: '/',
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1.0,
    });

    // Make sure all static page hub routes are present and explicitly added with prime priority
    const extraHubs = [
      '/about',
      '/affiliate',
      '/compare',
      '/contact',
      '/daily-deals',
      '/deals',
      '/gifts',
      '/guides',
      '/mobile-app',
      '/partners',
      '/privacy-policy',
      '/products',
      '/tracker',
      '/whats-new',
      '/wishlist',
    ];

    extraHubs.forEach(hub => {
      paths.push({
        loc: hub,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 0.9,
      });
    });

    // Add Google Guides to sitemap paths
    googleGuides.forEach(guide => {
      paths.push({
        loc: `/guides/${guide.slug}`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.8,
      });
    });

    // Add Prismic Docs to sitemap paths
    prismicDocs.forEach(doc => {
      let routePrefix = '';
      if (doc.type === 'product') {
        routePrefix = '/products';
      } else if (doc.type === 'whatsnew') {
        routePrefix = '/whats-new';
      } else if (doc.type === 'sliceguide1') {
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
          lastmod: doc.last_publication_date ? new Date(doc.last_publication_date).toISOString() : new Date().toISOString(),
          changefreq: doc.type === 'product' ? 'daily' : 'monthly',
          priority: doc.type === 'product' ? 0.9 : 0.8,
        });
      }
    });

    return paths;
  }   
};
