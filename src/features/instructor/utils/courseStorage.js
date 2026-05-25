/**
 * courseStorage.js
 * Frontend-only storage for courses using localStorage
 * This simulates backend until API is ready
 */

const STORAGE_KEYS = {
  COURSES: 'instructor_courses',
  DRAFTS: 'instructor_drafts',
  COURSE_PREFIX: 'course_',
};

/**
 * Get all courses (including drafts)
 */
export const getAllCourses = () => {
  const courses = localStorage.getItem(STORAGE_KEYS.COURSES);
  return courses ? JSON.parse(courses) : [];
};

/**
 * Save all courses
 */
export const saveAllCourses = (courses) => {
  localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
};

/**
 * Get a single course by ID
 */
export const getCourseById = (courseId) => {
  const courses = getAllCourses();
  return courses.find(c => c.id === parseInt(courseId));
};

/**
 * Create a new draft course
 */
export const createDraftCourse = (courseData) => {
  const courses = getAllCourses();
  
  const newCourse = {
    id: Date.now(),
    ...courseData,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: {
      introduction: '',
      curriculum: [],
      requirements: [],
      targetAudience: [],
    },
  };
  
  courses.push(newCourse);
  saveAllCourses(courses);
  
  return newCourse;
};

/**
 * Update an existing course
 */
export const updateCourse = (courseId, updates) => {
  const courses = getAllCourses();
  const index = courses.findIndex(c => c.id === parseInt(courseId));
  
  if (index !== -1) {
    courses[index] = {
      ...courses[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveAllCourses(courses);
    return courses[index];
  }
  
  return null;
};

/**
 * Delete a course
 */
export const deleteCourse = (courseId) => {
  const courses = getAllCourses();
  const filtered = courses.filter(c => c.id !== parseInt(courseId));
  saveAllCourses(filtered);
  return true;
};

/**
 * Publish a draft course
 */
export const publishCourse = (courseId) => {
  return updateCourse(courseId, { status: 'published' });
};

/**
 * Generate a unique ID
 */
export const generateId = () => {
  return Date.now();
};