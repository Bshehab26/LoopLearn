import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7215/api", // ✅ HTTP not HTTPS
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // keep false unless needed
});

export default api;