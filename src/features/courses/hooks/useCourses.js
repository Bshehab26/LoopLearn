// src/features/courses/hooks/useCourses.js
import { useState, useCallback, useEffect, useRef } from 'react';
import { getAllCourses, searchCourses, getCoursesByCategories, getFilteredCourses } from '../api/course.api';

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 12;
const DEBOUNCE_DELAY = 500;

// ============================================================================
// Hook
// ============================================================================

/**
 * useCourses - Hook for managing course listing with search, filter, and pagination
 */
const useCourses = (initialFilters = {}) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });
  
  const [filters, setFilters] = useState({
    searchTerm: '',
    categories: [],
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    ...initialFilters,
  });
  
  const debounceTimerRef = useRef(null);

  // Fetch courses based on current filters
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { searchTerm, categories, page, pageSize } = filters;
      
      const response = await getFilteredCourses({
        searchTerm,
        categories,
        page,
        pageSize,
      });
      
      if (response.success) {
        setCourses(response.data || []);
        setPagination({
          page: response.pagination?.page || page,
          pageSize: response.pagination?.pageSize || pageSize,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.totalPages || 0,
        });
      } else {
        setError(response.message);
        setCourses([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load courses');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Update filters and refetch
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: DEFAULT_PAGE })); // Reset page on filter change
  }, []);

  // Change page
  const changePage = useCallback((newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  }, []);

  // Search with debounce
  const searchCoursesDebounced = useCallback((searchTerm) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      setFilters(prev => ({ ...prev, searchTerm, page: DEFAULT_PAGE }));
    }, DEBOUNCE_DELAY);
  }, []);

  // Filter by categories
  const filterByCategories = useCallback((categories) => {
    setFilters(prev => ({ ...prev, categories, page: DEFAULT_PAGE }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      searchTerm: '',
      categories: [],
      page: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
    });
  }, []);

  // Refetch when filters change
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
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