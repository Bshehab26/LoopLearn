// src/shared/hooks/usePagination.js
//
// Fixed: page reset was keyed on items.length — if items changed but count stayed
//        the same (e.g. different filter producing same N results) page never reset.
//        Now uses a stable reference check via JSON.stringify of first/last ids.
//
// Usage:
//   const { currentItems, currentPage, totalPages, goToPage, goNext, goPrev } =
//     usePagination({ items, itemsPerPage: 8 });

import { useState, useEffect, useRef } from 'react';

const usePagination = ({ items = [], itemsPerPage = 10, scrollToTop = true }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ FIX: detect actual list change using a fingerprint of first + last item ids
  //    Falls back to index if id not present.
  const fingerprintRef = useRef('');
  useEffect(() => {
    const first = items[0]?.id ?? items[0] ?? '__empty__';
    const last  = items[items.length - 1]?.id ?? items[items.length - 1] ?? '__empty__';
    const fp = `${items.length}:${first}:${last}`;
    if (fp !== fingerprintRef.current) {
      fingerprintRef.current = fp;
      setCurrentPage(1);
    }
  }, [items]);

  useEffect(() => {
    if (scrollToTop) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, scrollToTop]);

  const totalPages   = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const indexOfFirst = (currentPage - 1) * itemsPerPage;
  const currentItems = items.slice(indexOfFirst, indexOfFirst + itemsPerPage);

  const goToPage = (page) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  const goNext   = () => goToPage(currentPage + 1);
  const goPrev   = () => goToPage(currentPage - 1);

  return {
    currentItems,
    currentPage,
    totalPages,
    indexOfFirst,
    goToPage,
    goNext,
    goPrev,
    isFirstPage: currentPage === 1,
    isLastPage:  currentPage === totalPages,
  };
};

export default usePagination;