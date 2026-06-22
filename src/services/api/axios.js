// src/services/api/axios.js

import axios from 'axios';
import { getToken, removeToken } from '../utils/tokenUtils';

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

const isOnSignInPage = () => {
  return window.location.pathname.includes(ROUTES.SIGN_IN);
};

const redirectToSignIn = () => {
  if (!isOnSignInPage()) {
    window.location.href = ROUTES.SIGN_IN;
  }
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

const clearAuthData = () => {
  removeToken();
};

// ============================================================================
// Helper: Check if URL belongs to our API - FIXED
// ============================================================================

const isOurApiUrl = (url) => {
  if (!url) return false;
  
  const urlLower = url.toLowerCase();
  
  // ========================================================================
  // STEP 1: ULTRA AGGRESSIVE EXCLUSION - Check YouTube FIRST
  // ========================================================================
  
  const absoluteExcludes = [
    'youtube.com',
    'youtu.be',
    'googlevideo.com',
    'ytimg.com',
    'yt3.ggpht.com',
    'ggpht.com',
    'youtube-nocookie.com',
    'yt3.googleapis.com',
    'youtube.googleapis.com',
    's.youtube.com',
    'i.ytimg.com',
    'jnn-pa.googleapis.com',
    'google.com',
    'googleapis.com',
    'gstatic.com',
    'doubleclick.net',
    'googlesyndication.com',
    'google-analytics.com',
    'googletagmanager.com',
    'googleads.g.doubleclick.net',
    'cloudflare.com',
    'cloudfront.net',
    'cdnjs.cloudflare.com',
    'unpkg.com',
    'jsdelivr.net',
    'stackpathcdn.com',
    'facebook.com',
    'fbcdn.net',
    'twitter.com',
    'twimg.com',
    'linkedin.com',
    'instagram.com',
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'use.fontawesome.com',
    'vimeo.com',
    'vimeocdn.com',
    'dailymotion.com',
    'wistia.com',
    'wistia.net',
    'hotjar.com',
    'hotjar.io',
    'mixpanel.com',
    'segment.com',
    'jwplayer.com',
    'jwplatform.com',
    'brightcove.com',
    'brightcove.net',
  ];
  
  for (const domain of absoluteExcludes) {
    if (urlLower.includes(domain)) {
      if (isDevelopment) {
        console.log(`[API] ⏭️ EXCLUDED: ${domain} - NOT our API`);
      }
      return false;
    }
  }
  
  // ========================================================================
  // STEP 2: Exclude based on URL patterns (static resources, etc.)
  // ========================================================================
  
  const excludedPatterns = [
    '.js',
    '.css',
    '.png',
    '.jpg',
    '.jpeg',
    '.svg',
    '.ico',
    '.woff',
    '.woff2',
    '.ttf',
    '.eot',
    '.gif',
    '.webp',
    '.mp4',
    '.webm',
    '.ogv',
    '.jsonp',
    'manifest.json',
    'favicon',
    'node_modules',
    '@vite',
    '?v=',
    '?ver=',
    '?version=',
    'hot-update',
    'sockjs',
    'websocket',
    'ws://',
    'wss://',
    'chrome-extension',
    'moz-extension',
    'blob:',
    'data:',
    'javascript:',
    '.map',
    '.min.js',
    '.min.css',
  ];
  
  for (const pattern of excludedPatterns) {
    if (urlLower.includes(pattern)) {
      if (isDevelopment) {
        console.log(`[API] ⏭️ EXCLUDED pattern: ${pattern} - NOT our API`);
      }
      return false;
    }
  }
  
  // ========================================================================
  // STEP 3: Check if it's our API - FIXED to handle /Tag without trailing slash
  // ========================================================================
  
  const baseUrl = getBaseUrl();
  
  // Check if URL contains our base URL
  if (url.includes(baseUrl) || url.includes('localhost:7244')) {
    if (isDevelopment) {
      console.log(`[API] ✅ URL contains base URL: ${url} - treating as our API`);
    }
    return true;
  }
  
  // If the URL starts with /, it's a relative path
  if (url.startsWith('/')) {
    // Check if it matches our API patterns - FIXED to handle both with and without trailing slash
    const apiPatterns = [
      // Auth
      '/Auth',
      '/auth',
      // Profile
      '/Profile',
      '/profile',
      // Course
      '/Course',
      '/course',
      // Instructor
      '/Instructor',
      '/instructor',
      // Admin
      '/Admin',
      '/admin',
      // Category
      '/Category',
      '/category',
      // Tag - ADDED
      '/Tag',
      '/tag',
      // Payment
      '/Payment',
      '/payment',
      // Enrollment
      '/Enrollment',
      '/enrollment',
       '/Student', '/student',
      // Upload
      '/Upload',
      '/upload',
      // API root
      '/api',
    ];
    
    // Check exact match or starts with pattern (with slash after)
    for (const pattern of apiPatterns) {
      const patternLower = pattern.toLowerCase();
      // Check if URL exactly matches pattern or starts with pattern/ or pattern?
      if (urlLower === patternLower || 
          urlLower.startsWith(patternLower + '/') ||
          urlLower.startsWith(patternLower + '?')) {
        if (isDevelopment) {
          console.log(`[API] ✅ API pattern matched: ${pattern} - treating as our API`);
        }
        return true;
      }
    }
    
    // Check if it's the root API
    if (urlLower === '/api' || urlLower.startsWith('/api/')) {
      return true;
    }
    
    // For any other relative path, check if it's a valid API endpoint
    try {
      const baseUrlObj = new URL(baseUrl);
      const basePath = baseUrlObj.pathname.replace(/\/$/, '');
      if (url.startsWith(basePath)) {
        if (isDevelopment) {
          console.log(`[API] ✅ Base path match: ${url} - treating as our API`);
        }
        return true;
      }
    } catch (e) {
      // Ignore
    }
    
    // If we get here, it's a relative path that doesn't match any API pattern
    if (isDevelopment) {
      console.log(`[API] ⏭️ Unrecognized relative path: ${url} - NOT our API (safe default)`);
    }
    return false;
  }
  
  // If it's an absolute URL that's not our API, it's external
  if (url.startsWith('http://') || url.startsWith('https://')) {
    if (isDevelopment) {
      console.log(`[API] ⏭️ External URL: ${url} - NOT our API`);
    }
    return false;
  }
  
  // Default: if it doesn't match any pattern, assume it's not our API
  if (isDevelopment) {
    console.log(`[API] ⏭️ Default: ${url} - NOT our API`);
  }
  return false;
};

// ============================================================================
// Request Interceptor
// ============================================================================

api.interceptors.request.use(
  (config) => {
    try {
      // ULTRA AGGRESSIVE: Check for YouTube before ANYTHING else
      const url = config.url || '';
      const urlLower = url.toLowerCase();
      
      // If it's YouTube, skip ALL processing
      const isYouTube = urlLower.includes('youtube.com') || 
                        urlLower.includes('youtu.be') || 
                        urlLower.includes('googlevideo.com') ||
                        urlLower.includes('ytimg.com') ||
                        urlLower.includes('ggpht.com') ||
                        urlLower.includes('googleapis.com') ||
                        urlLower.includes('google.com');
      
      if (isYouTube) {
        if (isDevelopment) {
          console.log(`[AXIOS] ⏭️ SKIPPING YouTube request: ${url}`);
        }
        return config;
      }
      
      // Check if this is our API
      const isOurApi = isOurApiUrl(url);
      
      if (isDevelopment) {
        console.log(`[AXIOS] 🚀 ${config.method?.toUpperCase()} ${url} (isOurApi: ${isOurApi})`);
      }
      
      // Only add token for our API requests
      if (isOurApi) {
        const token = getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          if (isDevelopment) {
            console.log(`[AXIOS] ✅ Added Authorization header for ${url}`);
          }
        } else {
          if (isDevelopment) {
            console.warn(`[AXIOS] ⚠️ No token found for ${url}`);
          }
        }
      } else {
        if (isDevelopment) {
          console.log(`[AXIOS] ⏭️ Skipping token for: ${url}`);
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
    const requestUrl = error.config?.url || '';
    
    // Check if it's YouTube first
    const urlLower = requestUrl.toLowerCase();
    const isYouTube = urlLower.includes('youtube.com') || 
                      urlLower.includes('youtu.be') || 
                      urlLower.includes('googlevideo.com') ||
                      urlLower.includes('ytimg.com') ||
                      urlLower.includes('ggpht.com') ||
                      urlLower.includes('googleapis.com') ||
                      urlLower.includes('google.com');
    
    if (isYouTube) {
      if (isDevelopment) {
        console.log(`[AXIOS] ⏭️ YouTube response (ignored): ${status} ${requestUrl}`);
      }
      // Return a resolved promise to prevent error propagation
      return Promise.resolve({ data: {}, status: 200, statusText: 'OK' });
    }
    
    const isOurApi = isOurApiUrl(requestUrl);

    if (isDevelopment) {
      console.log(`[AXIOS] ❌ ${status} ${requestUrl}`, {
        isOurApi,
        message: data?.message || data?.Message || error.message,
        statusCode: status
      });
    }

    // ========================================================================
    // CRITICAL: Only handle 401/403 for OUR API calls
    // ========================================================================
    if (status === HTTP_STATUS.UNAUTHORIZED) {
      if (isOurApi) {
        logWarning('🔐 401 Unauthorized from OUR API - Clearing auth data');
        clearAuthData();
        redirectToSignIn();
      } else {
        logDebug('🔇 401 from third-party (ignored):', requestUrl);
      }
    }

    if (status === HTTP_STATUS.FORBIDDEN) {
      if (isOurApi) {
        logError('🚫 403 Forbidden from OUR API - Insufficient permissions');
      } else {
        logDebug('🔇 403 from third-party (ignored):', requestUrl);
      }
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