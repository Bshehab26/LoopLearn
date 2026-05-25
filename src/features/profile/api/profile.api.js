// src/features/profile/api/profile.api.js
import api from '../../../services/api/axios';
import { handleApiError } from '../../../services/api/errorHandler';

// ============================================================================
// Constants
// ============================================================================

const PROFILE_ENDPOINTS = {
  BASE: '/Profile',
  UPDATE: '/Profile/update',
  CHANGE_PASSWORD: '/Profile/changePassword',
  UPDATE_AVATAR: '/Profile/update/avatar',
};

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get current user profile
 * GET /api/Profile
 */
export const getProfile = async () => {
  try {
    const response = await api.get(PROFILE_ENDPOINTS.BASE);
    return response.data; // Backend returns { success, message, data }
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Update user profile
 * PUT /api/Profile/update
 * @param {Object} updates - { firstName, lastName, email, phone }
 */
export const updateProfile = async (updates) => {
  try {
    const response = await api.put(PROFILE_ENDPOINTS.UPDATE, updates);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Change user password
 * PUT /api/Profile/changePassword
 * @param {Object} passwords - { oldPassword, newPassword, confirmPassword }
 */
export const changePassword = async (passwords) => {
  try {
    const response = await api.put(PROFILE_ENDPOINTS.CHANGE_PASSWORD, passwords);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Update user avatar
 * PUT /api/Profile/update/avatar?profileImageUrl=url
 * @param {string} avatarUrl - URL of the avatar image
 */
export const updateAvatar = async (avatarUrl) => {
  try {
    const response = await api.put(PROFILE_ENDPOINTS.UPDATE_AVATAR, null, {
      params: { profileImageUrl: avatarUrl }
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};