// src/features/instructor/api/instructor.api.js

import api from '../../../services/api/axios';
import { handleApiError } from '../../../services/api/errorHandler';

// ============================================================================
// Constants
// ============================================================================
const ENDPOINTS = {
  ALL_COURSES: '/Instructor/courses',
  COURSE_CREATE: '/Instructor/courses',
  COURSE_UPDATE: (id) => `/Instructor/courses/${id}`,
  COURSE_TITLE_CATEGORY: (id) => `/Instructor/courses/${id}/title-category`,
  COURSE_DELETE: (id) => `/Instructor/courses/${id}`,
  COURSE_DETAILS: (id) => `/Instructor/courses/${id}`,
  COURSE_SUBMIT_REVIEW: (id) => `/Instructor/courses/${id}/submit-review`,
  COURSE_REVIEW_HISTORY: (id) => `/Instructor/courses/${id}/review-history`,
  INSTRUCTOR_STUDENTS: '/Instructor/students',
};

// ============================================================================
// Course Management API
// ============================================================================

export const getInstructorCourses = async (page = 1, pageSize = 100) => {
  try {
    const response = await api.get(ENDPOINTS.ALL_COURSES, {
      params: { page, pageSize }
    });

    if (response.status === 204 || !response.data?.data) {
      return {
        success: true,
        data: [],
        pagination: { totalCount: 0, pageNumber: page, pageSize },
        stats: { totalCourses: 0, totalEnrollments: 0, totalStudents: 0, totalRevenue: 0 }
      };
    }

    return {
      success: true,
      data: response.data.data || [],
      pagination: {
        totalCount: parseInt(response.headers['total-count'] || 0),
        pageNumber: parseInt(response.headers['page-number'] || page),
        pageSize: parseInt(response.headers['page-size'] || pageSize),
      },
      stats: {
        totalCourses: parseInt(response.headers['total-courses'] || 0),
        totalEnrollments: parseInt(response.headers['total-enrollments'] || 0),
        totalStudents: parseInt(response.headers['total-students'] || 0),
        totalRevenue: parseFloat(response.headers['total-revenue'] || 0),
      }
    };
  } catch (error) {
    console.error('[InstructorCourses] Get courses error:', error);
    return handleApiError(error);
  }
};

export const createCourse = async (courseData) => {
  try {
    const response = await api.post(ENDPOINTS.COURSE_CREATE, {
      title: courseData.title,
      category: courseData.category,
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getCourseById = async (courseId) => {
  try {
    const response = await api.get(ENDPOINTS.COURSE_DETAILS(courseId));
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// PATCH: Update course title and category (both fields are nullable, at least one required)
export const updateCourseTitleCategory = async (courseId, { title, category }) => {
  try {
    const payload = {};
    if (title !== undefined && title !== null) payload.title = title;
    if (category !== undefined && category !== null) payload.category = category;

    // Don't send empty request
    if (Object.keys(payload).length === 0) {
      return { success: false, message: 'No changes to save' };
    }

    const response = await api.patch(ENDPOINTS.COURSE_TITLE_CATEGORY(courseId), payload);
    return response.data;
  } catch (error) {
    console.error('[updateCourseTitleCategory] Error:', error);
    return handleApiError(error);
  }
};

// PUT: Full course update (all sections, tags, pricing, etc.)
export const updateCourse = async (courseId, courseData) => {
  try {
    console.log('[updateCourse] Sending update for course:', courseId);
    console.log('[updateCourse] Payload:', JSON.stringify(courseData, null, 2));

    const response = await api.put(ENDPOINTS.COURSE_UPDATE(courseId), courseData);

    console.log('[updateCourse] Response status:', response.status);
    console.log('[updateCourse] Response data:', response.data);

    return response.data;
  } catch (error) {
    console.error('[updateCourse] Error:', error);
    console.error('[updateCourse] Error response:', error.response?.data);
    return handleApiError(error);
  }
};

export const deleteCourse = async (courseId) => {
  try {
    const response = await api.delete(ENDPOINTS.COURSE_DELETE(courseId));
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// ============================================================================
// Course Status API
// ============================================================================

export const submitForReview = async (courseId) => {
  try {
    console.log('[submitForReview] Submitting course:', courseId);
    const response = await api.post(ENDPOINTS.COURSE_SUBMIT_REVIEW(courseId));

    console.log('[submitForReview] Success response:', response.data);

    return {
      success: true,
      message: response.data?.message || 'Course submitted for review successfully',
      data: response.data?.data
    };

  } catch (error) {
    console.error('[submitForReview] Error:', error);
    console.error('[submitForReview] Error response:', error.response);
    console.error('[submitForReview] Error data:', error.response?.data);

    let errorMessages = [];
    let mainMessage = 'Validation failed';

    const errorData = error.response?.data;

    if (errorData) {
      if (errorData.errors && Array.isArray(errorData.errors)) {
        errorMessages = errorData.errors;
        mainMessage = errorData.message || 'Please fix the following issues:';
      }
      else if (errorData.errors && typeof errorData.errors === 'object') {
        errorMessages = Object.values(errorData.errors).flat();
        mainMessage = errorData.message || 'Please fix the following issues:';
      }
      else if (errorData.message && typeof errorData.message === 'string') {
        if (errorData.message.includes('\n') || errorData.message.includes('•') || errorData.message.includes('-')) {
          errorMessages = errorData.message
            .split(/\n|•|-/)
            .map(m => m.trim())
            .filter(m => m.length > 0 && m.length < 200);
        } else {
          errorMessages = [errorData.message];
        }
        mainMessage = 'Course validation failed:';
      }
      else if (typeof errorData === 'string') {
        errorMessages = [errorData];
        mainMessage = 'Validation error:';
      }
    }

    if (errorMessages.length === 0 && error.message) {
      errorMessages = [error.message];
    }

    console.log('[submitForReview] Extracted error messages:', errorMessages);

    return {
      success: false,
      message: mainMessage,
      errors: errorMessages
    };
  }
};

export const getReviewHistory = async (courseId) => {
  try {
    const response = await api.get(ENDPOINTS.COURSE_REVIEW_HISTORY(courseId));
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// ============================================================================
// Student Management API
// ============================================================================

export const getInstructorStudents = async ({ courseId, page = 1, pageSize = 10, signal } = {}) => {
  try {
    const params = { page, pageSize };
    if (courseId) params.courseId = courseId;

    const response = await api.get(ENDPOINTS.INSTRUCTOR_STUDENTS, { params, signal });

    if (response.status === 204 || !response.data?.data || response.data.data.length === 0) {
      return {
        success: true,
        data: [],
        pagination: {
          totalCount: parseInt(response.headers['total-count'] || 0),
          pageNumber: page,
          pageSize
        }
      };
    }

    const studentsData = Array.isArray(response.data.data) ? response.data.data : [];

    const transformedRows = studentsData.flatMap(student => {
      const courses = Array.isArray(student.enrolledCourses) ? student.enrolledCourses : [];
      return courses.map(course => ({
        id: `${student.studentId}-${course.courseId}`,
        studentId: student.studentId,
        name: student.fullName || 'Unknown',
        email: student.email || '',
        avatar: student.profileImageUrl || null,
        courseId: course.courseId,
        courseName: course.courseTitle || '',
        progress: course.progressPercentage || 0,
        enrolledDate: course.enrolledAt,
        lastActivity: student.lastActivityAt || course.enrolledAt,
        certificateIssued: course.isCompleted || false,
        grade: calculateGrade(course.progressPercentage || 0),
        status: getStudentStatus(course),
        totalEnrolledCourses: student.totalEnrolledCourses || 0
      }));
    });

    return {
      success: true,
      data: transformedRows,
      pagination: {
        totalCount: parseInt(response.headers['total-count'] || studentsData.length),
        pageNumber: page,
        pageSize
      }
    };
  } catch (error) {
    console.error('[InstructorStudents] Get students error:', error);
    return {
      success: false,
      data: [],
      pagination: { totalCount: 0, pageNumber: page, pageSize },
      message: error.response?.data?.message || error.message || 'Failed to load students'
    };
  }
};

const calculateGrade = (progress) => {
  const p = progress || 0;
  if (p >= 90) return 'A+';
  if (p >= 85) return 'A';
  if (p >= 80) return 'A-';
  if (p >= 75) return 'B+';
  if (p >= 70) return 'B';
  if (p >= 65) return 'B-';
  if (p >= 60) return 'C+';
  if (p >= 55) return 'C';
  if (p >= 50) return 'C-';
  if (p >= 45) return 'D+';
  if (p >= 40) return 'D';
  return 'F';
};

const getStudentStatus = (enrollment) => {
  if (!enrollment) return 'inactive';
  if (enrollment.isCompleted) return 'completed';
  if (enrollment.progressPercentage > 0) return 'active';
  return 'inactive';
};

// ============================================================================
// Tags & Categories API with proper pagination header parsing
// ============================================================================

/**
 * Get tags with pagination support
 * Reads Total-Count, Page-Number, Page-Size from response headers
 * @param {number} page - Page number (default: 1)
 * @param {number} pageSize - Items per page (default: 50)
 * @returns {Promise<{success, data: Array, pagination: {totalCount, pageNumber, pageSize}, hasMore}>}
 */
export const getTags = async (page = 1, pageSize = 50) => {
  try {
    const response = await api.get('/Tag', { 
      params: { page, pageSize } 
    });

    const data = response.data?.data || [];
    const totalCount = parseInt(response.headers['total-count'] || response.headers['Total-Count'] || data.length);
    const currentPage = parseInt(response.headers['page-number'] || response.headers['Page-Number'] || page);
    const currentPageSize = parseInt(response.headers['page-size'] || response.headers['Page-Size'] || pageSize);

    return {
      success: true,
      data: data,
      pagination: {
        totalCount,
        pageNumber: currentPage,
        pageSize: currentPageSize,
      },
      hasMore: (currentPage * currentPageSize) < totalCount
    };
  } catch (error) {
    console.error('[getTags] Error:', error);
    return handleApiError(error);
  }
};

/**
 * Get all tags (loads all pages sequentially)
 * Use this when you need the complete tag list
 * @param {AbortSignal} signal - Optional abort signal for cancellation
 * @returns {Promise<{success, data: Array, totalCount}>}
 */
export const getAllTags = async (signal) => {
  try {
    const allTags = [];
    let page = 1;
    const pageSize = 100;
    let hasMore = true;

    while (hasMore && !signal?.aborted) {
      const response = await api.get('/Tag', { 
        params: { page, pageSize },
        signal 
      });

      const data = response.data?.data || [];
      const totalCount = parseInt(response.headers['total-count'] || response.headers['Total-Count'] || data.length);

      allTags.push(...data);

      hasMore = (page * pageSize) < totalCount && data.length === pageSize;
      page++;

      // Safety break
      if (page > 50) break;
    }

    if (signal?.aborted) {
      return { success: false, data: [], message: 'Request cancelled' };
    }

    return {
      success: true,
      data: allTags,
      totalCount: allTags.length
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      return { success: false, data: [], message: 'Request cancelled' };
    }
    console.error('[getAllTags] Error:', error);
    return handleApiError(error);
  }
};

/**
 * Get categories with pagination support
 * Reads Total-Count, Page-Number, Page-Size from response headers
 */
export const getCategories = async (page = 1, pageSize = 50) => {
  try {
    const response = await api.get('/Category', { 
      params: { page, pageSize } 
    });

    const data = response.data?.data || [];
    const totalCount = parseInt(response.headers['total-count'] || response.headers['Total-Count'] || data.length);
    const currentPage = parseInt(response.headers['page-number'] || response.headers['Page-Number'] || page);
    const currentPageSize = parseInt(response.headers['page-size'] || response.headers['Page-Size'] || pageSize);

    return {
      success: true,
      data: data,
      pagination: {
        totalCount,
        pageNumber: currentPage,
        pageSize: currentPageSize,
      },
      hasMore: (currentPage * currentPageSize) < totalCount
    };
  } catch (error) {
    console.error('[getCategories] Error:', error);
    return handleApiError(error);
  }
};

// ============================================================================
// Legacy/Compatibility exports
// ============================================================================

export const publishCourse = async (courseId) => {
  return submitForReview(courseId);
};

export const getDashboardStats = async () => {
  try {
    const coursesResult = await getInstructorCourses(1, 1);
    return {
      success: true,
      data: {
        totalCourses: coursesResult.stats?.totalCourses || 0,
        totalStudents: coursesResult.stats?.totalStudents || 0,
        totalRevenue: coursesResult.stats?.totalRevenue || 0,
        averageRating: 4.5
      }
    };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getEnrolledStudents = getInstructorStudents;