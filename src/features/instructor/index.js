/**
 * Instructor Module - Barrel Exports
 * Central export point for all instructor-related functionality
 * 
 * @module features/instructor
 */

// ============================================================================
// Pages
// ============================================================================

export { default as Dashboard } from './pages/Dashboard';
export { default as MyCourses } from './pages/MyCourses';
export { default as AddCourse } from './pages/AddCourseWizard';
export { default as EditCourse } from './pages/EditCourse';
export { default as StudentEnrolled } from './pages/StudentEnrolled';
export { default as InstructorProfile } from './pages/Profile';

// ============================================================================
// Components
// ============================================================================

export { default as NavBar } from './components/NavBar';
export { default as SideBar } from './components/SideBar';
export { default as Footer } from './components/Footer';
export { default as CourseCard } from './components/CourseCard';
export { default as StatsCard } from './components/StatsCard';

// Wizard Components
export { default as StepBasicInfo } from './components/StepBasicInfo';
export { default as StepCategory } from './components/StepCategory';
export { default as StepDuration } from './components/StepDurationWeeks';
export { default as StepIndicator } from './components/StepIndicator';

// Profile Components
export { default as InstructorProfileInfo } from './components/profile/InstructorProfileInfo';

// ============================================================================
// Hooks
// ============================================================================

export { default as useInstructor } from './hooks/useInstructor';
export { default as useCourseWizard } from './hooks/useCourseWizard';
export { useInstructorProfile } from './hooks/useInstructorProfile';

// ============================================================================
// API
// ============================================================================

export {
  getInstructorCourses,
  addCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
  uploadCourseAvatar,
  COURSE_LEVELS,
} from './api/instructor.api';

export {
  getInstructorProfile,
  updateInstructorProfile,
  changeInstructorPassword,
  uploadInstructorAvatar,
  clearInstructorProfileCache,
  getCachedInstructorProfile,
} from './api/profile.api';

// ============================================================================
// Constants
// ============================================================================

export const INSTRUCTOR_ROUTES = {
  DASHBOARD: '/instructor',
  MY_COURSES: '/instructor/my-courses',
  ADD_COURSE: '/instructor/add-course',
  EDIT_COURSE: '/instructor/edit-course/:id',
  STUDENT_ENROLLED: '/instructor/student-enrolled',
  PROFILE: '/instructor/profile',
};