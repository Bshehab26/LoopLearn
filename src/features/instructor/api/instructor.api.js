// src/features/instructor/api/instructor.api.js

import api from '../../../services/api/axios';
import { handleApiError, createApiResponse } from '../../../services/api/errorHandler';

// ============================================================================
// Constants
// ============================================================================
const USE_MOCK = false;

const ENDPOINTS = {
  ALL_COURSES: '/Instructor/courses',
  COURSE_CREATE: '/Instructor/courses',
  COURSE_UPDATE: (id) => `/Instructor/courses/${id}`,
  COURSE_DELETE: (id) => `/Instructor/courses/${id}`,
  COURSE_DETAILS: (id) => `/Instructor/courses/${id}`,
  COURSE_SUBMIT_REVIEW: (id) => `/Instructor/courses/${id}/submit-review`,
  COURSE_REVIEW_HISTORY: (id) => `/Instructor/courses/${id}/review-history`,
  // Student endpoints
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
    
    // Handle 204 No Content
    if (response.status === 204 || !response.data?.data) {
      return {
        success: true,
        data: [],
        pagination: { totalCount: 0, pageNumber: page, pageSize: pageSize },
        stats: {
          totalCourses: 0,
          totalEnrollments: 0,
          totalStudents: 0,
          totalRevenue: 0,
        }
      };
    }
    
    return {
      success: true,
      data: response.data.data || [],
      pagination: response.data._pagination || { totalCount: 0, pageNumber: page, pageSize: pageSize },
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

export const updateCourse = async (courseId, courseData) => {
  try {
    const response = await api.put(ENDPOINTS.COURSE_UPDATE(courseId), courseData);
    return response.data;
  } catch (error) {
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
    const response = await api.post(ENDPOINTS.COURSE_SUBMIT_REVIEW(courseId));
    return response.data;
  } catch (error) {
    return handleApiError(error);
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

/**
 * Get enrolled students for the instructor
 * @param {Object} params - Query parameters
 * @param {number} params.courseId - Filter by course ID (optional)
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.pageSize - Items per page (default: 10)
 * @param {AbortSignal} params.signal - Abort controller signal
 * @returns {Promise<Object>} Student data with pagination
 */
export const getInstructorStudents = async ({ courseId, page = 1, pageSize = 10, signal } = {}) => {
  try {
    const params = { page, pageSize };
    if (courseId) params.courseId = courseId;
    
    const response = await api.get(ENDPOINTS.INSTRUCTOR_STUDENTS, { params, signal });
    
    // Handle 204 No Content - no students found
    if (response.status === 204 || !response.data?.data || response.data.data.length === 0) {
      return {
        success: true,
        data: [],
        pagination: {
          totalCount: 0,
          pageNumber: page,
          pageSize: pageSize
        }
      };
    }
    
    // Ensure response.data.data is an array
    const studentsData = Array.isArray(response.data.data) ? response.data.data : [];
    
    // Transform backend data to match frontend expected format
    const transformedStudents = studentsData.map(student => ({
      id: student.studentId,
      name: student.fullName || 'Unknown',
      email: student.email || '',
      phone: student.phone || '',
      avatar: student.profileImageUrl || null,
      enrolledDate: student.enrolledCourses?.[0]?.enrolledAt || new Date().toISOString(),
      lastActivity: student.lastActivityAt || student.enrolledCourses?.[0]?.enrolledAt || new Date().toISOString(),
      progress: student.enrolledCourses?.[0]?.progressPercentage || 0,
      completedLessons: 0, // Backend doesn't provide this yet
      totalLessons: 0, // Would need separate endpoint
      certificateIssued: student.enrolledCourses?.[0]?.isCompleted || false,
      grade: calculateGrade(student.enrolledCourses?.[0]?.progressPercentage || 0),
      courseId: student.enrolledCourses?.[0]?.courseId,
      courseName: student.enrolledCourses?.[0]?.courseTitle || '',
      status: getStudentStatus(student.enrolledCourses?.[0]),
      totalEnrolledCourses: student.totalEnrolledCourses || 0
    }));
    
    // Get pagination info from response headers or data
    const paginationInfo = response.data._pagination || {
      totalCount: parseInt(response.headers['total-count'] || transformedStudents.length),
      pageNumber: page,
      pageSize: pageSize
    };
    
    return {
      success: true,
      data: transformedStudents,
      pagination: paginationInfo
    };
  } catch (error) {
    console.error('[InstructorStudents] Get students error:', error);
    // Return empty array instead of throwing
    return {
      success: false,
      data: [],
      pagination: {
        totalCount: 0,
        pageNumber: page,
        pageSize: pageSize
      },
      message: error.response?.data?.message || error.message || 'Failed to load students'
    };
  }
};

/**
 * Helper: Calculate grade based on progress percentage
 */
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

/**
 * Helper: Determine student status based on enrollment data
 */
const getStudentStatus = (enrollment) => {
  if (!enrollment) return 'inactive';
  if (enrollment.isCompleted) return 'completed';
  if (enrollment.progressPercentage > 0) return 'active';
  return 'inactive';
};

// ============================================================================
// Legacy/Compatibility exports (for existing code)
// ============================================================================

export const getCategories = async () => {
  try {
    const response = await api.get('/Category');
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

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