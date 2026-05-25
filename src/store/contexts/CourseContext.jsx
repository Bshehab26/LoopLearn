// src/store/contexts/CourseContext.jsx
import React, { createContext, useState, useContext, useCallback } from 'react';
import { getAllCourses, searchCourses, getCoursesByCategories } from '../../features/courses/api/course.api';

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 12;

// ============================================================================
// Context
// ============================================================================

const CourseContext = createContext(null);

export const useCourseContext = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourseContext must be used within CourseProvider');
  }
  return context;
};

// ============================================================================
// Provider
// ============================================================================

export const CourseProvider = ({ children }) => {
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE,
    total: 0,
    totalPages: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  // Fetch all courses
  const fetchAllCourses = useCallback(async (page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllCourses(page, pageSize);
      if (response.success) {
        setAllCourses(response.data || []);
        setPagination({
          page: response.pagination?.page || page,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.totalPages || 0,
          pageSize: response.pagination?.pageSize || pageSize,
        });
        return { success: true, data: response.data };
      }
      setError(response.message);
      return { success: false, error: response.message };
    } catch (err) {
      const message = err.message || 'Failed to load courses';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Search courses
  const searchAllCourses = useCallback(async (searchTerm, page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE) => {
    setLoading(true);
    setError(null);
    try {
      const response = await searchCourses(searchTerm, page, pageSize);
      if (response.success) {
        setAllCourses(response.data || []);
        setPagination({
          page: response.pagination?.page || page,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.totalPages || 0,
          pageSize: response.pagination?.pageSize || pageSize,
        });
        return { success: true, data: response.data };
      }
      setError(response.message);
      return { success: false, error: response.message };
    } catch (err) {
      const message = err.message || 'Failed to search courses';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter by categories
  const filterByCategories = useCallback(async (categories, page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCoursesByCategories(categories, page, pageSize);
      if (response.success) {
        setAllCourses(response.data || []);
        setPagination({
          page: response.pagination?.page || page,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.totalPages || 0,
          pageSize: response.pagination?.pageSize || pageSize,
        });
        return { success: true, data: response.data };
      }
      setError(response.message);
      return { success: false, error: response.message };
    } catch (err) {
      const message = err.message || 'Failed to filter courses';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear courses
  const clearCourses = useCallback(() => {
    setAllCourses([]);
    setError(null);
    setPagination({
      page: DEFAULT_PAGE,
      total: 0,
      totalPages: 0,
      pageSize: DEFAULT_PAGE_SIZE,
    });
  }, []);

  const value = {
    allCourses,
    loading,
    error,
    pagination,
    fetchAllCourses,
    searchAllCourses,
    filterByCategories,
    clearCourses,
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};