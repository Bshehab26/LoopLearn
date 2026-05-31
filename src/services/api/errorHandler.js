// src/services/api/errorHandler.js

/**
 * Handles API errors and normalizes them to consistent format
 * Backend returns: { success: false, message: "error text" } or validation errors
 */
export const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    
    // If the server returned a standard error object
    if (data) {
      // Handle plain string message
      if (typeof data === 'string') {
        return { success: false, message: data };
      }
      // Handle common envelope formats
      if (data.success === false) {
        return { success: false, message: data.message || data.Message || 'Request failed' };
      }
      if (data.message || data.Message) {
        return { success: false, message: data.message || data.Message };
      }
    }
    
    // HTTP status-specific messages
    if (status === 401) return { success: false, message: 'Unauthorized. Please log in again.' };
    if (status === 403) return { success: false, message: 'You do not have permission to perform this action.' };
    if (status === 404) return { success: false, message: 'Resource not found.' };
    if (status >= 500) return { success: false, message: 'Server error. Please try again later.' };
  }
  
  // Network or other errors
  return { success: false, message: error.message || 'An unexpected error occurred' };
};

export const createApiResponse = (data, success = true, message = '') => ({
  success,
  data,
  message,
});