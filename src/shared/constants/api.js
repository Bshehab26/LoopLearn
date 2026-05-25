// src/shared/constants/api.js
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7244/api',
  TIMEOUT: 30000,
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 12,
    COURSES_PAGE_SIZE: 12,
    ENROLLMENTS_PAGE_SIZE: 5,
  },
  ENDPOINTS: {
    // Auth
    AUTH: {
      LOGIN: '/Auth/login',
      REGISTER: '/Auth/register',
    },
    // Course (Public)
    COURSE: {
      GET_ALL: '/Course/all',
      GET_BY_ID: (id) => `/Course/${id}`,
      SEARCH: (searchTerm) => `/Course/search/${encodeURIComponent(searchTerm)}`,
      BY_CATEGORIES: '/Course/categories',
    },
    // Profile (Protected)
    PROFILE: {
      GET: '/Profile',
      UPDATE: '/Profile/update',
      CHANGE_PASSWORD: '/Profile/changePassword',
      UPDATE_AVATAR: '/Profile/update/avatar',
    },
    // Instructor (Protected)
    INSTRUCTOR: {
      CREATE_COURSE: '/Course/create',
      UPDATE_COURSE: (id) => `/Course/${id}`,
      MY_COURSES: '/Instructor/courses',
      DASHBOARD: '/Instructor/dashboard',
      STUDENTS: '/Instructor/students',
    },
    // Enrollment (Protected)
    ENROLLMENT: {
      MY_COURSES: '/Enrollment/my-courses',
      PROGRESS: (courseId) => `/Enrollment/course/${courseId}/progress`,
      ENROLL: (courseId) => `/Enrollment/enroll/${courseId}`,
    },
    // Shared
    CATEGORIES: '/Category',
    TAGS: '/Tag',
  },
};