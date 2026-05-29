// src/features/student/api/enrollment.api.js
import api from '../../../services/api/axios';
import { handleApiError } from '../../../services/api/errorHandler';

// ============================================================================
// Constants
// ============================================================================

const ENROLLMENT_ENDPOINTS = {
  MY_COURSES: '/Enrollment/courses',
  ENROLL: (courseId) => `/Enrollment/courses/${courseId}`,
  UNENROLL: (courseId) => `/Enrollment/courses/${courseId}`,
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Calculate progress percentage from completed lessons
 * @param {number} completedLessons - Number of completed lessons
 * @param {number} totalLessons - Total lessons in course
 * @returns {number} Progress percentage
 */
const calculateProgress = (completedLessons, totalLessons) => {
  if (!totalLessons) return 0;
  return Math.round((completedLessons / totalLessons) * 100);
};

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get enrolled courses for current student
 * GET /api/Enrollment/courses
 */
export const getEnrolledCourses = async () => {
  try {
    const response = await api.get(ENROLLMENT_ENDPOINTS.MY_COURSES);
    return {
      success: response.data.success || true,
      data: response.data.data || [],
      message: response.data.message,
    };
  } catch (error) {
    console.error('❌ getEnrolledCourses error:', error);
    return handleApiError(error);
  }
};

/**
 * Enroll in a free course
 * POST /api/Enrollment/courses/{courseId}
 * @param {number} courseId - Course ID to enroll in
 */
export const enrollInCourse = async (courseId) => {
  try {
    const response = await api.post(ENROLLMENT_ENDPOINTS.ENROLL(courseId));
    return response.data;
  } catch (error) {
    console.error('❌ enrollInCourse error:', error);
    return handleApiError(error);
  }
};

/**
 * Unenroll from a free course
 * DELETE /api/Enrollment/courses/{courseId}
 * @param {number} courseId - Course ID to unenroll from
 */
export const unenrollFromCourse = async (courseId) => {
  try {
    const response = await api.delete(ENROLLMENT_ENDPOINTS.UNENROLL(courseId));
    return response.data;
  } catch (error) {
    console.error('❌ unenrollFromCourse error:', error);
    return handleApiError(error);
  }
};

/**
 * Get progress for a specific course
 * TODO: Implement when backend adds progress endpoint
 * @param {number} courseId - Course ID
 */
export const getCourseProgress = async (courseId) => {
  // Mock data until backend implements progress tracking
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    success: true,
    data: {
      courseId,
      completedLessons: 0,
      totalLessons: 0,
      percentage: 0,
      lastWatched: null,
    },
  };
  
  // TODO: When backend adds endpoint
  // try {
  //   const response = await api.get(`/Enrollment/progress/${courseId}`);
  //   return response.data;
  // } catch (error) {
  //   return handleApiError(error);
  // }
};

/**
 * Update lesson progress
 * TODO: Implement when backend adds progress endpoint
 * @param {number} courseId - Course ID
 * @param {number} lessonId - Lesson ID
 * @param {boolean} completed - Whether lesson is completed
 */
export const updateLessonProgress = async (courseId, lessonId, completed) => {
  // Mock until backend implements
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    success: true,
    message: 'Progress updated',
  };
  
  // TODO: When backend adds endpoint
  // try {
  //   const response = await api.put(`/Enrollment/progress/${courseId}/lesson/${lessonId}`, { completed });
  //   return response.data;
  // } catch (error) {
  //   return handleApiError(error);
  // }
};

/**
 * Get progress for multiple courses at once
 * @param {number[]} courseIds - Array of course IDs
 */
export const getMultipleCoursesProgress = async (courseIds) => {
  try {
    const results = {};
    for (const courseId of courseIds) {
      const progress = await getCourseProgress(courseId);
      if (progress.success) {
        results[courseId] = progress.data;
      }
    }
    return { success: true, data: results };
  } catch (error) {
    return handleApiError(error);
  }
};