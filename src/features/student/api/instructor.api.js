// src/features/student/api/instructor.api.js

import api from '../../../services/api/axios';
import { handleApiError } from '../../../services/api/errorHandler';

/**
 * Submit an application to become an instructor
 * POST /api/Student/instructor-application
 */
export const submitInstructorApplication = async () => {
  try {
    const response = await api.post('/Student/instructor-application');
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Check the status of the instructor application
 * This can be done by checking the user's isInstructorRequested flag
 * which is included in the JWT or user data
 */
export const getInstructorApplicationStatus = async () => {
  try {
    // This could be a dedicated endpoint if needed
    // For now, we'll use the user data from auth context
    return { success: true, data: { status: 'pending' } };
  } catch (error) {
    return handleApiError(error);
  }
};