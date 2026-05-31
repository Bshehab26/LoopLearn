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

export const getTags = async ()=>{
  try {
    const response = await api.get(ENDPOINTS.TAGS);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}