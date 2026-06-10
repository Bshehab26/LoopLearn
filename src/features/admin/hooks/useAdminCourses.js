// src/features/admin/hooks/useAdminCourses.js
// USED FOR PENDING COURSES PAGE - REAL API

import { useState, useCallback, useEffect } from 'react';
import { getPendingCourses, approveCourse, rejectCourse } from '../api/admin.api';

const useAdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPendingCourses();
      
      console.log('[useAdminCourses] Response:', response);
      
      if (response.success) {
        setCourses(response.data || []);
      } else {
        setError(response.message || 'Failed to load pending courses');
        setCourses([]);
      }
    } catch (err) {
      console.error('[useAdminCourses] Error:', err);
      setError(err.message || 'Failed to load courses');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const approveCourseById = useCallback(async (courseId) => {
    try {
      const response = await approveCourse(courseId);
      if (response.success) {
        setCourses(prev => prev.filter(c => c.id !== courseId));
        return { success: true, message: response.message };
      }
      return { success: false, message: response.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, []);

  const rejectCourseById = useCallback(async (courseId, reason) => {
    try {
      const response = await rejectCourse(courseId, reason);
      if (response.success) {
        setCourses(prev => prev.filter(c => c.id !== courseId));
        return { success: true, message: response.message };
      }
      return { success: false, message: response.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    loading,
    error,
    fetchCourses,
    approveCourseById,
    rejectCourseById,
  };
};

export default useAdminCourses;