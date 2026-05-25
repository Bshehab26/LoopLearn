// src/services/api/errorHandler.js

/**
 * Handles API errors and normalizes them to consistent format
 * Backend returns: { success: false, message: "error text" } or validation errors
 */
export const handleApiError = (error) => {
  // Network error (no response from server)
  if (!error.response) {
    return {
      success: false,
      message: "Network error. Please check your internet connection.",
      status: null,
      data: null,
    };
  }

  const { status, data } = error.response;
  
  // Extract error message from different response formats
  let message = "An unexpected error occurred.";
  
  // Backend format: { success: false, message: "..." }
  if (data?.message) message = data.message;
  else if (data?.Message) message = data.Message;
  // Validation errors (ASP.NET format)
  else if (data?.errors) {
    const errors = Object.values(data.errors).flat();
    message = errors.join(" ");
  }
  // String response
  else if (typeof data === "string") message = data;
  
  return {
    success: false,
    message,
    status,
    data: null,
  };
};

/**
 * Creates a standardized API response
 */
export const createApiResponse = (data, success = true, message = "") => ({
  success,
  data,
  message,
});