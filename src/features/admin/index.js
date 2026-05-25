// src/features/admin/index.js
// API
export {
  getDashboardStats,
  getUsers,
  updateUserRole,
  deleteUser,
  getAdminCourses,
  approveCourse,
  rejectCourse,
  deleteCourse,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getReports,
} from './api/admin.api';

// Hooks
export { default as useAdminStats } from './hooks/useAdminStats';
export { default as useAdminUsers } from './hooks/useAdminUsers';
export { default as useAdminCourses } from './hooks/useAdminCourses';
export { default as useAdminCategories } from './hooks/useAdminCategories';
export { default as useAdminReports } from './hooks/useAdminReports';

// Components
export { default as StatsCard } from './components/StatsCard';
export { default as UserTable } from './components/UserTable';
export { default as UserFilters } from './components/UserFilters';
export { default as CourseTable } from './components/CourseTable';
export { default as CourseFilters } from './components/CourseFilters';
export { default as CategoryManager } from './components/CategoryManager';
export { default as CategoryForm } from './components/CategoryForm';
export { default as ReportCard } from './components/ReportCard';
export { default as Chart } from './components/Chart';

// Pages
export { default as Dashboard } from './pages/Dashboard';
export { default as Users } from './pages/Users';
export { default as Courses } from './pages/Courses';
export { default as Categories } from './pages/Categories';
export { default as Reports } from './pages/Reports';