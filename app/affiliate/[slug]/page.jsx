import { createClient } from "../../../prismicio";
import { notFound } from "next/navigation";
import AffiliateProductsPage from "./AffiliateProductsPage";
import { products as localProducts } from "../../../components/products.js";
import { products as flipkartProducts } from "../../../components/flipkartProducts.js";
import { fetchProductsFromSheet } from "../../../lib/products";

export const revalidate = 60;

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
  const affiliateId = affiliate?.id;

  // =====================================
  // FETCH PRISMIC PRODUCTS
  // =====================================
  const prismicDocs = await client.getAllByType("product");

  // =====================================
  // FILTER & MAP PRISMIC PRODUCTS
  // =====================================
  const mappedPrismic = prismicDocs
    .filter((doc) => {
      // Match relationship field
      if (doc?.data?.platform && doc.data.platform.id === affiliateId) return true;

      // Match tags
      if (doc?.tags?.some(tag => 
        tag?.toLowerCase() === affiliateName || 
        tag?.toLowerCase() === affiliateSlug
      )) return true;

      // Match category
      if (doc?.data?.category && (
        doc.data.category.toLowerCase() === affiliateName ||
        doc.data.category.toLowerCase() === affiliateSlug
      )) return true;

      // Match platform name directly
      if (doc?.data?.platform_name && doc.data.platform_name.toLowerCase() === affiliateName) return true;

      return false;
    })
    .map((doc) => {
      const price = doc?.data?.price?.toString() || "0";
      const discount = doc?.data?.discount?.toString() || "";
      
      const parsedPrice = parseFloat(price.replace(/[^0-9.]/g, "")) || 0;
      const parsedDiscount = parseFloat(discount.replace(/[^0-9.]/g, "")) || 0;
      const oldPrice = parsedPrice + parsedDiscount;

      const formatPrice = (p) => {
        if (!p || String(p).trim() === '') return '';
        let strClean = String(p).trim();
        if (strClean.includes('₹')) return strClean;
        if (/^[0-9]/.test(strClean)) return `₹${strClean}`;
        return strClean;
      };
      const formattedPrice = formatPrice(price);

      const imageUrl = doc?.data?.image || "https://placehold.co/600x600/E5E7EB/475569?text=No+Image";

      let description = doc?.data?.description;

      return {
        id: doc.id,
        name: doc?.data?.title || doc?.data?.product_name || "Product",
        price: formattedPrice,
        oldPrice: parsedDiscount > 0 && parsedPrice > 0 ? `₹${oldPrice}` : null,
        savings: discount && parsedDiscount > 0 ? `Save ${discount.includes('%') || discount.includes('₹') ? discount : `₹${discount}`}` : null,
        category: doc?.data?.category || affiliate?.data?.site_name || "Products",
        platform: affiliate?.data?.site_name || "Affiliate",
        imageUrl,
        description,
        amazonLink: doc?.data?.link?.url || "#",
        rating: 4.5,
        reviewCount: 120,
        discount,
        featuredFind: doc?.data?.featured_find === true,
        promotionalStatus: doc?.data?.promotional_status || "",
        availabilityStatus: doc?.data?.availability_status || "",
      };
    });

  // =====================================
  // FILTER & MAP LOCAL PRODUCTS (Daily Deals)
  // =====================================
  const mappedLocal = [...localProducts, ...flipkartProducts]
    .filter((p) => {
      const link = (p.amazonLink || "").toLowerCase();
      const name = (p.name || "").toLowerCase();
      const cat = (p.category || "").toLowerCase();
      
      // Check if link matches affiliate
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

  // =====================================
  // FETCH SHEET PRODUCTS (Daily Deals)
  // =====================================
  let mappedSheet = [];
  try {
    const rawSheet = await fetchProductsFromSheet().catch(() => []);
    mappedSheet = rawSheet
      .filter((p) => {
        const platform = (p.platform || "").toLowerCase();
        const link = (p.link || "").toLowerCase();
        
        return platform === affiliateName || 
               platform === affiliateSlug ||
               link.includes(affiliateSlug) ||
               link.includes(affiliateName);
      })
      .map((p, idx) => ({
        id: `sheet-${idx}-${p.title}`,
        name: p.title,
        price: p.price.startsWith('₹') ? p.price : `₹${p.price}`,
        oldPrice: null, // Sheet data structure doesn't have oldPrice usually
        savings: null,
        category: p.category || "Deals",
        platform: affiliate?.data?.site_name || "Affiliate",
        imageUrl: p.image,
        description: p.description || p.title,
        amazonLink: p.link || "#",
        rating: 4.2,
        reviewCount: 30,
        discount: p.discount,
      }));
  } catch (e) {
    console.error("Affiliate sheet merge error:", e);
  }

  const combinedProducts = [...mappedPrismic, ...mappedLocal, ...mappedSheet];

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
