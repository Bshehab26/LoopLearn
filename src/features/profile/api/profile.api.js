// src/features/profile/api/profile.api.js
import api from "../../../services/api/axios";
import { handleApiError } from "../../../services/api/errorHandler";

const PROFILE_ENDPOINTS = {
  BASE: "/Profile",
  UPDATE: "/Profile/update",
  CHANGE_PASSWORD: "/Profile/changePassword",
  UPDATE_AVATAR: "/Profile/update/avatar",
};

export const getProfile = async () => {
  try {
    const response = await api.get(PROFILE_ENDPOINTS.BASE);
    return response.data; // Return full response
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (updates) => {
  try {
    const response = await api.put(PROFILE_ENDPOINTS.UPDATE, updates);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (passwords) => {
  try {
    // Send all three fields as expected by the backend
    const response = await api.put(
      PROFILE_ENDPOINTS.CHANGE_PASSWORD,
      {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
        confirmPassword: passwords.confirmPassword
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      // Return the error response from backend
      return error.response.data;
    }
    throw error;
  }
};

export const updateAvatar = async (profileImageUrl) => {
  try {
    const response = await api.put(PROFILE_ENDPOINTS.UPDATE_AVATAR, null, {
      params: { profileImageUrl },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};