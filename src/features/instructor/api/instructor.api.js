/**
 * instructor.api.js
 * Instructor course management API
 * 
 * @module features/instructor/api/instructor.api
 */

import api from '../../../services/api/axios';
import { handleApiError, createApiResponse } from '../../../services/api/errorHandler';

// ============================================================================
// Constants
// ============================================================================

const ENDPOINTS = {
  COURSES: '/Instructor/courses',
  COURSE: '/Instructor/course',
  COURSE_DETAILS: '/Instructor/course',
};

export const COURSE_LEVELS = [
  { value: 0, label: 'Beginner', description: 'No prior knowledge needed' },
  { value: 1, label: 'Intermediate', description: 'Some basic knowledge required' },
  { value: 2, label: 'Advanced', description: 'In-depth knowledge expected' },
  { value: 3, label: 'Expert', description: 'Professional level' },
];

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get all courses for the instructor
 */
export const getInstructorCourses = async (page = 1, pageSize = 10) => {
  try {
    const response = await api.get(ENDPOINTS.COURSES, {
      params: { page, pageSize }
    });
    return createApiResponse(response.data, true);
  } catch (error) {
    console.error('[InstructorCourses] Get courses error:', error);
    return handleApiError(error);
  }
};

/**
 * Create a new course (draft)
 */
export const addCourse = async (courseData) => {
  try {
    const payload = {
      title: courseData.title,
      category: courseData.category,
      duration: courseData.duration,
      description: courseData.description || '',
      price: courseData.price || 0,
      level: courseData.level || 0,
      avatar: courseData.avatar || null,
    };
    
    console.log('[InstructorCourses] Creating course:', payload);
    
    const response = await api.post(ENDPOINTS.COURSE, payload);
    return createApiResponse(response.data, true, 'Course created successfully');
  } catch (error) {
    console.error('[InstructorCourses] Create course error:', error);
    return handleApiError(error);
  }
};

/**
 * Get a single course by ID (for editing)
 */
export const getCourseById = async (courseId) => {
  try {
    const response = await api.get(`${ENDPOINTS.COURSE_DETAILS}/${courseId}`);
    return createApiResponse(response.data, true);
  } catch (error) {
    console.error('[InstructorCourses] Get course error:', error);
    return handleApiError(error);
  }
};

/**
 * Update an existing course
 */
export const updateCourse = async (courseId, courseData) => {
  try {
    const payload = {
      title: courseData.title,
      category: courseData.category,
      duration: courseData.duration,
      description: courseData.description,
      price: courseData.price,
      level: courseData.level,
      avatar: courseData.avatar,
    };
    
    const response = await api.put(`${ENDPOINTS.COURSE}/${courseId}`, payload);
    return createApiResponse(response.data, true, 'Course updated successfully');
  } catch (error) {
    console.error('[InstructorCourses] Update course error:', error);
    return handleApiError(error);
  }
};

/**
 * Delete a course
 */
export const deleteCourse = async (courseId) => {
  try {
    const response = await api.delete(`${ENDPOINTS.COURSE}/${courseId}`);
    return createApiResponse(null, true, 'Course deleted successfully');
  } catch (error) {
    console.error('[InstructorCourses] Delete course error:', error);
    return handleApiError(error);
  }
};

/**
 * Upload course thumbnail/avatar
 */
export const uploadCourseAvatar = async (courseId, file) => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.post(`${ENDPOINTS.COURSE}/${courseId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return createApiResponse(response.data, true, 'Course image updated');
  } catch (error) {
    console.error('[InstructorCourses] Upload avatar error:', error);
    return handleApiError(error);
  }
};