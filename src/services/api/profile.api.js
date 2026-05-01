// src/services/api/profile.api.js

import api from "./axios";

/**
 * GET /api/Student/Profile
 */
export const getProfile = () => api.get("/Student/Profile");

/**
 * PUT /api/Student/Profile/update
 * Backend expects: { firstName, lastName, email, phone }  ← PascalCase mapped by ASP.NET
 */
export const updateProfile = (data) =>
  api.put("/Student/Profile/update", {
    firstName: data.fName,
    lastName:  data.lName,
    email:     data.email,
    phone:     data.phone,
  });

/**
 * PUT /api/Student/Profile/password
 * Body: { oldPassword, newPassword }
 */
export const changePassword = (data) => api.put("/Student/Profile/password", data);

/**
 * PUT /api/Student/Profile/avatar
 * Converts File → base64 then sends { avatar: base64String }
 */
export const uploadAvatar = (formData) => {
  const file = formData.get("avatar");
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result;
        await api.put("/Student/Profile/avatar", { avatar: base64 });
        resolve({ data: { avatar: base64 } });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};