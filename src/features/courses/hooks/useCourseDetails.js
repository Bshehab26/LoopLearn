// src/features/courses/hooks/useCourseDetails.js
import { useState, useEffect, useCallback } from 'react';
import { getCourseById, calculateTotalDuration, calculateTotalLessons } from '../api/course.api';

// ============================================================================
// Hook
// ============================================================================

/**
 * useCourseDetails - Hook for fetching and managing single course details
 */
const useCourseDetails = (courseId) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);

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
        };
        
        setCourse(enhancedCourse);
        
        // Set default active section/lesson
        if (enhancedCourse.sections?.length > 0) {
          const firstSection = enhancedCourse.sections[0];
          setActiveSection(firstSection);
          
          if (firstSection.lessons?.length > 0) {
            setActiveLesson(firstSection.lessons[0]);
          }
        }
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

  // Set active section and reset lesson
  const setActiveSectionHandler = useCallback((section) => {
    setActiveSection(section);
    // Reset to first lesson of new section
    if (section?.lessons?.length > 0) {
      setActiveLesson(section.lessons[0]);
    } else {
      setActiveLesson(null);
    }
  }, []);

  // Set active lesson
  const setActiveLessonHandler = useCallback((lesson) => {
    setActiveLesson(lesson);
  }, []);

  // Check if user is enrolled
  const isEnrolled = useCallback(() => {
    // This will be connected to enrollment API later
    return course?.isEnrolled || false;
  }, [course]);

  // Get progress percentage
  const getProgress = useCallback(() => {
    // This will be connected to progress tracking API later
    return course?.progress || 0;
  }, [course]);

  // Fetch on mount or courseId change
  useEffect(() => {
    fetchCourseDetails();
  }, [fetchCourseDetails]);

  return {
    course,
    loading,
    error,
    activeSection,
    activeLesson,
    setActiveSection: setActiveSectionHandler,
    setActiveLesson: setActiveLessonHandler,
    isEnrolled,
    getProgress,
    refetch: fetchCourseDetails,
  };
};

export default useCourseDetails;