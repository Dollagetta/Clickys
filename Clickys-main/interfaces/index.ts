export interface Product {
    id: string;
    slug: string;
    name: string;
    category: string;
    price: number;
    oldPrice: number;
    imageUrl: string;
    galleryImages: string[];
    amazonLink: string;
    rating: number;
    reviewCount: number;
    onPromotion: boolean;
    shortDescription: string;
    longDescription: string;
    features: string[];
    specs: { [key: string]: string };
    relatedProductSlugs: string[];
    isDeal: boolean;
}