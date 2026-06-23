// src/shared/api/preLoadData.api.js

import api from '../../services/api/axios';
import { handleApiError } from '../../services/api/errorHandler';

const ENDPOINTS = {
  CATEGORIES: '/Category',
  TAGS: '/Tag',
};

export const getCategories = async (page = 1, pageSize = 10000) => {
  try {
    const response = await api.get(ENDPOINTS.CATEGORIES, { 
      params: { page, pageSize } 
    });

    const data = response.data?.data || [];
    const totalCount = parseInt(response.headers['total-count'] || response.headers['Total-Count'] || data.length);
    const currentPage = parseInt(response.headers['page-number'] || response.headers['Page-Number'] || page);
    const currentPageSize = parseInt(response.headers['page-size'] || response.headers['Page-Size'] || pageSize);

    return {
      success: true,
      data: data,
      pagination: {
        totalCount,
        pageNumber: currentPage,
        pageSize: currentPageSize,
      },
      hasMore: (currentPage * currentPageSize) < totalCount
    };
  } catch (error) {
    console.error('[getCategories] Error:', error);
    return handleApiError(error);
  }
};

// ============================================================================
// Tags API with Pagination Support
// ============================================================================

/**
 * Get tags with pagination support
 * Reads Total-Count, Page-Number, Page-Size from response headers
 * @param {number} page - Page number (default: 1)
 * @param {number} pageSize - Items per page (default: 50)
 * @returns {Promise<{success, data: Array, pagination: {totalCount, pageNumber, pageSize}, hasMore}>}
 */
export const getTags = async (page = 1, pageSize = 50) => {
  try {
    const response = await api.get('/Tag', { 
      params: { page, pageSize } 
    });

    const data = response.data?.data || [];
    const totalCount = parseInt(response.headers['total-count'] || response.headers['Total-Count'] || data.length);
    const currentPage = parseInt(response.headers['page-number'] || response.headers['Page-Number'] || page);
    const currentPageSize = parseInt(response.headers['page-size'] || response.headers['Page-Size'] || pageSize);

    return {
      success: true,
      data: data,
      pagination: {
        totalCount,
        pageNumber: currentPage,
        pageSize: currentPageSize,
      },
      hasMore: (currentPage * currentPageSize) < totalCount
    };
  } catch (error) {
    console.error('[getTags] Error:', error);
    return handleApiError(error);
  }
};

/**
 * Get all tags (loads all pages sequentially)
 * Use this when you need the complete tag list
 * @param {AbortSignal} signal - Optional abort signal for cancellation
 * @returns {Promise<{success, data: Array, totalCount}>}
 */
export const getAllTags = async (signal) => {
  try {
    const allTags = [];
    let page = 1;
    const pageSize = 100;
    let hasMore = true;

    while (hasMore && !signal?.aborted) {
      const response = await api.get('/Tag', { 
        params: { page, pageSize },
        signal 
      });

      const data = response.data?.data || [];
      const totalCount = parseInt(response.headers['total-count'] || response.headers['Total-Count'] || data.length);

      allTags.push(...data);

      hasMore = (page * pageSize) < totalCount && data.length === pageSize;
      page++;

      // Safety break
      if (page > 50) break;
    }

    if (signal?.aborted) {
      return { success: false, data: [], message: 'Request cancelled' };
    }

    return {
      success: true,
      data: allTags,
      totalCount: allTags.length
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      return { success: false, data: [], message: 'Request cancelled' };
    }
    console.error('[getAllTags] Error:', error);
    return handleApiError(error);
  }
};
