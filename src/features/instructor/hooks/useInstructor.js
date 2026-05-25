/**
 * useInstructor.js
 * Custom hook for managing instructor functionality including course CRUD operations,
 * dashboard statistics, and course management.
 * 
 * @module features/instructor/hooks/useInstructor
 * 
 * @example
 * const {
 *   courses, loading, error, success,
 *   addCourse, editCourse, removeCourse,
 *   stats, fetchStats,
 * } = useInstructor();
 */

import { useState, useContext, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../store/AppContext';
import {
  addCourse as apiAddCourse,
  getInstructorCourses,
  updateCourse as apiUpdateCourse,
  deleteCourse as apiDeleteCourse,
  getDashboardStats,
} from '../api/instructor.api';

// ============================================================================
// Constants
// ============================================================================

/** Minimum description length required for courses */
const MIN_DESCRIPTION_LENGTH = 50;

/** Maximum description length */
const MAX_DESCRIPTION_LENGTH = 5000;

/** Navigation delay after successful course creation (ms) */
const NAVIGATION_DELAY_CREATE = 1500;

/** Navigation delay after successful course update (ms) */
const NAVIGATION_DELAY_UPDATE = 1000;

/** Default stats object */
const DEFAULT_STATS = {
  totalCourses: 0,
  totalStudents: 0,
  totalRevenue: 0,
  totalEnrollments: 0,
};

/** API error messages mapping */
const ERROR_MESSAGES = {
  COURSE_NOT_FOUND: 'Course not found',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  INVALID_DATA: 'Invalid course data provided',
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Converts a File object to base64 string
 * @param {File} file - Image file to convert
 * @returns {Promise<string>} Base64 string
 */
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });

/**
 * Validates course form data
 * @param {Object} form - Course form data
 * @param {File} thumbnail - Course thumbnail image
 * @returns {Object} { isValid, error }
 */
const validateCourseForm = (form, thumbnail) => {
  // Title validation
  if (!form.title?.trim()) {
    return { isValid: false, error: 'Course title is required' };
  }
  if (form.title.trim().length < 3) {
    return { isValid: false, error: 'Course title must be at least 3 characters' };
  }

  // Description validation
  if (!form.description?.trim()) {
    return { isValid: false, error: 'Course description is required' };
  }
  if (form.description.trim().length < MIN_DESCRIPTION_LENGTH) {
    return { 
      isValid: false, 
      error: `Description must be at least ${MIN_DESCRIPTION_LENGTH} characters (currently ${form.description.trim().length})` 
    };
  }
  if (form.description.trim().length > MAX_DESCRIPTION_LENGTH) {
    return { 
      isValid: false, 
      error: `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters` 
    };
  }

  // Price validation
  const price = Number(form.price);
  if (isNaN(price) || price < 0) {
    return { isValid: false, error: 'Valid price is required' };
  }
  if (price > 99999) {
    return { isValid: false, error: 'Price cannot exceed $99,999' };
  }

  // Category validation
  if (!form.category) {
    return { isValid: false, error: 'Please select a category' };
  }

  // Level validation
  if (form.level === undefined || form.level === null) {
    return { isValid: false, error: 'Please select a course level' };
  }

  // Duration validation
  const duration = Number(form.duration);
  if (isNaN(duration) || duration <= 0) {
    return { isValid: false, error: 'Duration must be greater than 0 minutes' };
  }
  if (duration > 10000) {
    return { isValid: false, error: 'Duration cannot exceed 10,000 minutes' };
  }

  // Thumbnail validation
  if (!thumbnail) {
    return { isValid: false, error: 'Course thumbnail is required' };
  }
  if (!thumbnail.type.startsWith('image/')) {
    return { isValid: false, error: 'Thumbnail must be an image file' };
  }
  if (thumbnail.size > 5 * 1024 * 1024) {
    return { isValid: false, error: 'Thumbnail must be less than 5MB' };
  }

  return { isValid: true, error: null };
};

/**
 * Prepares course data for API submission
 * @param {Object} form - Course form data
 * @param {string} avatarBase64 - Base64 encoded thumbnail
 * @returns {Object} API-ready course data
 */
const prepareCourseData = (form, avatarBase64) => ({
  title: form.title.trim(),
  description: form.description.trim(),
  price: Number(form.price),
  level: Number(form.level),
  category: form.category,
  duration: parseInt(form.duration, 10),
  avatar: avatarBase64,
});

/**
 * Prepares update data for API
 * @param {Object} formData - Update form data
 * @returns {Object} API-ready update data
 */
const prepareUpdateData = (formData) => ({
  title: formData.title || formData.courseTitle,
  description: formData.description || formData.courseDescription,
  price: Number(formData.price || formData.coursePrice),
  level: formData.level,
  category: formData.category,
  duration: formData.duration,
});

/**
 * Extracts error message from API error
 * @param {Object} error - Axios error object
 * @param {string} defaultMessage - Default error message
 * @returns {string} Error message
 */
const extractErrorMessage = (error, defaultMessage = 'An unexpected error occurred') => {
  const status = error.response?.status;
  const data = error.response?.data;
  
  // Handle specific status codes
  if (status === 404) return ERROR_MESSAGES.COURSE_NOT_FOUND;
  if (status === 401) return ERROR_MESSAGES.UNAUTHORIZED;
  if (status === 400) return data?.Message || data?.message || ERROR_MESSAGES.INVALID_DATA;
  
  // Generic error
  return data?.Message || data?.message || defaultMessage;
};

/**
 * Checks if user is an instructor
 * @param {Object} user - User object
 * @returns {boolean} True if instructor
 */
const isInstructor = (user) => user?.role === 'instructor';

// ============================================================================
// Hook
// ============================================================================

/**
 * useInstructor - Manages instructor course operations and dashboard data
 * @returns {Object} Instructor state and operations
 */
const useInstructor = () => {
  const navigate = useNavigate();
  const { user, currency, instructorCourses, updateInstructorCourse } = useContext(AppContext);

  // --------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [stats, setStats] = useState(DEFAULT_STATS);
  
  // Refs for navigation timeouts
  const navigationTimeoutRef = useRef(null);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  // --------------------------------------------------------------------------
  // Derived Values
  // --------------------------------------------------------------------------
  const displayCourses = useMemo(() => 
    courses.length > 0 ? courses : instructorCourses, 
    [courses, instructorCourses]
  );

  // --------------------------------------------------------------------------
  // Data Fetching
  // --------------------------------------------------------------------------
  
  /**
   * Fetches instructor's courses from API
   */
  const fetchCourses = useCallback(async () => {
    if (!isInstructor(user)) return;

    try {
      setLoading(true);
      setError('');
      const result = await getInstructorCourses();

      if (result.success) {
        setCourses(result.data || []);
      } else {
        setCourses([]);
        setError(result.message || 'Failed to load your courses');
      }
    } catch (err) {
      console.error('[useInstructor] Fetch courses error:', err);
      setError('Failed to load your courses');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Fetches instructor dashboard statistics
   */
  const fetchStats = useCallback(async () => {
    if (!isInstructor(user)) return;

    try {
      const result = await getDashboardStats();

      if (result.success && result.data) {
        setStats({
          totalCourses: result.data.totalCourses || courses.length,
          totalStudents: result.data.totalStudents || 0,
          totalRevenue: result.data.totalRevenue || 0,
          totalEnrollments: result.data.totalEnrollments || 0,
        });
      } else {
        // Fallback to course count if API fails
        setStats(prev => ({
          ...DEFAULT_STATS,
          totalCourses: courses.length,
        }));
      }
    } catch (err) {
      console.error('[useInstructor] Fetch stats error:', err);
      setStats(prev => ({
        ...DEFAULT_STATS,
        totalCourses: courses.length,
      }));
    }
  }, [user, courses.length]);

  // --------------------------------------------------------------------------
  // Course CRUD Operations
  // --------------------------------------------------------------------------
  
  /**
   * Adds a new course
   * @param {Object} params - Course creation parameters
   * @param {Object} params.form - Course form data
   * @param {File} params.thumbnail - Course thumbnail image
   * @returns {Promise<boolean>} True if successful
   */
  const addCourseHandler = useCallback(async ({ form, thumbnail }) => {
    // Validate instructor
    if (!user?.id) {
      setError('Instructor ID not found. Please log in again.');
      return false;
    }

    // Validate form data
    const validation = validateCourseForm(form, thumbnail);
    if (!validation.isValid) {
      setError(validation.error);
      return false;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess(false);

      const avatarBase64 = await fileToBase64(thumbnail);
      const courseData = prepareCourseData(form, avatarBase64);
      const result = await apiAddCourse(courseData);

      if (result.success) {
        setSuccess(true);
        
        // Refresh data
        await Promise.all([fetchCourses(), fetchStats()]);
        
        // Navigate after delay
        navigationTimeoutRef.current = setTimeout(() => {
          navigate('/instructor/my-courses');
        }, NAVIGATION_DELAY_CREATE);
        
        return true;
      } else {
        setError(result.message || 'Failed to create course');
        return false;
      }
    } catch (err) {
      console.error('[useInstructor] Add course error:', err);
      const errorMessage = extractErrorMessage(err, 'Failed to create course. Please try again.');
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user?.id, fetchCourses, fetchStats, navigate]);

  /**
   * Edits an existing course
   * @param {string|number} id - Course ID
   * @param {Object} formData - Updated course data
   * @returns {Promise<boolean>} True if successful
   */
  const editCourseHandler = useCallback(async (id, formData) => {
    if (!id) {
      setError('Course ID is required');
      return false;
    }

    try {
      setLoading(true);
      setError('');

      const updateData = prepareUpdateData(formData);
      const result = await apiUpdateCourse(id, updateData);

      if (result.success) {
        // Update local state optimistically
        updateInstructorCourse(id, {
          title: updateData.title,
          price: updateData.price,
          description: updateData.description,
        });
        
        // Refresh data
        await Promise.all([fetchCourses(), fetchStats()]);
        
        setSuccess(true);
        
        navigationTimeoutRef.current = setTimeout(() => {
          navigate('/instructor/my-courses');
        }, NAVIGATION_DELAY_UPDATE);
        
        return true;
      } else {
        setError(result.message || 'Failed to update course');
        return false;
      }
    } catch (err) {
      console.error('[useInstructor] Edit course error:', err);
      const errorMessage = extractErrorMessage(err, 'Failed to update course');
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [updateInstructorCourse, fetchCourses, fetchStats, navigate]);

  /**
   * Deletes a course
   * @param {string|number} id - Course ID to delete
   * @returns {Promise<boolean>} True if successful
   */
  const removeCourseHandler = useCallback(async (id) => {
    if (!id) {
      setError('Course ID is required');
      return false;
    }

    try {
      setLoading(true);
      setError('');

      const result = await apiDeleteCourse(id);

      if (result.success) {
        // Refresh data
        await Promise.all([fetchCourses(), fetchStats()]);
        return true;
      } else {
        setError(result.message || 'Failed to delete course');
        return false;
      }
    } catch (err) {
      console.error('[useInstructor] Delete course error:', err);
      const errorMessage = extractErrorMessage(err, 'Failed to delete course');
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchCourses, fetchStats]);

  /**
   * Resets error and success states
   */
  const resetState = useCallback(() => {
    setError('');
    setSuccess(false);
  }, []);

  // --------------------------------------------------------------------------
  // Initialization
  // --------------------------------------------------------------------------
  
  // Fetch initial data when user is instructor
  useEffect(() => {
    if (isInstructor(user)) {
      fetchCourses();
      fetchStats();
    }
  }, [user, fetchCourses, fetchStats]);

  // --------------------------------------------------------------------------
  // Return Value
  // --------------------------------------------------------------------------
  
  return {
    // Data
    courses: displayCourses,
    stats,
    
    // Status
    loading,
    error,
    success,
    
    // Utilities
    currency,
    isInstructor: isInstructor(user),
    
    // Actions
    addCourse: addCourseHandler,
    editCourse: editCourseHandler,
    removeCourse: removeCourseHandler,
    fetchCourses,
    fetchStats,
    resetState,
  };
};

export default useInstructor;