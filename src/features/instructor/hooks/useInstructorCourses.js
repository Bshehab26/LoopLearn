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
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'draft', 'pending', 'published', 'rejected'

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
        // Update the course status in the local state
        setCourses(prev => prev.map(course => 
          course.id === courseId 
            ? { ...course, status: 'pending' } 
            : course
        ));
        
        // Also refresh from server to ensure consistency
        await fetchCourses();
        
        return true;
      }
      setError(response.message);
      return false;
    } catch (err) {
      setError('Failed to submit for review');
      return false;
    }
  }, [fetchCourses]);

  // Filter courses based on active filter
  const filteredCourses = useCallback(() => {
    if (activeFilter === 'all') return courses;
    return courses.filter(course => course.status === activeFilter);
  }, [courses, activeFilter]);

  // Get counts for each status
  const getStatusCounts = useCallback(() => {
    return {
      all: courses.length,
      draft: courses.filter(c => c.status === 'draft').length,
      pending: courses.filter(c => c.status === 'pending').length,
      published: courses.filter(c => c.status === 'published').length,
      rejected: courses.filter(c => c.status === 'rejected').length,
    };
  }, [courses]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses: filteredCourses(),
    allCourses: courses,
    loading,
    error,
    activeFilter,
    setActiveFilter,
    statusCounts: getStatusCounts(),
    fetchCourses,
    deleteCourse: handleDeleteCourse,
    submitForReview: handleSubmitForReview,
  };
};

export default useInstructorCourses;