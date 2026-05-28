import { amazonClient } from './amazon-client';
import { normalizeAmazonProduct } from './normalize-product';
import { amazonConfig } from './config';
import { AmazonNormalizedProduct } from './types';

export async function searchAmazonProducts(query: string, itemCount: number = 8): Promise<AmazonNormalizedProduct[]> {
  try {
    if (!amazonConfig.credentialId || !amazonConfig.credentialSecret) {
      console.warn('Amazon credentials missing, returning empty array.');
      return [];
    }

    const rawResponse = await amazonClient.callApi('/catalog/v1/searchItems', {
      partnerTag: amazonConfig.partnerTag,
      keywords: query,
      searchIndex: 'All',
      itemCount,
      resources: [
        'images.primary.medium',
        'images.primary.large',
        'itemInfo.title',
        'itemInfo.features',
        'offersV2.listings.price',
        'offersV2.listings.availability',
        'offersV2.listings.condition',
        'customerReviews.count',
        'customerReviews.starRating'
      ],
    });
    
    if (!rawResponse) {
      return [];
    }

    const items = rawResponse?.searchResult?.items || [];
    
    return items
      .map((item: any) => normalizeAmazonProduct(item))
      .filter((p: AmazonNormalizedProduct | null) => p !== null) as AmazonNormalizedProduct[];

  } catch (error) {
    console.error('Amazon API Search Failed:', error);
    return []; // Failsafe: return empty array so UI doesn't crash
  }
}
