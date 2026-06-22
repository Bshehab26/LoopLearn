// src/shared/api/preLoadData.api.js

import api from '../../services/api/axios';
import { handleApiError } from '../../services/api/errorHandler';

const ENDPOINTS = {
  CATEGORIES: '/Category',
  TAGS: '/Tag',
};

export const getCategories = async () => {
  try {
    const response = await api.get(ENDPOINTS.CATEGORIES);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// ============================================================================
// Tags API with Pagination Support
// ============================================================================

/**
 * Get tags with pagination support
 * @param {number} page - Page number (default: 1)
 * @param {number} pageSize - Items per page (default: 20)
 * @param {boolean} loadAll - If true, loads all tags (default: false)
 */
export const getTags = async (page = 1, pageSize = 20, loadAll = false) => {
  try {
    // If loadAll is true, fetch all tags with pagination
    if (loadAll) {
      return await getAllTagsInternal(pageSize);
    }

    const response = await api.get(ENDPOINTS.TAGS, {
      params: { page, pageSize }
    });
    
    console.log('[getTags] Raw response:', response);
    console.log('[getTags] Headers:', response.headers);
    
    // Extract pagination headers
    const totalCount = parseInt(response.headers['total-count'] || 0);
    const currentPage = parseInt(response.headers['page-number'] || page);
    const currentPageSize = parseInt(response.headers['page-size'] || pageSize);
    
    // Handle different response formats
    let tagsData = [];
    if (response.data?.data && Array.isArray(response.data.data)) {
      tagsData = response.data.data;
    } else if (Array.isArray(response.data)) {
      tagsData = response.data;
    } else if (response.data?.success && response.data?.data) {
      tagsData = response.data.data;
    }
    
    // Transform to expected format
    const formattedTags = tagsData.map(tag => ({
      id: tag.id,
      name: tag.name
    }));
    
    console.log('[getTags] Formatted tags:', formattedTags.length);
    console.log('[getTags] Total count:', totalCount);
    
    return {
      success: true,
      data: formattedTags,
      total: totalCount,
      page: currentPage,
      pageSize: currentPageSize,
      hasMore: formattedTags.length < totalCount,
      headers: {
        'total-count': totalCount,
        'page-number': currentPage,
        'page-size': currentPageSize,
      }
    };
  } catch (error) {
    console.error('[getTags] Error:', error);
    return {
      success: false,
      message: error.message || 'Failed to load tags',
      data: [],
      total: 0,
      page: 1,
      pageSize: 20,
      hasMore: false,
    };
  }
};

/**
 * Internal function to fetch ALL tags by iterating through paginated results
 */
const getAllTagsInternal = async (pageSize = 50) => {
  try {
    console.log('[getAllTagsInternal] Loading all tags...');
    let allTags = [];
    let currentPage = 1;
    let hasMore = true;
    let totalCount = 0;

    while (hasMore) {
      const response = await api.get(ENDPOINTS.TAGS, {
        params: { page: currentPage, pageSize }
      });

      // Extract data
      let tagsData = [];
      if (response.data?.data && Array.isArray(response.data.data)) {
        tagsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        tagsData = response.data;
      } else if (response.data?.success && response.data?.data) {
        tagsData = response.data.data;
      }

      // Transform to expected format
      const formattedTags = tagsData.map(tag => ({
        id: tag.id,
        name: tag.name
      }));

      allTags = [...allTags, ...formattedTags];

      // Check if we have more pages
      const total = parseInt(response.headers['total-count'] || 0);
      totalCount = total || totalCount;
      
      hasMore = allTags.length < totalCount;
      currentPage++;

      // Safety limit to prevent infinite loops
      if (currentPage > 100) {
        console.warn('[getAllTagsInternal] Reached page limit, stopping');
        break;
      }
    }

    console.log('[getAllTagsInternal] Loaded all tags:', allTags.length);
    
    return {
      success: true,
      data: allTags,
      total: totalCount || allTags.length,
      page: 1,
      pageSize: allTags.length,
      hasMore: false,
      headers: {
        'total-count': totalCount || allTags.length,
        'page-number': 1,
        'page-size': allTags.length,
      }
    };
  } catch (error) {
    console.error('[getAllTagsInternal] Error:', error);
    return {
      success: false,
      message: error.message || 'Failed to load all tags',
      data: [],
      total: 0,
      page: 1,
      pageSize: 0,
      hasMore: false,
    };
  }
};

/**
 * Get all tags (public API)
 */
export const getAllTags = async (pageSize = 50) => {
  return await getAllTagsInternal(pageSize);
};

/**
 * Search tags by name (loads all tags and filters client-side)
 */
export const searchTags = async (searchTerm) => {
  try {
    // Get all tags
    const allTags = await getAllTagsInternal(50);
    
    if (!allTags.success) {
      return allTags;
    }

    // Filter client-side
    const filtered = allTags.data.filter(tag =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
      success: true,
      data: filtered,
      total: filtered.length,
      page: 1,
      pageSize: filtered.length,
      hasMore: false,
    };
  } catch (error) {
    console.error('[searchTags] Error:', error);
    return handleApiError(error);
  }
};