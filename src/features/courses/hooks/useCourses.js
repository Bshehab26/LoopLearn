// src/features/courses/hooks/useCourses.js
//
// Fix: fetchCourses was in useCallback([filters]) AND triggered by useEffect([fetchCourses]).
//      Every render created a new `filters` object reference → new fetchCourses →
//      new effect → fetch → setState → render → repeat = infinite loop.
//
// Solution: useEffect depends directly on primitive filter values, not the object.
//           fetchCourses uses a ref to always read latest filters without being
//           a dependency of the effect.

import { useState, useCallback, useEffect, useRef } from 'react';
import { getFilteredCourses } from '../api/course.api';

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_PAGE      = 1;
const DEFAULT_PAGE_SIZE = 50;
const DEBOUNCE_DELAY    = 500;

// ============================================================================
// Hook
// ============================================================================

const useCourses = (initialFilters = {}) => {
  const [courses,    setCourses]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE, pageSize: DEFAULT_PAGE_SIZE, total: 0, totalPages: 0,
  });

  const [filters, setFilters] = useState({
    searchTerm: '',
    categories: [],
    page:       DEFAULT_PAGE,
    pageSize:   DEFAULT_PAGE_SIZE,
    ...initialFilters,
  });

  // ✅ FIX: keep a ref so fetchCourses can read latest filters without being
  //    listed as an effect dependency (avoids the infinite-loop).
  const filtersRef      = useRef(filters);
  const debounceRef     = useRef(null);
  const abortRef        = useRef(null);       // cancel in-flight requests

  useEffect(() => { filtersRef.current = filters; }, [filters]);

  // ── Core fetch ────────────────────────────────────────────────────────────
  const fetchCourses = useCallback(async () => {
    // Cancel any previous in-flight request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const { searchTerm, categories, page, pageSize } = filtersRef.current;
      const response = await getFilteredCourses({ searchTerm, categories, page, pageSize });

      if (response.success) {
        setCourses(response.data ?? []);
        setPagination({
          page:       response.pagination?.page       ?? page,
          pageSize:   response.pagination?.pageSize   ?? pageSize,
          total:      response.pagination?.total      ?? 0,
          totalPages: response.pagination?.totalPages ?? 0,
        });
      } else {
        setError(response.message ?? 'Failed to load courses');
        setCourses([]);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message ?? 'Failed to load courses');
        setCourses([]);
      }
    } finally {
      setLoading(false);
    }
  }, []); // ✅ no dependencies → stable reference

  // ── Re-fetch when filter primitives change ────────────────────────────────
  // Depend on primitive values, not the object, to avoid stale-closure loops.
  useEffect(() => {
    fetchCourses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.searchTerm,
    // stringify categories array for stable comparison
    JSON.stringify(filters.categories),
    filters.page,
    filters.pageSize,
  ]);

  // Cleanup on unmount
  useEffect(() => () => {
    debounceRef.current && clearTimeout(debounceRef.current);
    abortRef.current?.abort();
  }, []);

  // ── Filter setters ────────────────────────────────────────────────────────

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: DEFAULT_PAGE }));
  }, []);

  const changePage = useCallback((newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  }, []);

  /** Debounced search — safe to call on every keystroke */
  const searchCoursesDebounced = useCallback((searchTerm) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilters(prev => ({ ...prev, searchTerm, page: DEFAULT_PAGE }));
    }, DEBOUNCE_DELAY);
  }, []);

  const filterByCategories = useCallback((categories) => {
    setFilters(prev => ({ ...prev, categories, page: DEFAULT_PAGE }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      searchTerm: '',
      categories: [],
      page:       DEFAULT_PAGE,
      pageSize:   DEFAULT_PAGE_SIZE,
    });
  }, []);

  return {
    courses,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    changePage,
    searchCoursesDebounced,
    filterByCategories,
    clearFilters,
    refetch: fetchCourses,
  };
};

export default useCourses;