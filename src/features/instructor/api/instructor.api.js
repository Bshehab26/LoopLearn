/**
 * instructor.api.js
 * Instructor API service for course management
 * 
 * @module features/instructor/api/instructor.api
 */

import api from '../../../services/api/axios';
import { handleApiError, createApiResponse } from '../../../services/api/errorHandler';

// ============================================================================
// Constants
// ============================================================================

const ENDPOINTS = {
  COURSE_CREATE: '/Course/create',
  COURSE_UPDATE: (id) => `/Course/${id}`,
  COURSE_DELETE: (id) => `/Course/${id}`,
  COURSE_DETAILS: (id) => `/Course/${id}`,
  ALL_COURSES: '/Course/all',
  CATEGORIES: '/Category',
  UPLOAD: '/Upload',
};

// Use mock data until backend is ready (set to false when backend endpoints are ready)
const USE_MOCK = false;

// ============================================================================
// Categories API
// ============================================================================

export const getCategories = async () => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      success: true,
      data: [
        { id: 1, name: 'Web Development', description: 'Build websites and web applications' },
        { id: 2, name: 'Mobile Development', description: 'Create iOS and Android apps' },
        { id: 3, name: 'Data Science', description: 'Analyze data and build AI models' },
        { id: 4, name: 'UI/UX Design', description: 'Design beautiful user interfaces' },
        { id: 5, name: 'Cybersecurity', description: 'Protect systems and networks' },
        { id: 6, name: 'DevOps', description: 'Automate deployment and infrastructure' },
        { id: 7, name: 'Cloud Computing', description: 'AWS, Azure, Google Cloud' },
        { id: 8, name: 'Game Development', description: 'Create games with Unity/Unreal' },
        { id: 9, name: 'Business', description: 'Entrepreneurship and management' },
        { id: 10, name: 'Marketing', description: 'Digital marketing and SEO' },
      ]
    };
  }
  
  try {
    const response = await api.get(ENDPOINTS.CATEGORIES);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// ============================================================================
// Course Management API
// ============================================================================

export const getInstructorCourses = async (page = 1, pageSize = 100) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockCourses = [
      { id: 1, title: 'React Masterclass', category: 'Web Development', status: 'published', createdAt: '2024-05-01', updatedAt: '2024-05-15', duration: 10, price: 49.99 },
      { id: 2, title: 'Python for Data Science', category: 'Data Science', status: 'draft', createdAt: '2024-05-10', updatedAt: '2024-05-10', duration: 15, price: 0 },
    ];
    return createApiResponse(mockCourses, true);
  }
  
  try {
    // Get all courses and filter by instructor (backend doesn't have dedicated endpoint yet)
    const response = await api.get(ENDPOINTS.ALL_COURSES, {
      params: { page, pageSize }
    });
    
    if (response.data.success) {
      // TODO: When backend adds instructor filtering, replace with dedicated endpoint
      // For now, return all courses (instructor ID is in token but not in response)
      return createApiResponse(response.data.data || [], true);
    }
    return createApiResponse([], false, response.data.message);
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

export const uploadCourseThumbnail = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'course-thumbnail');

  try {
    const response = await api.post(ENDPOINTS.UPLOAD, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// ============================================================================
// Course Status (Mock until backend adds these endpoints)
// ============================================================================

export const publishCourse = async (courseId) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return createApiResponse(null, true, 'Course published successfully');
  }
  
  // TODO: When backend adds publish endpoint
  try {
    const response = await api.put(ENDPOINTS.COURSE_UPDATE(courseId), { status: 'published' });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const submitForReview = async (courseId) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return createApiResponse(null, true, 'Course submitted for review');
  }
  
  // TODO: When backend adds submit-for-review endpoint
  try {
    const response = await api.post(`/Course/${courseId}/submit-review`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// ============================================================================
// Dashboard API (Mock - needs backend)
// ============================================================================

export const getDashboardStats = async () => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 400));
    return createApiResponse({
      totalCourses: 0,
      totalStudents: 0,
      totalRevenue: 0,
      totalEnrollments: 0,
    }, true);
  }
  
  try {
    const response = await api.get('/Instructor/dashboard');
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getEnrolledStudents = async (courseId = null) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockStudents = [
      { id: 1, name: 'Ahmed Hassan', email: 'ahmed@example.com', progress: 75, enrolledAt: '2024-01-15', lastActive: '2024-03-20' },
      { id: 2, name: 'Sara Mohamed', email: 'sara@example.com', progress: 45, enrolledAt: '2024-02-01', lastActive: '2024-03-18' },
      { id: 3, name: 'Omar Ali', email: 'omar@example.com', progress: 90, enrolledAt: '2024-01-10', lastActive: '2024-03-21' },
    ];
    return createApiResponse(mockStudents, true);
  }
  
  try {
    const params = courseId ? { courseId } : {};
    const response = await api.get('/Instructor/students', { params });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// ============================================================================
// Exports
// ============================================================================

export default {
  getCategories,
  getInstructorCourses,
  createCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
  publishCourse,
  submitForReview,
  getDashboardStats,
  getEnrolledStudents,
  uploadCourseThumbnail,
};