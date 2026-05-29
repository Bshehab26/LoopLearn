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
// Profile CRUD
// ============================================================================

export const getProfile = async () => {
  try {
    const response = await api.get(PROFILE_ENDPOINTS.BASE);
    const responseData = response.data;
    
    console.log('📥 Raw profile response:', responseData);
    
    // ✅ Handle both response formats:
    // Format 1: { success: true, data: { ... } }
    // Format 2: { username: "...", firstName: "...", ... } (direct)
    
    if (responseData?.success === true && responseData?.data) {
      // Wrapped format
      return responseData.data;
    }
    
    // Direct format (your backend)
    return responseData;
  } catch (error) {
    console.error('❌ Get profile error:', error);
    throw error;
  }
};

export const updateProfile = async (updates) => {
  try {
    const response = await api.put(PROFILE_ENDPOINTS.UPDATE, updates);
    return response.data;
  } catch (error) {
    console.error('❌ Update profile error:', error);
    throw error;
  }
};

export const changePassword = async (passwords) => {
  try {
    const response = await api.put(PROFILE_ENDPOINTS.CHANGE_PASSWORD, passwords);
    return response.data;
  } catch (error) {
    console.error('❌ Change password error:', error);
    throw error;
  }
};

export const updateAvatar = async (avatarUrl) => {
  try {
    const response = await api.put(PROFILE_ENDPOINTS.UPDATE_AVATAR, null, {
      params: { profileImageUrl: avatarUrl }
    });
    return response.data;
  } catch (error) {
    console.error('❌ Update avatar error:', error);
    throw error;
  }
};