// src/features/courses/api/category.api.js
// Calls the real CategoryController endpoint: GET /api/Category
// Returns: { success, data: [{ id, name, description }] }

import api from '../../../services/api/axios';
import { handleApiError } from '../../../services/api/errorHandler';

export const getCategories = async () => {
  try {
    const response = await api.get('/Category');
    return {
      success: response.data.success ?? true,
      data:    response.data.data    ?? [],
    };
  } catch (error) {
    console.error('❌ getCategories error:', error);
    return handleApiError(error);
  }
};