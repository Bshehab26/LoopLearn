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

const UPLOAD_ENDPOINT = '/Upload';

// ============================================================================
// Avatar Upload Flow
// ============================================================================

/**
 * Step 1: Upload image to server
 * POST /api/Upload
 * Backend expects: multipart/form-data with fields "File" and "Type"
 */
export const uploadAvatarImage = async (file) => {
  if (!file || !(file instanceof File)) {
    return { success: false, message: 'Invalid file object' };
  }

  if (!file.type.startsWith('image/')) {
    return { success: false, message: 'Please select an image file' };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { success: false, message: 'Image must be less than 5MB' };
  }

  const formData = new FormData();
  formData.append('File', file);
  formData.append('Type', 'avatar');

  try {
    const response = await api.post(UPLOAD_ENDPOINT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    return handleApiError(error);
  }
};

/**
 * Step 2: Update profile with new avatar URL (direct URL update)
 * PUT /api/Profile/update/avatar?profileImageUrl={url}
 */
export const updateProfileAvatar = async (avatarUrl) => {
  if (!avatarUrl || typeof avatarUrl !== 'string') {
    return { success: false, message: 'Invalid avatar URL' };
  }

  try {
    const response = await api.put(PROFILE_ENDPOINTS.UPDATE_AVATAR, null, {
      params: { profileImageUrl: avatarUrl }
    });
    return response.data;
  } catch (error) {
    console.error('Update avatar error:', error);
    return handleApiError(error);
  }
};

/**
 * Complete avatar update (upload file + update profile)
 * Use this when you have a File object
 */
export const updateAvatar = async (file) => {
  try {
    const uploadResult = await uploadAvatarImage(file);
    
    if (!uploadResult.success) {
      return uploadResult;
    }

    if (!uploadResult.url) {
      return { success: false, message: 'Upload succeeded but no URL returned' };
    }

    const updateResult = await updateProfileAvatar(uploadResult.url);
    return updateResult;
  } catch (error) {
    console.error('Complete avatar update error:', error);
    return handleApiError(error);
  }
};

// ============================================================================
// Profile CRUD
// ============================================================================

export const getProfile = async () => {
  try {
    const response = await api.get(PROFILE_ENDPOINTS.BASE);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateProfile = async (updates) => {
  try {
    const response = await api.put(PROFILE_ENDPOINTS.UPDATE, updates);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const changePassword = async (passwords) => {
  try {
    const response = await api.put(PROFILE_ENDPOINTS.CHANGE_PASSWORD, passwords);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};