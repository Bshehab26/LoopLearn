// src/shared/constants/routes.js
export const ROUTES = {
  // Public
  HOME: '/',
  COURSE_LIST: '/courses',
  COURSE_DETAILS: '/course/:id',  // ✅ ADD THIS LINE
  SIGN_IN: '/signin',
  SIGN_UP: '/signup',
  
  // Student
  MY_ENROLLMENTS: '/my-enrollments',
  PROFILE: '/profile',
  CHAT: '/chat',
  WATCH: (courseId) => `/watch/${courseId}`,
  
  // Instructor
  INSTRUCTOR_DASHBOARD: '/instructor',
  INSTRUCTOR_COURSES: '/instructor/courses',
  INSTRUCTOR_ADD: '/instructor/courses/add',
  INSTRUCTOR_EDIT: (id) => `/instructor/courses/edit/${id}`,
  INSTRUCTOR_STUDENTS: '/instructor/students',
  INSTRUCTOR_PROFILE: '/instructor/profile',
  
  // Admin Routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PENDING_COURSES: '/admin/courses/pending',
  ADMIN_ALL_COURSES: '/admin/courses/all',
  ADMIN_USERS: '/admin/users',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_REPORTS: '/admin/reports',
};