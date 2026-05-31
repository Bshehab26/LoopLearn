// src/features/instructor/hooks/useInstructorCourses.js

import { useState, useEffect, useCallback } from 'react';
import { 
  getInstructorCourses, 
  deleteCourse, 
  submitForReview 
} from '../api/instructor.api';
import { mapBackendStatus } from '../utils/courseStatusMapper';

export const useInstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getInstructorCourses();
      
      if (response.success) {
        const mappedCourses = (response.data || []).map(course => ({
          ...course,
          status: mapBackendStatus(course.status)
        }));
        setCourses(mappedCourses);
        setError(null);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to load courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteCourse = useCallback(async (courseId) => {
    try {
      const response = await deleteCourse(courseId);
      if (response.success) {
        setCourses(prev => prev.filter(c => c.id !== courseId));
        return true;
      }
      setError(response.message);
      return false;
    } catch (err) {
      setError('Failed to delete course');
      return false;
    }
  }, []);

  const handleSubmitForReview = useCallback(async (courseId) => {
    try {
      const response = await submitForReview(courseId);
      if (response.success) {
        setCourses(prev => prev.map(c => 
          c.id === courseId ? { ...c, status: 'pending' } : c
        ));
        return true;
      }
      setError(response.message);
      return false;
    } catch (err) {
      setError('Failed to submit for review');
      return false;
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
    deleteCourse: handleDeleteCourse,
    submitForReview: handleSubmitForReview,
  };
};

export default useInstructorCourses;