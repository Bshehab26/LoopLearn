// src/features/profile/api/profile.api.js
import api from "../../../services/api/axios";
import { handleApiError } from "../../../services/api/errorHandler"; // ✅ Added missing import

const PROFILE_ENDPOINTS = {
  BASE: "/Profile",
  UPDATE: "/Profile/update",
  CHANGE_PASSWORD: "/Profile/changePassword",
  UPDATE_AVATAR: "/Profile/update/avatar",
};

export const getProfile = async () => {
  try {
    const response = await api.get(PROFILE_ENDPOINTS.BASE);
    if (response.data.success) {
      return response.data.data;
    } else {
      return handleApiError(response);
    }
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateProfile = async (updates) => {
  try {
    const response = await api.put(PROFILE_ENDPOINTS.UPDATE, updates);
    if (response.data.success) {
      return response.data.data;
    } else {
      return handleApiError(response);
    }
  } catch (error) {
    return handleApiError(error);
  }
};

export const changePassword = async (passwords) => {
  try {
    const response = await api.put(
      PROFILE_ENDPOINTS.CHANGE_PASSWORD,
      passwords
    );
    if (response.data.success) {
      return response.data;
    } else {
      return handleApiError(response);
    }
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateAvatar = async (profileImageUrl) => {
  try {
    const response = await api.put(PROFILE_ENDPOINTS.UPDATE_AVATAR, null, {
      params: { profileImageUrl },
    });
    if (response.data.success) {
      return response.data.data;
    } else {
      return handleApiError(response);
    }
  } catch (error) {
    return handleApiError(error);
  }
};