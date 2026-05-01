import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7215/api", // ✅ HTTP for local dev
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// ✅ FIX: Read token from "user" object — single source of truth with AppContext
api.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  } catch {
    // Corrupt storage — skip attaching token
  }
  return config;
});

// ✅ FIX: Auto-logout on 401 (expired/invalid token mid-session)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default api;