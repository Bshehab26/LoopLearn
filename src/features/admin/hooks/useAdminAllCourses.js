// src/features/admin/hooks/useAdminAllCourses.js

import { useState, useCallback } from 'react';
import { getAdminCourses } from '../api/admin.api';

const useAdminAllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchCourses = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAdminCourses(params);
      
      if (response.success) {
        setCourses(response.data || []);
        setPagination(response.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 });
      } else {
        setError(response.message || 'Failed to load courses');
      }
    } catch (err) {
      setError(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCourse = useCallback(async (courseId) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    return { success: true };
  }, []);

  return {
    courses,
    loading,
    error,
    pagination,
    fetchCourses,
    deleteCourse,
  };
};

export default useAdminAllCourses;