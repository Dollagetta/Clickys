import { GoogleAuth } from 'google-auth-library';
import { unstable_cache } from 'next/cache';
import { createClient } from '../prismicio';

function slugify(text) {
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
}

async function _fetchGuidesFromPrismic() {
  try {
    const client = createClient();
    console.log('[Guides] Fetching from Prismic...');
    const [guides, products, sliceGuides] = await Promise.all([
      client.getAllByType('guide', {
        orderings: {
          field: 'document.first_publication_date',
          direction: 'desc',
        },
      }).catch(() => []),
      client.getAllByType('product', {
        orderings: {
          field: 'document.first_publication_date',
          direction: 'desc',
        },
      }).catch(() => []),
      client.getAllByType('sliceguide1', {
        orderings: {
          field: 'document.first_publication_date',
          direction: 'desc',
        },
      }).catch(() => [])
    ]);

    console.log(`[Guides] Prismic counts - Guides: ${guides.length}, Products: ${products.length}, SliceGuides: ${sliceGuides.length}`);

    const prismicGuides = [...guides, ...products, ...sliceGuides].map((doc) => {
      // For sliceguide1, we might need to extract data from slices
      const firstGuideSlice = doc.data.slices?.find(s => s.slice_type === 'guide');
      
      return {
        isPrismic: true,
        id: doc.id,
        uid: doc.uid,
        title: doc.data.title || doc.data.name || firstGuideSlice?.primary?.title || '',
        price: doc.data.price || sliceGuidePrice(doc) || '',
        discount: doc.data.discount || '',
        platform: doc.data.platform || '',
        category: doc.data.category || '',
        link: doc.data.link?.url || firstGuideSlice?.primary?.link?.url || '',
        image: doc.data.image?.url || doc.data.hero_image?.url || firstGuideSlice?.primary?.image?.url || '',
        description: doc.data.description || firstGuideSlice?.primary?.description || [],
        pros: doc.data.pros || [],
        cons: doc.data.cons || [],
        features: doc.data.features || [],
        alternatives: doc.data.alternatives || [],
        faq: doc.data.faq || [],
        slug: doc.uid, // Use UID as slug
      };
    });
    
    return prismicGuides;
  } catch (error) {
    console.error('[Guides] Error fetching from Prismic:', error);
    return [];
  }
}

function sliceGuidePrice(doc) {
  const guideSlice = doc.data.slices?.find(s => s.slice_type === 'guide');
  return guideSlice?.primary?.price || '';
}

async function _fetchGuidesFromSheet(fullRange = true) {
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
    console.warn('[Guides] Missing Google Auth environment variables or Sheet ID.');
    return [];
  }

  // Global timeout for the entire operation to prevent "eternal loading"
  const fetchPromise = (async () => {
    try {
      console.log('[Guides] Starting fetch operation...');
      const auth = new GoogleAuth({
        credentials: {
          client_email: clientEmail,
          private_key: privateKey.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      });

      const accessTokenObject: any = await auth.getAccessToken();
      console.log('[Guides] Got access token');
      const accessToken = typeof accessTokenObject === 'string' ? accessTokenObject : accessTokenObject.token;

      const range = fullRange ? 'A:L' : 'A:H'; 
      console.log(`[Guides] Fetching range: ${range}`);
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        }
      );

      console.log(`[Guides] Response: ${response.status}`);
      if (!response.ok) {
          console.error(`[Guides] Google Sheets API Error: ${response.status} ${response.statusText}`);
          return [];
      }

      const data = await response.json();
      console.log(`[Guides] Fetched ${data.values?.length || 0} rows`);
      return processRows(data.values, fullRange);
    } catch (error) {
      console.error('[Guides] Error fetching guides:', error);
      return [];
    }
  })();

  let timeoutId;
  const timeoutPromise = new Promise((resolve) => {
    timeoutId = setTimeout(() => {
      console.warn('[Guides] Fetch operation timed out after 12s');
      resolve([]);
    }, 12000);
  });

  return Promise.race([fetchPromise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
}

let _guidesCacheFull: any[] | null = null;
let _guidesCacheFullTime = 0;
let _guidesCacheMinimal: any[] | null = null;
let _guidesCacheMinimalTime = 0;

/**
 * Fetches guides from the Google Sheet and Prismic.
 * @param {boolean} fullRange Whether to fetch the full range (A:L) or just the minimal range (A:H) for listings.
 */
export const fetchGuidesFromSheet = async (fullRange = true) => {
  if (fullRange) {
    if (_guidesCacheFull && (Date.now() - _guidesCacheFullTime < 3600000)) return _guidesCacheFull;
    const [sheetGuides, prismicGuides] = await Promise.all([
      _fetchGuidesFromSheet(true),
      _fetchGuidesFromPrismic()
    ]);
    const guides = [...prismicGuides, ...sheetGuides]; // Combine both
    _guidesCacheFull = guides;
    _guidesCacheFullTime = Date.now();
    return guides;
  } else {
    if (_guidesCacheMinimal && (Date.now() - _guidesCacheMinimalTime < 3600000)) return _guidesCacheMinimal;
    const [sheetGuides, prismicGuides] = await Promise.all([
      _fetchGuidesFromSheet(false),
      _fetchGuidesFromPrismic()
    ]);
    const guides = [...prismicGuides, ...sheetGuides];
    _guidesCacheMinimal = guides;
    _guidesCacheMinimalTime = Date.now();
    return guides;
  }
};

function processRows(rows: any[], fullRange: boolean) {
  if (!rows || rows.length <= 1) return [];
  
  // Filter out header row if it contains 'Title'
  let dataRows = (rows[0] && rows[0][0] === 'Title') ? rows.slice(1) : rows;
  dataRows = dataRows.filter((row: any[]) => row && row[0]);
  dataRows.reverse();

  const seenSlugs = new Set();

  return dataRows
    .map((row: any[]) => {
      const baseSlug = slugify(row[0] || '');
      let slug = baseSlug;
      let counter = 1;
      
      while (seenSlugs.has(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      seenSlugs.add(slug);

      return {
        isPrismic: false,
        title: row[0] || '',
        price: row[1] || '',
        link: row[2] || '',
        image: row[3] || '',
        category: row[4] || '',
        discount: row[5] || '',
        platform: row[6] || '',
        description: row[7] || '',
        features: fullRange ? (row[8] || '') : '',
        pros: fullRange ? (row[9] || '') : '',
        cons: fullRange ? (row[10] || '') : '',
        alternatives: fullRange ? (row[11] || '') : '',
        faq: '', // Empty for sheets
        slug: slug
      };
    });
}

export async function getGuideBySlug(slug) {
  const guides = await fetchGuidesFromSheet(true);
  return guides.find((g: any) => g.slug === slug);
}

