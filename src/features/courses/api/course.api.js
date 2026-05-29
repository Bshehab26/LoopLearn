// src/features/courses/api/course.api.js
import api from '../../../services/api/axios';
import { handleApiError } from '../../../services/api/errorHandler';

// ============================================================================
// Constants
// ============================================================================

const COURSE_ENDPOINTS = {
  ALL: '/Course/all',
  BY_ID: (id) => `/Course/${id}`,
  SEARCH: (term) => `/Course/search/${encodeURIComponent(term)}`,
  BY_CATEGORIES: '/Course/categories',
};

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 12;

// ============================================================================
// Helper Functions
// ============================================================================

const extractPaginationHeaders = (headers) => ({
  total: parseInt(headers['total-count'] || 0, 10),
  page: parseInt(headers['page'] || DEFAULT_PAGE, 10),
  pageSize: parseInt(headers['pagesize'] || DEFAULT_PAGE_SIZE, 10),
  totalPages: Math.ceil(
    (parseInt(headers['total-count'] || 0, 10)) / 
    (parseInt(headers['pagesize'] || DEFAULT_PAGE_SIZE, 10))
  ),
});

// ============================================================================
// API Functions
// ============================================================================

export const getAllCourses = async (page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE) => {
  try {
    const response = await api.get(COURSE_ENDPOINTS.ALL, {
      params: { page, pageSize }
    });
    
    const pagination = extractPaginationHeaders(response.headers);
    
    return {
      success: response.data.success || true,
      message: response.data.message || 'Courses retrieved successfully',
      data: response.data.data || [],
      pagination,
    };
  } catch (error) {
    console.error('❌ getAllCourses error:', error);
    return handleApiError(error);
  }
};

export const getCourseById = async (courseId) => {
  try {
    if (!courseId || courseId < 1) {
      throw new Error('Invalid course ID');
    }
    
    const response = await api.get(COURSE_ENDPOINTS.BY_ID(courseId));
    
    return {
      success: response.data.success || true,
      message: response.data.message || 'Course details retrieved successfully',
      data: response.data.data,
    };
  } catch (error) {
    console.error(`❌ getCourseById(${courseId}) error:`, error);
    return handleApiError(error);
  }
};

export const searchCourses = async (searchTerm, page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE) => {
  try {
    if (!searchTerm?.trim()) {
      return {
        success: false,
        message: 'Search term is required',
        data: [],
        pagination: { total: 0, page, pageSize, totalPages: 0 },
      };
    }
    
    const response = await api.get(COURSE_ENDPOINTS.SEARCH(searchTerm), {
      params: { page, pageSize }
    });
    
    const pagination = extractPaginationHeaders(response.headers);
    
    // Handle search response format (may have nested course objects)
    let courses = response.data.data || [];
    if (courses.length > 0 && courses[0].course) {
      courses = courses.map(item => item.course);
    }
    
    return {
      success: response.data.success || true,
      message: response.data.message || `Found ${courses.length} courses`,
      data: courses,
      pagination,
    };
  } catch (error) {
    console.error('❌ searchCourses error:', error);
    return handleApiError(error);
  }
};

export const getCoursesByCategories = async (categories, page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE) => {
  try {
    if (!categories || categories.length === 0) {
      return {
        success: false,
        message: 'At least one category is required',
        data: [],
        pagination: { total: 0, page, pageSize, totalPages: 0 },
      };
    }
    
    const params = new URLSearchParams();
    categories.forEach(cat => params.append('categories', cat));
    params.append('page', page);
    params.append('pageSize', pageSize);
    
    const response = await api.get(`${COURSE_ENDPOINTS.BY_CATEGORIES}?${params.toString()}`);
    const pagination = extractPaginationHeaders(response.headers);
    
    return {
      success: response.data.success || true,
      message: response.data.message || 'Courses retrieved by categories',
      data: response.data.data || [],
      pagination,
    };
  } catch (error) {
    console.error('❌ getCoursesByCategories error:', error);
    return handleApiError(error);
  }
};

export const getFilteredCourses = async (filters = {}) => {
  const {
    searchTerm,
    categories,
    page = DEFAULT_PAGE,
    pageSize = DEFAULT_PAGE_SIZE,
  } = filters;
  
  if (searchTerm?.trim()) {
    return searchCourses(searchTerm, page, pageSize);
  }
  
  if (categories?.length > 0) {
    return getCoursesByCategories(categories, page, pageSize);
  }
  
  return getAllCourses(page, pageSize);
};

// ============================================================================
// Helper Functions
// ============================================================================

export const calculateTotalDuration = (sections) => {
  if (!sections?.length) return '0m';
  
  let totalSeconds = 0;
  
  sections.forEach(section => {
    section.lessons?.forEach(lesson => {
      if (lesson.duration) {
        if (typeof lesson.duration === 'string') {
          const parts = lesson.duration.split(':');
          if (parts.length === 3) {
            totalSeconds += parseInt(parts[0], 10) * 3600;
            totalSeconds += parseInt(parts[1], 10) * 60;
            totalSeconds += parseInt(parts[2], 10);
          }
        } else if (lesson.duration?.totalSeconds) {
          totalSeconds += lesson.duration.totalSeconds;
        }
      }
    });
  });
  
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export const calculateTotalLessons = (sections) => {
  if (!sections?.length) return 0;
  return sections.reduce((total, section) => {
    return total + (section.lessons?.length || 0);
  }, 0);
};

export const formatPrice = (price, isFree, currency = '$') => {
  if (isFree) return 'Free';
  return `${currency}${price?.toFixed(2) || '0.00'}`;
};

export const getLevelColor = (level) => {
  const levels = {
    'Beginner': { bg: '#E6F7E6', text: '#2E7D32' },
    'Intermediate': { bg: '#FFF3E0', text: '#ED6C02' },
    'Advanced': { bg: '#FEEBEE', text: '#C62828' },
    'All Levels': { bg: '#E3F2FD', text: '#1565C0' },
  };
  return levels[level] || { bg: '#F5F5F5', text: '#757575' };
};