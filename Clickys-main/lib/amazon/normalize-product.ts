import { AmazonNormalizedProduct } from './types';

export function normalizeAmazonProduct(item: any): AmazonNormalizedProduct | null {
  try {
    if (!item || !item.asin) return null;

    const title = item.itemInfo?.title?.displayValue || 'Unknown Product';
    
    // Safely get image, fallback if missing
    let image = '';
    if (item.images?.primary?.medium?.url) {
      image = item.images.primary.medium.url;
    } else if (item.images?.primary?.large?.url) {
      image = item.images.primary.large.url;
    } else if (item.images?.primary?.small?.url) {
      image = item.images.primary.small.url;
    } else {
       image = 'https://m.media-amazon.com/images/I/71cBDSM-UdL._AC_UL640_FMwebp_QL65_.jpg'; // Fallback
    }

    const price = item.offersV2?.listings?.[0]?.price?.pricePerUnit?.amount || 
                  item.offersV2?.listings?.[0]?.price?.amount || // sometimes at top level depending on API response
                  0;
    
    const rating = item.customerReviews?.starRating?.value || 0;
    const reviewCount = item.customerReviews?.count || 0;
    const affiliateLink = item.detailPageURL || '#';
    
    // Extract availability
    const availability = item.offersV2?.listings?.[0]?.availability?.message || '';

    return {
      id: item.asin,
      name: title,
      imageUrl: image,
      price: price ? `₹${price}` : 'Check Price on Amazon', // formatting to match Price string expectation
      rating,
      reviewCount,
      amazonLink: affiliateLink,
      category: 'Amazon API', 
      platform: 'Amazon',
      source: 'API',
      discount: false,
      availabilityStatus: availability,
    };
  } catch (error) {
    console.error('Error normalizing Amazon product:', error);
    return null;
  }
}
