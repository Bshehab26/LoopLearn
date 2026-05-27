// src/features/admin/hooks/useAdminCourses.js
import { useState, useCallback } from 'react';
import { getAdminCourses, approveCourse, rejectCourse, deleteCourse } from '../api/admin.api';

const useAdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
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
      const response = await getAdminCourses({ ...params, page: params.page || pagination.page });
      
      if (response.success) {
        setCourses(response.data);
        setPagination({
          page: response.pagination?.page || 1,
          limit: response.pagination?.limit || 10,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.totalPages || 0,
        });
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, [pagination.page]);

  const approveCourseById = useCallback(async (courseId) => {
    const response = await approveCourse(courseId);
    if (response.success) {
      setCourses(prev => prev.map(c => 
        c.id === courseId ? { ...c, status: 'Published' } : c
      ));
    }
    return response;
  }, []);

  const rejectCourseById = useCallback(async (courseId, reason) => {
    const response = await rejectCourse(courseId, reason);
    if (response.success) {
      setCourses(prev => prev.map(c => 
        c.id === courseId ? { ...c, status: 'Rejected' } : c
      ));
    }
    return response;
  }, []);

  const removeCourse = useCallback(async (courseId) => {
    const response = await deleteCourse(courseId);
    if (response.success) {
      setCourses(prev => prev.filter(c => c.id !== courseId));
    }
    return response;
  }, []);

  return {
    courses,
    loading,
    error,
    pagination,
    fetchCourses,
    approveCourseById,
    rejectCourseById,
    removeCourse,
  };
};

export default useAdminCourses;