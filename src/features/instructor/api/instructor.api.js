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
const USE_MOCK = false;

const ENDPOINTS = {
  ALL_COURSES: '/Instructor/courses',
  COURSE_CREATE: '/Instructor/courses',
  COURSE_UPDATE: (id) => `/Instructor/courses/${id}`,
  COURSE_DELETE: (id) => `/Instructor/Courses/${id}`,
  COURSE_DETAILS: (id) => `/Instructor/Courses/${id}`,
  COURSE_SUBMIT_REVIEW: (id) => `Instructor/courses/${id}/submit-review`,
  COURSE_REVIEW_HISTORY: (id) => `Instructor/courses/${id}/submit-history`
};


// ============================================================================
// Course Management API
// ============================================================================

export const getInstructorCourses = async (page = 1, pageSize = 100) => {
  try {
    // Get all courses and filter by instructor (backend doesn't have dedicated endpoint yet)
    const response = await api.get(ENDPOINTS.ALL_COURSES, {
      params: { page, pageSize }
    });
    
    return response.data;
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
// Course Status (Mock until backend adds these endpoints)
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

