// src/features/courses/hooks/useCourseDetails.js

import { useState, useEffect, useCallback } from 'react';
import { getCourseById, calculateTotalDuration, calculateTotalLessons } from '../api/course.api';
import { useAuth } from '../../../store/AppProvider';

// ============================================================================
// Hook
// ============================================================================

const useCourseDetails = (courseId) => {
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [userProgress, setUserProgress] = useState(null);

  // Fetch course details
  const fetchCourseDetails = useCallback(async () => {
    if (!courseId || courseId < 1) {
      setError('Invalid course ID');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await getCourseById(courseId);
      
      if (response.success && response.data) {
        const courseData = response.data;
        
        // Enhance course data with computed values
        const enhancedCourse = {
          ...courseData,
          totalDuration: calculateTotalDuration(courseData.sections),
          totalLessons: calculateTotalLessons(courseData.sections),
          // Mark which lessons are free/preview
          sections: courseData.sections?.map(section => ({
            ...section,
            lessons: section.lessons?.map(lesson => ({
              ...lesson,
              isAccessible: lesson.isPreview || false // Preview lessons are free
            }))
          }))
        };
        
        setCourse(enhancedCourse);
        
        // TODO: Check enrollment status from API
        // For now, mock based on user role or localStorage
        const mockEnrolled = localStorage.getItem(`enrolled_${courseId}`) === 'true';
        setIsEnrolled(mockEnrolled);
        
      } else {
        setError(response.message || 'Failed to load course details');
        setCourse(null);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while loading course');
      setCourse(null);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  // Enroll in course
  const enrollInCourse = useCallback(async () => {
    if (!isAuthenticated) {
      return { success: false, requiresAuth: true };
    }
    
    try {
      // TODO: Call enrollment API
      // const response = await enrollInCourse(courseId);
      
      // Mock success
      setIsEnrolled(true);
      localStorage.setItem(`enrolled_${courseId}`, 'true');
      return { success: true };
    } catch (error) {
      console.error('Enrollment failed:', error);
      return { success: false, error: error.message };
    }
  }, [courseId, isAuthenticated]);

  // Toggle save/wishlist
  const toggleSave = useCallback(async () => {
    if (!isAuthenticated) {
      return { success: false, requiresAuth: true };
    }
    
    setIsSaved(prev => !prev);
    // TODO: Call wishlist API
    return { success: true };
  }, [isAuthenticated]);

  // Check if lesson is accessible (free preview OR user is enrolled)
  const isLessonAccessible = useCallback((lesson) => {
    if (isEnrolled) return true;
    return lesson?.isPreview === true;
  }, [isEnrolled]);

  // Fetch on mount or courseId change
  useEffect(() => {
    fetchCourseDetails();
  }, [fetchCourseDetails]);

  return {
    course,
    loading,
    error,
    isEnrolled,
    isSaved,
    userProgress,
    enrollInCourse,
    toggleSave,
    isLessonAccessible,
    refetch: fetchCourseDetails,
  };
};

export default useCourseDetails;