"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PrismicNextImage } from "@prismicio/next";
import ProductCard from "../../../components/ProductCard";
import {
  FiSearch,
  FiFilter,
  FiX,
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

export default function AffiliateProductsPage({ affiliate, products = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [minDiscount, setMinDiscount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 12;

  const affiliateColor = affiliate?.color || "#3b82f6";

  // Categories
  const allCategories = useMemo(() => {
    return Array.from(
      new Set(products.map((p) => p.category).filter(Boolean))
    );
  }, [products]);

  useEffect(() => {
    if (allCategories.length > 0 && selectedCategories.length === 0) {
      setSelectedCategories(allCategories);
    }
  }, [allCategories]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (searchTerm.trim()) {
      result = result.filter((product) => {
        const term = searchTerm.toLowerCase();

        return (
          product?.name?.toLowerCase()?.includes(term) ||
          product?.category?.toLowerCase()?.includes(term) ||
          product?.platform?.toLowerCase()?.includes(term)
        );
      });
    }

    // Category
    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    // Price Range
    if (priceRange.min || priceRange.max) {
      result = result.filter((product) => {
        const price = parseFloat(
          product?.price?.toString()?.replace(/[^0-9.]/g, "") || "0"
        );
        const matchesMin = !priceRange.min || price >= parseFloat(priceRange.min);
        const matchesMax = !priceRange.max || price <= parseFloat(priceRange.max);
        return matchesMin && matchesMax;
      });
    }

    // Discount
    if (minDiscount > 0) {
      result = result.filter((product) => {
        const discount = parseFloat(product?.discount || "0");
        return discount >= minDiscount;
      });
    }

    // Sort
    if (sortOption === "price-asc") {
      result.sort((a, b) => {
        const priceA = parseFloat(
          a?.price?.toString()?.replace(/[^0-9.]/g, "") || "0"
        );
        const priceB = parseFloat(
          b?.price?.toString()?.replace(/[^0-9.]/g, "") || "0"
        );

        return priceA - priceB;
      });
    }

    if (sortOption === "price-desc") {
      result.sort((a, b) => {
        const priceA = parseFloat(
          a?.price?.toString()?.replace(/[^0-9.]/g, "") || "0"
        );
        const priceB = parseFloat(
          b?.price?.toString()?.replace(/[^0-9.]/g, "") || "0"
        );

        return priceB - priceA;
      });
    }

    return result;
  }, [products, searchTerm, selectedCategories, sortOption]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategories, sortOption]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className="min-h-screen bg-[#f8fafc]">

        {/* HERO SECTION */}
        <section className="relative overflow-hidden">
          {/* Background */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${affiliateColor} 0%, #111827 100%)`,
            }}
          />

          <div className="absolute inset-0 bg-black/30" />

          <div className="relative z-10 container mx-auto px-4 py-14 md:py-20">

            {/* Back */}
            <Link
              href="/"
              className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl transition-colors font-medium text-sm"
            >
              <FiArrowLeft /> Back to Home
            </Link>
            <div className="flex flex-col items-center text-center">

              {/* Logo */}
              {affiliate?.logo?.url && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl shadow-2xl p-5 mb-6 w-28 h-28 flex items-center justify-center"
                >
                  <PrismicNextImage
                    field={affiliate.logo}
                    fallbackAlt=""
                    className="object-contain w-full h-full"
                  />
                </motion.div>
              )}

              {/* Name */}
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                {affiliate?.name}
              </h1>

              {/* Description */}
              <p className="text-white/80 text-lg max-w-3xl leading-relaxed">
                {affiliate?.description ||
                  `Discover top curated products and premium deals from ${affiliate?.name}.`}
              </p>

              {/* Visit Button */}
              {affiliate?.url && (
                <a
                  href={affiliate.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-7 py-4 rounded-2xl hover:scale-105 transition-transform shadow-xl"
                >
                  Visit Official Store
                </a>
              )}
            </div>

            {/* Search + Controls */}
            <div className="mt-12 max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-4 md:p-6">

              <div className="flex flex-col lg:flex-row gap-4">

                {/* Search */}
                <div className="relative flex-1">
                  <FiSearch
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />

                  <input
                    type="text"
                    placeholder={`Search ${affiliate?.name} products...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 text-gray-900"
                    style={{
                      focusRingColor: affiliateColor,
                    }}
                  />
                </div>

                {/* Sort */}
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="px-5 py-4 rounded-2xl border border-gray-200 bg-white text-gray-700 font-medium outline-none"
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                </select>

                {/* Filter */}
                <button
                  onClick={() => setShowFilterMenu(true)}
                  className="px-6 py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition"
                  style={{
                    backgroundColor: affiliateColor,
                  }}
                >
                  <FiFilter />
                  Filters
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCTS */}
        <section className="container mx-auto px-4 py-14">

          {/* Top */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">

            <div>
              <h2 className="text-3xl font-black text-gray-900">
                Products
              </h2>

              <p className="text-gray-500 mt-2">
                Showing {filteredProducts.length} products from{" "}
                {affiliate?.name}
              </p>
            </div>
          </div>

          {/* Product Grid */}
          {currentProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-7">

                {currentProducts.map((product, index) => (
                  <motion.div
                    key={product?.id || index}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="hover:-translate-y-1 transition-transform duration-300"
                  >
                    <ProductCard
                      product={product}
                      isDeal={false}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-14">

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.max(1, p - 1))
                    }
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-2xl font-semibold hover:bg-gray-50 disabled:opacity-40"
                  >
                    <FiChevronLeft />
                    Prev
                  </button>

                  <div className="px-5 py-3 bg-white border border-gray-200 rounded-2xl font-semibold text-gray-700">
                    {currentPage} / {totalPages}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(totalPages, p + 1)
                      )
                    }
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-2xl font-semibold hover:bg-gray-50 disabled:opacity-40"
                  >
                    Next
                    <FiChevronRight />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                No Products Found
              </h3>

              <p className="text-gray-500">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </section>

        {/* FILTER DRAWER */}
        {showFilterMenu && (
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end"
            onClick={() => setShowFilterMenu(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-gray-900">
                  Filters
                </h3>

                <button
                  onClick={() => setShowFilterMenu(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                >
                  <FiX />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h4 className="font-bold text-gray-900 mb-4">
                  Categories
                </h4>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {allCategories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories((prev) => [
                              ...prev,
                              category,
                            ]);
                          } else {
                            setSelectedCategories((prev) =>
                              prev.filter((c) => c !== category)
                            );
                          }
                        }}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />

                      <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h4 className="font-bold text-gray-900 mb-4">Price Range (INR)</h4>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Minimum Discount */}
              <div className="mb-8">
                <h4 className="font-bold text-gray-900 mb-4">Minimum Discount</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[10, 20, 30, 50].map((d) => (
                    <button
                      key={d}
                      onClick={() => setMinDiscount(minDiscount === d ? 0 : d)}
                      className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all ${
                        minDiscount === d
                          ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                          : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                      }`}
                      style={{
                        backgroundColor: minDiscount === d ? affiliateColor : "",
                        borderColor: minDiscount === d ? affiliateColor : "",
                      }}
                    >
                      {d}%+ Off
                    </button>
                  ))}
                </div>
              </div>

              {/* Close */}
              <button
                onClick={() => setShowFilterMenu(false)}
                className="w-full mt-10 py-4 rounded-2xl text-white font-bold"
                style={{
                  backgroundColor: affiliateColor,
                }}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}