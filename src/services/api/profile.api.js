import api from "./axios";

export const getProfile = () => api.get("/profile");

export const updateProfile = (data) => api.put("/profile/update", data);

export const uploadAvatar = (formData) =>
  api.put("/profile/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const changePassword = (data) =>
  api.put("/profile/change-password", data);
