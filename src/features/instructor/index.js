// src/features/instructor/index.js

// Pages
export { default as Dashboard } from './pages/Dashboard';
export { default as MyCourses } from './pages/MyCourses';
export { default as AddCourseWizard } from './pages/AddCourseWizard';
export { default as EditCourse } from './pages/EditCourse';
export { default as StudentEnrolled } from './pages/StudentEnrolled';

// ❌ REMOVE THIS LINE:
// export { default as InstructorProfile } from './pages/Profile';

// Components
export { default as CourseCard } from './components/CourseCard';
export { default as EmptyState } from './components/EmptyState';
export { default as CourseStructureSection } from './components/CourseStructureSection';

// Wizard Components
export { default as StepBasicInfo } from './components/StepBasicInfo';
export { default as StepCategory } from './components/StepCategory';
export { default as StepIndicator } from './components/StepIndicator';

// Hooks
export { default as useInstructorCourses } from './hooks/useInstructorCourses';
export { default as useCourseWizard } from './hooks/useCourseWizard';

// API
export {
  getCategories,
  getInstructorCourses,
  createCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
  publishCourse,
  getDashboardStats,
  getEnrolledStudents,
} from './api/instructor.api';