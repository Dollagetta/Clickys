export interface AmazonNormalizedProduct {
  id: string;
  name: string;
  imageUrl: string;
  price: string;
  rating: number;
  reviewCount: number;
  amazonLink: string;
  category: string;
  platform: 'Amazon';
  source: 'API' | 'Prismic';
  discount: boolean;
  featuredFind?: boolean;
  promotionalStatus?: string;
  availabilityStatus?: string;
}
