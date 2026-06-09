import api from '../../services/api/axios';
import { handleApiError, createApiResponse } from '../../services/api/errorHandler';

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

// src/shared/api/preLoadData.api.js (UPDATE getTags)
export const getTags = async () => {
  try {
    const response = await api.get(ENDPOINTS.TAGS);
    console.log('[getTags] Raw response:', response);
    
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
    
    console.log('[getTags] Formatted tags:', formattedTags);
    
    return {
      success: true,
      data: formattedTags
    };
  } catch (error) {
    console.error('[getTags] Error:', error);
    return handleApiError(error);
  }
};