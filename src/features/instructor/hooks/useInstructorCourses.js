/**
 * useInstructorCourses.js
 * Hook for managing instructor courses with localStorage
 */

import { useState, useEffect, useCallback } from 'react';
import { getAllCourses, deleteCourse, updateCourse, publishCourse } from '../utils/courseStorage';

export const useInstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = useCallback(() => {
    try {
      setLoading(true);
      const allCourses = getAllCourses();
      setCourses(allCourses);
      setError(null);
    } catch (err) {
      setError('Failed to load courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteCourse = useCallback((courseId) => {
    try {
      deleteCourse(courseId);
      setCourses(prev => prev.filter(c => c.id !== courseId));
      return true;
    } catch (err) {
      setError('Failed to delete course');
      return false;
    }
  }, []);

  const handlePublishCourse = useCallback((courseId) => {
    try {
      const updated = publishCourse(courseId);
      setCourses(prev => prev.map(c => c.id === courseId ? updated : c));
      return true;
    } catch (err) {
      setError('Failed to publish course');
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
  };
};

export default useInstructorCourses;