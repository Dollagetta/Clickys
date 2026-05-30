"use client";

import React, { useMemo, useState } from "react";
import ProductCard from "../../../components/ProductCard";
import { FiSearch, FiArrowLeft } from "react-icons/fi";
import Link from 'next/link';

export default function PartnerProductsClient({
  products = [],
  themeColor = "#f59e0b",
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  return (
    <div className="w-full">
      {/* ================= SEARCH SECTION ================= */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 mb-12 shadow-sm">
        <div className="relative max-w-md mx-auto">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
            <FiSearch className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search products in this store..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 focus:border-gray-300 focus:bg-white pl-12 py-4 rounded-2xl text-gray-800 placeholder-gray-400 transition-all focus:outline-none"
          />
        </div>
      </div>

      {/* ================= PRODUCT GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <div 
            key={product.id} 
            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col h-full"
          >
            {/* ProductCard is kept as-is */}
            <div className="flex-1 flex flex-col">
              <ProductCard product={product} isDeal={false} />
            </div>

            {/* Optional Description - Clean & Minimal */}
            {product.description && (
              <div className="px-6 pb-6 mt-auto">
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No products found matching your search.
        </div>
      )}
    </div>
  );
}