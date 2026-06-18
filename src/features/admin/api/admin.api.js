// src/features/admin/api/admin.api.js

import api from '../../../services/api/axios';  // ✅ Fixed: Use 'api' not 'axiosClient'
import { handleApiError } from '../../../services/api/errorHandler';

// The backend returns pagination info in response headers, not the JSON body
// (Total-Count / Page-Number / Page-Size) — see AdminController.cs.
const buildPagination = (headers, fallbackPage, fallbackPageSize) => {
  const totalCount = Number(headers?.['total-count'] ?? 0);
  const pageSize = Number(headers?.['page-size'] ?? fallbackPageSize);
  const page = Number(headers?.['page-number'] ?? fallbackPage);
  const totalPages = pageSize > 0 ? Math.max(1, Math.ceil(totalCount / pageSize)) : 1;
  return { totalCount, pageSize, page, totalPages };
};

/**
 * GET /api/Admin/users
 * @param {{ role?: string, page?: number, pageSize?: number }} params
 * @returns {Promise<{ success: boolean, data: Array, pagination: object }>}
 */
export const getAdminUsers = async ({ role, page = 1, pageSize = 10 } = {}) => {
  try {
    const response = await api.get('/Admin/users', {  // ✅ Fixed: /Admin/users
      params: { role, page, pageSize },
    });
    return {
      ...response.data,
      pagination: buildPagination(response.headers, page, pageSize),
    };
  } catch (error) {
    console.error('[AdminAPI] getAdminUsers error:', error);
    return handleApiError(error);
  }
};

/**
 * GET /api/Admin/users/{id}
 * @returns {Promise<{ success: boolean, data: object }>}
 */
export const getAdminUserById = async (userId) => {
  try {
    const response = await api.get(`/Admin/users/${userId}`);  // ✅ Fixed
    return response.data;
  } catch (error) {
    console.error('[AdminAPI] getAdminUserById error:', error);
    return handleApiError(error);
  }
};

/**
 * PATCH /api/Admin/users/{id}/status — ban or unban a user.
 * @param {string} userId
 * @param {{ isBanned: boolean, reason?: string }} payload
 */
export const updateUserStatus = async (userId, payload) => {
  try {
    const response = await api.patch(`/Admin/users/${userId}/status`, payload);  // ✅ Fixed
    return response.data;
  } catch (error) {
    console.error('[AdminAPI] updateUserStatus error:', error);
    return handleApiError(error);
  }
};

/**
 * PATCH /api/Admin/users/{id}/role
 * @param {string} userId
 * @param {{ newRole: string }} payload
 */
export const updateUserRole = async (userId, payload) => {
  try {
    const response = await api.patch(`/Admin/users/${userId}/role`, payload);  // ✅ Fixed
    return response.data;
  } catch (error) {
    console.error('[AdminAPI] updateUserRole error:', error);
    return handleApiError(error);
  }
};

/**
 * GET /api/Admin/dashboard/stats
 * Returns { courseStats, userStats, enrollmentStats, paymentStats }
 */
export const getAdminDashboardStats = async () => {
  try {
    const response = await api.get('/Admin/dashboard/stats');  // ✅ Fixed
    return response.data;
  } catch (error) {
    console.error('[AdminAPI] getAdminDashboardStats error:', error);
    return handleApiError(error);
  }
};

/**
 * GET /api/Admin/courses
 * Gets all courses with optional status filter
 */
export const getAdminCourses = async ({ page = 1, pageSize = 10, status = null } = {}) => {
  try {
    const params = { page, pageSize };
    if (status) params.status = status;
    
    const response = await api.get('/Admin/courses', { params });  // ✅ Fixed
    return {
      ...response.data,
      pagination: buildPagination(response.headers, page, pageSize),
    };
  } catch (error) {
    console.error('[AdminAPI] getAdminCourses error:', error);
    return handleApiError(error);
  }
};

/**
 * GET /api/Admin/courses/{id}
 */
export const getAdminCourseById = async (courseId) => {
  try {
    const response = await api.get(`/Admin/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('[AdminAPI] getAdminCourseById error:', error);
    return handleApiError(error);
  }
};

/**
 * GET /api/Admin/courses/pending
 */
export const getPendingCourses = async () => {
  try {
    const response = await api.get('/Admin/courses/pending');
    return response.data;
  } catch (error) {
    console.error('[AdminAPI] getPendingCourses error:', error);
    return handleApiError(error);
  }
};

/**
 * POST /api/Admin/courses/{id}/approve
 */
export const approveCourse = async (courseId) => {
  try {
    const response = await api.post(`/Admin/courses/${courseId}/approve`);
    return response.data;
  } catch (error) {
    console.error('[AdminAPI] approveCourse error:', error);
    return handleApiError(error);
  }
};

/**
 * POST /api/Admin/courses/{id}/reject
 */
export const rejectCourse = async (courseId, comment) => {
  try {
    const response = await api.post(`/Admin/courses/${courseId}/reject`, { comment });
    return response.data;
  } catch (error) {
    console.error('[AdminAPI] rejectCourse error:', error);
    return handleApiError(error);
  }
};