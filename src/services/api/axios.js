// src/services/api/axios.js
import axios from 'axios';
import { storage } from '../utils/storage';

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_BASE_URL = 'https://localhost:7244/api';
const DEFAULT_TIMEOUT = 30000;

const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
};

const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  SERVER_ERROR_MIN: 500,
};

const ROUTES = {
  SIGN_IN: '/signin',
};

// ============================================================================
// Configuration
// ============================================================================

const getBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL;
};

const getTimeout = () => {
  const timeout = parseInt(import.meta.env.VITE_API_TIMEOUT);
  return isNaN(timeout) ? DEFAULT_TIMEOUT : timeout;
};

// ============================================================================
// Axios Instance
// ============================================================================

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: getTimeout(),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false,
});

// ============================================================================
// Token Extraction Helpers
// ============================================================================

const extractToken = () => {
  const user = storage.getUser();
  if (user?.token) return user.token;

  const directToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (directToken) return directToken;

  const sessionUser = sessionStorage.getItem(STORAGE_KEYS.USER);
  if (sessionUser) {
    try {
      const parsed = JSON.parse(sessionUser);
      if (parsed?.token) return parsed.token;
    } catch {
      // Invalid JSON, ignore
    }
  }

  return null;
};

const clearAuthData = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.USER);
  sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
};

const isOnSignInPage = () => {
  return window.location.pathname.includes(ROUTES.SIGN_IN);
};

const redirectToSignIn = () => {
  if (!isOnSignInPage()) {
    window.location.href = ROUTES.SIGN_IN;
  }
};

// ============================================================================
// Logging Helpers
// ============================================================================

const isDevelopment = import.meta.env.DEV;

const logDebug = (message, ...args) => {
  if (isDevelopment) console.debug(`[API] ${message}`, ...args);
};

const logWarning = (message, ...args) => {
  if (isDevelopment) console.warn(`[API] ${message}`, ...args);
};

const logError = (message, ...args) => {
  console.error(`[API] ${message}`, ...args);
};

// ============================================================================
// Request Interceptor
// ============================================================================

api.interceptors.request.use(
  (config) => {
    try {
      if (isDevelopment) {
        console.log(`[AXIOS] 🚀 ${config.method?.toUpperCase()} ${config.url}`);
      }
      
      const token = extractToken();
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // FIXED: Check both capital and lowercase Auth
        const isAuthEndpoint = config.url?.includes('/Auth/') || config.url?.includes('/auth/');
        if (!isAuthEndpoint && isDevelopment) {
          logWarning('No token found for request:', config.url);
        }
      }
    } catch (error) {
      logError('Request interceptor error:', error);
    }
    
    return config;
  },
  (error) => {
    logError('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ============================================================================
// Response Interceptor
// ============================================================================

api.interceptors.response.use(
  (response) => {
    if (isDevelopment) {
      console.log(`[AXIOS] ✅ ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    const { response } = error;
    const status = response?.status;
    const data = response?.data;

    logError(`[AXIOS] ❌ ${status} ${error.config?.url}`, data?.message || data?.Message || error.message);

    if (status === HTTP_STATUS.UNAUTHORIZED) {
      logWarning('401 Unauthorized - Clearing auth data');
      clearAuthData();
      redirectToSignIn();
    }

    if (status === HTTP_STATUS.FORBIDDEN) {
      logError('403 Forbidden - Insufficient permissions');
    }

    if (status >= HTTP_STATUS.SERVER_ERROR_MIN) {
      logError(`Server error (${status}) - Please try again later`);
    }

    return Promise.reject(error);
  }
);

// ============================================================================
// Exports
// ============================================================================

export default api;