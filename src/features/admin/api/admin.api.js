// src/features/admin/api/admin.api.js

import api from '../../../services/api/axios';
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

/** GET /api/Admin/users */
export const getAdminUsers = async ({ role, page = 1, pageSize = 10 } = {}) => {
  try {
    const response = await api.get('/Admin/users', { params: { role, page, pageSize } });
    return { ...response.data, pagination: buildPagination(response.headers, page, pageSize) };
  } catch (error) {
    return handleApiError(error);
  }
};

/** GET /api/Admin/users/{id} */
export const getAdminUserById = async (userId) => {
  try {
    const response = await api.get(`/Admin/users/${userId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/** PATCH /api/Admin/users/{id}/status */
export const updateUserStatus = async (userId, payload) => {
  try {
    const response = await api.patch(`/Admin/users/${userId}/status`, payload);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/** PATCH /api/Admin/users/{id}/role */
export const updateUserRole = async (userId, payload) => {
  try {
    const response = await api.patch(`/Admin/users/${userId}/role`, payload);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/** GET /api/Admin/dashboard/stats */
export const getAdminDashboardStats = async () => {
  try {
    const response = await api.get('/Admin/dashboard/stats');
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/** GET /api/Admin/courses */
export const getAdminCourses = async ({ page = 1, pageSize = 10, status = null } = {}) => {
  try {
    const params = { page, pageSize };
    if (status) params.status = status;
    const response = await api.get('/Admin/courses', { params });
    return { ...response.data, pagination: buildPagination(response.headers, page, pageSize) };
  } catch (error) {
    return handleApiError(error);
  }
};

/** GET /api/Admin/courses/{id} — full CourseDetailDTO (sections, lessons, quizzes, tags, etc.) */
export const getAdminCourseById = async (courseId) => {
  try {
    const response = await api.get(`/Admin/courses/${courseId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/** GET /api/Admin/courses/pending */
export const getPendingCourses = async () => {
  try {
    const response = await api.get('/Admin/courses/pending');
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * GET /api/Admin/courses/{id}/review-history
 * Returns [ { id, action, comment, performedBy, performedAt } ] ordered
 * newest-first. action is "Approved" | "Rejected" (string from enum).
 */
export const getAdminCourseReviewHistory = async (courseId) => {
  try {
    const response = await api.get(`/Admin/courses/${courseId}/review-history`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/** POST /api/Admin/courses/{id}/approve */
export const approveCourse = async (courseId) => {
  try {
    const response = await api.post(`/Admin/courses/${courseId}/approve`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/** POST /api/Admin/courses/{id}/reject — payload: { comment: string } */
export const rejectCourse = async (courseId, comment) => {
  try {
    const response = await api.post(`/Admin/courses/${courseId}/reject`, { comment });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
