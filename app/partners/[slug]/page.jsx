import React from "react";
import { createClient } from "../../../prismicio";
import { notFound } from "next/navigation";
import { PrismicNextImage } from "@prismicio/next";
import Link from "next/link";

import {
  FiArrowLeft,
  FiInstagram,
  FiFacebook,
  FiMessageCircle,
} from "react-icons/fi";

import PartnerProductsClient from "./PartnerProductsClient";

export default async function PartnerPage({ params }) {
  const client = createClient();

  let partner = null;

  try {
    const { slug } = params;
    partner = await client.getByUID("partner", slug);
  } catch (err) {
    console.log(err);
  }

  if (!partner) {
    notFound();
  }

  const {
    partner_name,
    partner_logo,
    partner_banner_image,
    partner_description,
    theme_color,
    whatsapp_number,
    instagram_link,
    facebook_link,
    promotion_stripe,
    featured_products = [],
  } = partner.data;

  const mappedProducts = featured_products.map((p, idx) => ({
    id: idx,
    name: p.product_title,
    price: p.product_price,
    imageUrl: p.product_image,
    category: p.product_badge,
    discount: p.product_discount,
    featuredFind: p.featured_find === true || String(p.featured_find).toLowerCase() === 'true',
    partnerName: partner_name,
    isPartner: true,
    promotionalStatus: p.promotional_status || "",
    availabilityStatus: p.availability_status || "",
    contactLink:
      p.contact_link?.url ||
      `https://wa.me/${String(whatsapp_number).replace(/[\s-+]/g, "")}`,
    description:
      typeof p.product_description === "string"
        ? p.product_description
        : p.product_description?.[0]?.text || "",
  }));

  // Store-level promo stripe or fallback to first product promo
  const storePromo = promotion_stripe || mappedProducts.find(p => p.promotionalStatus)?.promotionalStatus;

  return (
    <>
      <div className="bg-gray-50 min-h-screen pb-20">
        <div className="max-w-7xl mx-auto px-4 pt-8">
          
          {/* ================= HERO STORE SECTION ================= */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 flex flex-col lg:flex-row h-full group relative">
            
            {/* ================= LEFT: BANNER IMAGE ================= */}
            <div className="relative lg:w-5/12 xl:w-1/2 h-80 lg:h-auto min-h-[380px] shrink-0 overflow-hidden bg-gray-100">
              {partner_banner_image?.url ? (
                <PrismicNextImage
                  field={partner_banner_image}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt={partner_name}
                />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}

              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300" />

              {/* Back Button */}
              <div className="absolute top-6 left-6 z-30">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/90 backdrop-blur-md text-gray-800 hover:bg-white hover:text-black transition-all font-medium"
                >
                  <FiArrowLeft className="text-lg" />
                  Back
                </Link>
              </div>

              {/* LOGO - Top Right of Banner */}
              <div className="absolute top-6 right-6 z-30">
                <div className="w-28 h-28 bg-white rounded-3xl shadow-2xl ring-4 ring-white/90 p-3 flex items-center justify-center overflow-hidden">
                  {partner_logo?.url ? (
                    <PrismicNextImage
                      field={partner_logo}
                      className="w-full h-full object-contain"
                      alt={`${partner_name} logo`}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl" />
                  )}
                </div>
              </div>
            </div>

            {/* ================= RIGHT: STORE INFORMATION ================= */}
            <div className="flex-1 flex flex-col p-8 lg:p-12">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-2">
                {partner_name}
              </h1>

              {/* Promotional Stripe - Moved under name */}
              {storePromo && (
                <div className="mb-6 inline-block bg-orange-600 text-white text-xs font-bold px-5 py-2 rounded-full shadow-lg uppercase tracking-widest self-start overflow-hidden">
                  <span className="animate-promo-slow block px-2">
                    {storePromo}
                  </span>
                </div>
              )}

              <div className="prose text-gray-600 leading-relaxed text-[15.5px] lg:text-base mb-10 flex-1">
                {typeof partner_description === "string"
                  ? partner_description
                  : partner_description?.[0]?.text}
              </div>

              {/* Social & Contact Buttons */}
              <div className="flex flex-wrap gap-4 mt-auto">
                {whatsapp_number && (
                  <a
                    href={`https://wa.me/${String(whatsapp_number).replace(/[\s-+]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-7 py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-semibold transition-all active:scale-95"
                  >
                    <FiMessageCircle className="mr-2 text-xl" />
                    Contact Seller
                  </a>
                )}

                {instagram_link?.url && (
                  <a
                    href={instagram_link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-7 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-semibold transition-all active:scale-95"
                  >
                    <FiInstagram className="mr-2 text-xl" />
                    Instagram
                  </a>
                )}

                {facebook_link?.url && (
                  <a
                    href={facebook_link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-7 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold transition-all active:scale-95"
                  >
                    <FiFacebook className="mr-2 text-xl" />
                    Facebook
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* ================= PRODUCTS SECTION ================= */}
          <div className="mt-16">
            {storePromo && (
              <div className="mb-10 overflow-hidden rounded-2xl bg-orange-600 text-white py-4 px-6 shadow-lg animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="bg-white text-orange-600 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">Flash Sale</span>
                    <p className="font-extrabold text-lg md:text-xl italic">
                      {storePromo} — Shop Now!
                    </p>
                  </div>
                </div>
              </div>
            )}

            <h2 className="text-3xl font-bold text-gray-900 mb-10 px-2">
              Products from {partner_name}
            </h2>
            
            <PartnerProductsClient
              products={mappedProducts}
              themeColor={theme_color}
            />
          </div>

        </div>
      </div>
    </>
  );
}