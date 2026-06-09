// src/features/courses/index.js
export { default as CoursesList } from './pages/CoursesList';
export { default as CourseDetails } from './pages/CourseDetails';
export { default as WatchWindow } from './pages/WatchWindow';
// src/features/courses/index.js

export { default as CourseCard } from './components/CourseCard';export { default as SearchBar } from './components/SearchBar';
export { default as FilterDropdown } from './components/FilterDropdown';
export { default as Comments } from './components/Comments';

// API
export {
  getAllCourses,
  getCourseById,
  searchCourses,
  getCoursesByCategories,
  getFilteredCourses,
  calculateTotalDuration,
  calculateTotalLessons,
  formatPrice,
  getLevelColor,
} from './api/course.api';

// Hooks
export { default as useCourses } from './hooks/useCourses';
export { default as useCourseDetails } from './hooks/useCourseDetails';