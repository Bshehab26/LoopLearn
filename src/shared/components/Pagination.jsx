// src/shared/components/Pagination.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-1.5 rounded-lg text-gray-400 hover:text-[#534AB7] hover:bg-[#EEEDFE] disabled:opacity-30 disabled:cursor-not-allowed transition"
        aria-label="Previous page"
      >
        <HiOutlineChevronLeft size={16} />
      </button>

      {getPageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="px-2 text-xs text-gray-400">…</span>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange(page)}
              className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-medium transition
                ${page === currentPage
                  ? 'bg-[#534AB7] text-white shadow-sm'
                  : 'text-gray-500 hover:bg-[#EEEDFE] hover:text-[#534AB7]'}`}
            >
              {page}
            </motion.button>
          )}
        </React.Fragment>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-1.5 rounded-lg text-gray-400 hover:text-[#534AB7] hover:bg-[#EEEDFE] disabled:opacity-30 disabled:cursor-not-allowed transition"
        aria-label="Next page"
      >
        <HiOutlineChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;