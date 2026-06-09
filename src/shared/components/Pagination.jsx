// src/shared/components/Pagination.jsx

import React from 'react';
import { HiChevronLeft, HiChevronRight, HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  showFirstLast = true,
  showPageNumbers = true,
  siblingCount = 1,
  className = ''
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const totalPageNumbers = siblingCount * 2 + 3;
    const pageNumbers = [];

    if (totalPages <= totalPageNumbers) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
      const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
      const showLeftDots = leftSiblingIndex > 2;
      const showRightDots = rightSiblingIndex < totalPages - 1;

      if (!showLeftDots && showRightDots) {
        const leftItemsCount = 3 + 2 * siblingCount;
        for (let i = 1; i <= leftItemsCount; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (showLeftDots && !showRightDots) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        const rightItemsCount = 3 + 2 * siblingCount;
        for (let i = totalPages - rightItemsCount + 1; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else if (showLeftDots && showRightDots) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  const handlePageChange = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const pageNumbers = showPageNumbers ? getPageNumbers() : [];

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* First Page Button */}
      {showFirstLast && (
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          aria-label="First page"
        >
          <HiChevronDoubleLeft size={18} />
        </button>
      )}

      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        aria-label="Previous page"
      >
        <HiChevronLeft size={18} />
      </button>

      {/* Page Numbers */}
      {showPageNumbers && pageNumbers.map((page, index) => (
        page === '...' ? (
          <span key={`dots-${index}`} className="px-3 py-2 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`min-w-[40px] h-10 px-3 rounded-lg font-medium transition ${
              currentPage === page
                ? 'bg-purple-600 text-white shadow-sm'
                : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        )
      ))}

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        aria-label="Next page"
      >
        <HiChevronRight size={18} />
      </button>

      {/* Last Page Button */}
      {showFirstLast && (
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          aria-label="Last page"
        >
          <HiChevronDoubleRight size={18} />
        </button>
      )}
    </div>
  );
};

export default Pagination;