// src/shared/api/paginationHelper.js

/**
 * Extracts pagination information from response headers
 * Backend sends: Total-Count, Page, PageSize
 * 
 * @param {Object} headers - Axios response headers
 * @param {Object} defaults - Default pagination values
 * @returns {Object} Pagination info
 */
export const extractPaginationHeaders = (headers, defaults = {}) => {
  const total = parseInt(headers['total-count'] || 0, 10);
  const page = parseInt(headers['page-number'] || defaults.page || 1, 10);
  const pageSize = parseInt(headers['page-size'] || defaults.pageSize || 10, 10);
  
  return {
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize) || 0,
  };
};

/**
 * Creates pagination query parameters for API requests
 * @param {number} page - Page number (1-indexed)
 * @param {number} pageSize - Items per page
 * @returns {Object} Query params object
 */
export const getPaginationParams = (page, pageSize) => ({
  page: page || 1,
  pageSize: pageSize || 10,
});