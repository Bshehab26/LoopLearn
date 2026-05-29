// src/features/instructor/hooks/useInstructorCourses.js

import { useState, useEffect, useCallback } from 'react';
import { 
  getInstructorCourses, 
  deleteCourse, 
  publishCourse,
  submitForReview 
} from '../api/instructor.api';

export const useInstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getInstructorCourses();
      
      if (response.success) {
        setCourses(response.data || []);
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

  const handlePublishCourse = useCallback(async (courseId) => {
    try {
      const response = await publishCourse(courseId);
      if (response.success) {
        setCourses(prev => prev.map(c => 
          c.id === courseId ? { ...c, status: 'published' } : c
        ));
        return true;
      }
      setError(response.message);
      return false;
    } catch (err) {
      setError('Failed to publish course');
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
    publishCourse: handlePublishCourse,
    submitForReview: handleSubmitForReview,
  };
};

export default useInstructorCourses;