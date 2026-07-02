import { createClient } from "../../../prismicio";
import { notFound } from "next/navigation";
import AffiliateProductsPage from "./AffiliateProductsPage";
import { products as localProducts } from "../../../components/products.js";
import { products as flipkartProducts } from "../../../components/flipkartProducts.js";
import { fetchAllProducts } from "../../../lib/products";

export const revalidate = 3600;

// ==============================
// SEO METADATA
// ==============================
export async function generateMetadata({ params }) {
  const { slug } = await params;

  const client = createClient();

  const affiliate = await client
    .getByUID("affiliate", slug)
    .catch(() => null);

  if (!affiliate) {
    return {
      title: "Affiliate Not Found | Clickys",
    };
  }

  const siteName =
    affiliate?.data?.site_name || "Affiliate Store";
    
  const title = `${siteName} Products & Deals | Clickys.in`;
  const description = affiliate?.data?.description?.[0]?.text || `Explore curated products, trending deals, and top recommendations from ${siteName} on Clickys.in.`;
  const rawOgImage = affiliate?.data?.logo?.url || 'https://www.clickys.in/images/logosvg.svg';

  const absoluteOgImage = rawOgImage.startsWith('http') ? rawOgImage : `https://www.clickys.in${rawOgImage}`;

  const ogImage = `https://www.clickys.in/api/og?title=${encodeURIComponent(siteName + " Deals")}&category=${encodeURIComponent("Store")}&image=${encodeURIComponent(absoluteOgImage)}`;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: `https://www.clickys.in/affiliate/${slug}`,
      siteName: "Clickys.in",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [ogImage],
    }
  };
}

// ==============================
// MAIN PAGE
// ==============================
export default async function AffiliatePage({ params }) {
  const { slug } = await params;

  const client = createClient();

  // =====================================
  // FETCH AFFILIATE
  // =====================================
  const affiliate = await client
    .getByUID("affiliate", slug)
    .catch(() => null);

  if (!affiliate) {
    notFound();
  }

  const affiliateName = affiliate?.data?.site_name?.toLowerCase() || "";
  const affiliateSlug = affiliate?.uid?.toLowerCase() || "";

  // =====================================
  // FETCH ALL PRODUCTS (Sheet + Prismic + local)
  // =====================================
  const allProducts = await fetchAllProducts().catch(() => []);
  
  const mappedProducts = allProducts
    .filter((p) => {
      const platform = (p.platform || "").toLowerCase();
      const link = (p.link || p.amazonLink || "").toLowerCase();
      const cat = (p.category || "").toLowerCase();
      
      return platform === affiliateName || 
             platform === affiliateSlug ||
             link.includes(affiliateSlug) ||
             link.includes(affiliateName) ||
             (affiliateSlug === 'amazon' && (link.includes('amazon') || link.includes('amzn'))) ||
             (affiliateSlug === 'flipkart' && (link.includes('flipkart') || link.includes('fktr.in'))) ||
             (affiliateSlug === 'myntra' && link.includes('myntra')) ||
             (affiliateSlug === 'meesho' && link.includes('meesho')) ||
             (affiliateSlug === 'ajio' && link.includes('ajio'));
    })
    .map((p, idx) => ({
      id: p.id || `prod-${idx}`,
      name: p.title || p.name,
      price: String(p.price).startsWith('₹') ? p.price : `₹${p.price}`,
      oldPrice: p.oldPrice,
      savings: p.savings,
      category: p.category || "Deals",
      platform: affiliate?.data?.site_name || "Affiliate",
      imageUrl: p.image || p.imageUrl,
      description: p.description || p.title || p.name,
      amazonLink: p.link || p.amazonLink || "#",
      rating: p.rating || 4.2,
      reviewCount: p.reviewCount || 30,
      discount: p.discount,
    }));

  // =====================================
  // FILTER & MAP LOCAL PRODUCTS (Legacy fallback)
  // =====================================
  const mappedLocal = [...localProducts, ...flipkartProducts]
    .filter((p) => {
      const link = (p.amazonLink || "").toLowerCase();
      const isMatch = 
        link.includes(affiliateSlug) || 
        link.includes(affiliateName) ||
        (affiliateSlug === 'amazon' && (link.includes('amazon') || link.includes('amzn'))) ||
        (affiliateSlug === 'flipkart' && (link.includes('flipkart') || link.includes('fktr.in'))) ||
        (affiliateSlug === 'myntra' && link.includes('myntra')) ||
        (affiliateSlug === 'meesho' && link.includes('meesho')) ||
        (affiliateSlug === 'ajio' && link.includes('ajio'));

      return isMatch;
    })
    .map((p, idx) => ({
      id: `local-${idx}-${p.name}`,
      name: p.name,
      price: `₹${p.price || 0}`,
      oldPrice: p.oldPrice > 0 ? `₹${p.oldPrice}` : null,
      savings: (p.oldPrice - p.price) > 0 ? `Save ₹${p.oldPrice - p.price}` : null,
      category: p.category || "Deals",
      platform: affiliate?.data?.site_name || "Affiliate",
      imageUrl: p.imageUrl,
      description: p.shortDescription || p.name,
      amazonLink: p.amazonLink || "#",
      rating: p.rating || 4.2,
      reviewCount: p.reviewCount || 50,
      discount: p.oldPrice > 0 ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0,
    }));

  const combinedProducts = [...mappedProducts, ...mappedLocal];

  // =====================================
  // PASS DATA TO CLIENT PAGE
  // =====================================
  return (
    <AffiliateProductsPage
      affiliate={{
        name: affiliate?.data?.site_name || "Affiliate Store",
        logo: affiliate?.data?.logo || null,
        color: affiliate?.data?.brand_colour || "#3b82f6",
        description: typeof affiliate?.data?.description === "string"
          ? affiliate.data.description
          : affiliate?.data?.description?.[0]?.text || "",
        url: affiliate?.data?.affiliate_link?.url || "#",
      }}
      products={combinedProducts}
    />
  );
}
