import { createClient } from "../../../prismicio";
import { notFound } from "next/navigation";
import AffiliateProductsPage from "./AffiliateProductsPage";

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

  return {
    title: `${siteName} Products & Deals | Clickys.in`,
    description: `Explore curated products, trending deals, and top recommendations from ${siteName} on Clickys.in.`,
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

  // =====================================
  // FETCH PRODUCTS
  // =====================================
  const allProducts = await client.getAllByType("product");

  const affiliateName =
    affiliate?.data?.site_name?.toLowerCase() || "";

  const affiliateSlug =
    affiliate?.uid?.toLowerCase() || "";

  const affiliateId = affiliate?.id;

  // =====================================
  // FILTER PRODUCTS
  // =====================================
  const filteredProducts = allProducts
    .filter((doc) => {
      // Match relationship field
      if (
        doc?.data?.platform &&
        doc.data.platform.id === affiliateId
      ) {
        return true;
      }

      // Match tags
      if (
        doc?.tags?.some(
          (tag) =>
            tag?.toLowerCase() === affiliateName ||
            tag?.toLowerCase() === affiliateSlug
        )
      ) {
        return true;
      }

      // Match category
      if (
        doc?.data?.category &&
        (
          doc.data.category.toLowerCase() === affiliateName ||
          doc.data.category.toLowerCase() === affiliateSlug
        )
      ) {
        return true;
      }

      return false;
    })
    .map((doc) => {
      // Price
      const price =
        doc?.data?.price?.toString() || "0";

      const discount =
        doc?.data?.discount || 0;

      const oldPrice =
        parseFloat(price.replace(/[^0-9.]/g, "")) +
        parseFloat(discount || 0);

      // Image
      const imageUrl =
        doc?.data?.image ||
        "https://placehold.co/600x600/E5E7EB/475569?text=No+Image";

      // Description
      let description = "";

      if (typeof doc?.data?.description === "string") {
        description = doc.data.description;
      } else if (
        Array.isArray(doc?.data?.description) &&
        doc.data.description[0]?.text
      ) {
        description = doc.data.description[0].text;
      }

      return {
        id: doc.id,

        name:
          doc?.data?.title ||
          doc?.data?.product_name ||
          "Product",

        price: `₹${price}`,

        oldPrice:
          oldPrice > 0 ? `₹${oldPrice}` : null,

        savings:
          discount > 0
            ? `Save ₹${discount}`
            : null,

        category:
          doc?.data?.category ||
          affiliate?.data?.site_name ||
          "Products",

        platform:
          affiliate?.data?.site_name || "Affiliate",

        imageUrl,

        description,

        amazonLink:
          doc?.data?.link?.url || "#",

        rating: 4.5,

        reviewCount: 120,

        discount,

        featuredFind: doc?.data?.featured_find === true,

        promotionalStatus: doc?.data?.promotional_status || "",

        availabilityStatus: doc?.data?.availability_status || "",
      };
    });

  // =====================================
  // PASS DATA TO CLIENT PAGE
  // =====================================
  return (
    <AffiliateProductsPage
      affiliate={{
        name:
          affiliate?.data?.site_name ||
          "Affiliate Store",

        logo:
          affiliate?.data?.logo || null,

        color:
          affiliate?.data?.brand_colour ||
          "#3b82f6",

        description:
          typeof affiliate?.data?.description ===
          "string"
            ? affiliate.data.description
            : affiliate?.data?.description?.[0]
                ?.text || "",

        url:
          affiliate?.data?.affiliate_link?.url ||
          "#",
      }}
      products={filteredProducts}
    />
  );
}