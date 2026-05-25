// src/shared/constants/routes.js
export const ROUTES = {
  // Public
  HOME: '/',
  COURSE_LIST: '/courses',
  COURSE_DETAILS: (id) => `/course/${id}`,
  
  // Auth
  SIGN_IN: '/signin',
  SIGN_UP: '/signup',
  
  // Student
  PROFILE: '/profile',
  MY_ENROLLMENTS: '/my-enrollments',
  CHAT: '/chat',
  WATCH: (courseId) => `/watch/${courseId}`,
  
  // Instructor
  INSTRUCTOR_DASHBOARD: '/instructor',
  INSTRUCTOR_COURSES: '/instructor/courses',
  INSTRUCTOR_ADD: '/instructor/courses/add',
  INSTRUCTOR_EDIT: (id) => `/instructor/courses/edit/${id}`,
  INSTRUCTOR_STUDENTS: '/instructor/students',
  INSTRUCTOR_PROFILE: '/instructor/profile',
  
  // Admin
  ADMIN_DASHBOARD: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_COURSES: '/admin/courses',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_REPORTS: '/admin/reports',
};