// src/shared/constants/routes.js

export const ROUTES = {
  // Public
  HOME: '/',
  COURSE_LIST: '/courses',
  COURSE_DETAILS: '/course/:id',
  SIGN_IN: '/signin',
  SIGN_UP: '/signup',
  
  // Legal Pages - ADD THESE
  PRIVACY_POLICY: '/privacy-policy',
  TERMS_OF_SERVICE: '/terms-of-service',
  
  // Student
  MY_ENROLLMENTS: '/my-enrollments',
  PROFILE: '/profile',
  CHAT: '/chat',
  WATCH: (courseId) => `/watch/${courseId}`,
  BECOME_INSTRUCTOR: '/become-instructor',
  
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
  ADMIN_COURSE_DETAIL: (id) => `/admin/courses/${id}`,
  ADMIN_USERS: '/admin/users',
  ADMIN_USER_DETAIL: (id) => `/admin/users/${id}`,
  ADMIN_INSTRUCTOR_APPLICATIONS: '/admin/instructor-applications',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_TAGS: '/admin/tags',
  ADMIN_REPORTS: '/admin/reports',
};