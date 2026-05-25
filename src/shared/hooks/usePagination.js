// src/shared/hooks/usePagination.js
// Generic pagination hook used by CoursesList and MyEnrollments.
// Replaces the duplicated currentPage / totalPages logic in both pages.
//
// Usage:
//   const { currentItems, currentPage, totalPages, goToPage, goNext, goPrev } =
//     usePagination({ items: allCourses, itemsPerPage: 8 });

import { useState, useEffect } from 'react';

const usePagination = ({ items = [], itemsPerPage = 10, scrollToTop = true }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when the items list changes (e.g. after a search)
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  // Optionally scroll to top on page change
  useEffect(() => {
    if (scrollToTop) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, scrollToTop]);

  const totalPages    = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const indexOfFirst  = (currentPage - 1) * itemsPerPage;
  const currentItems  = items.slice(indexOfFirst, indexOfFirst + itemsPerPage);

  const goToPage = (page) => {
    const clamped = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(clamped);
  };

  const goNext = () => goToPage(currentPage + 1);
  const goPrev = () => goToPage(currentPage - 1);

  return {
    currentItems,         // the slice to render
    currentPage,
    totalPages,
    indexOfFirst,         // useful when mapping progress arrays by global index
    goToPage,
    goNext,
    goPrev,
    isFirstPage: currentPage === 1,
    isLastPage:  currentPage === totalPages,
  };
};

export default usePagination;
