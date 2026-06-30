'use client';

import React, { useState } from 'react';
import { SliceZone } from '@prismicio/react';
import { components } from '../../slices';

export default function PaginatedGuides({ slices }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 6 items per page so it shows nicely in grids (2x3 or 3x2 or 4x2)
  const totalItems = slices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSlices = slices.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (totalItems === 0) return null;

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 mb-10">
        <SliceZone slices={currentSlices} components={components} />
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-4 mt-8">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:shadow-sm'
            }`}
          >
            Previous
          </button>
          
          <div className="text-sm font-medium text-gray-500">
            Page {currentPage} of {totalPages}
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:shadow-sm'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
