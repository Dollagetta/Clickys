import { createClient } from "../prismicio";
import AffiliateCardsClient from "./AffiliateCardsClient";

export default async function AffiliateCards() {
  const client = createClient();
  let affiliates = [];
  
  try {
    const affiliatesResponse = await client.getAllByType("affiliate", {
      orderings: [{ field: 'document.first_publication_date', direction: 'desc' }]
    });
    
    affiliates = affiliatesResponse.map(doc => ({
      id: doc.id,
      name: doc.data.site_name,
      slug: doc.uid,
      logo: doc.data.logo,
      color: doc.data.brand_colour || '#000000',
      url: doc.data.affiliate_link?.url || null,
    }));
  } catch (err) {
    console.error('Failed to load affiliates', err);
    return null;
  }

  if (affiliates.length === 0) return null;

  return <AffiliateCardsClient affiliates={affiliates} />;
}
