// src/features/courses/hooks/useCourseDetails.js
//
// FIXED:
//   • isEnrolled was being read from `localStorage.getItem('enrolled_{id}')`,
//     a flag that the real enroll/checkout flow never sets. Replaced with a
//     real check against GET /api/enrollment/courses.
//   • Added markEnrolled() — called by EnrollButton's onSuccess right after
//     a free enrollment succeeds, so the UI flips instantly instead of
//     waiting on a full refetch (which also caused a jarring full-page
//     loading flash).
//   • Removed the old mock enrollInCourse() — CourseDetails.jsx now uses the
//     real useEnrollment/useCheckout hooks directly for the sticky bar /
//     reviews CTA, same as EnrollButton does.

import { useState, useEffect, useCallback } from 'react';
import { getCourseById, calculateTotalDuration, calculateTotalLessons } from '../api/course.api';
import { getMyEnrollments } from '../../payment/api/payment.api';
import { useAuth } from '../../../store/AppProvider';

const useCourseDetails = (courseId) => {
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [userProgress, setUserProgress] = useState(null);

  // Real enrollment check — replaces the old localStorage mock.
  // NOTE: this is a pragmatic frontend-only fix (one extra round trip per
  // page load). The cleaner long-term fix is to have GET /api/courses/{id}
  // include an `isEnrolled` flag directly when the request is authenticated,
  // so this check isn't a separate call at all.
  const checkEnrollmentStatus = useCallback(async () => {
    if (!isAuthenticated || !courseId) {
      setIsEnrolled(false);
      return;
    }
    try {
      const res = await getMyEnrollments();
      const enrolled = res?.data?.some(
        (e) => String(e.courseId ?? e.CourseId) === String(courseId)
      );
      setIsEnrolled(!!enrolled);
    } catch {
      // Non-critical — don't wipe out known state on a transient network error.
    }
  }, [courseId, isAuthenticated]);

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

      const [response] = await Promise.all([
        getCourseById(courseId),
        checkEnrollmentStatus(),
      ]);

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
  }, [courseId, checkEnrollmentStatus]);

  // Called right after a real, confirmed free enrollment succeeds.
  // No network round-trip needed — the POST that just succeeded IS the proof.
  const markEnrolled = useCallback(() => {
    setIsEnrolled(true);
  }, []);


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
    userProgress,
    markEnrolled,
    checkEnrollmentStatus,
    isLessonAccessible,
    refetch: fetchCourseDetails,
  };
};

export default useCourseDetails;