// src/features/auth/api/auth.api.js
import api from '../../../services/api/axios';
import { handleApiError, createApiResponse } from '../../../services/api/errorHandler';

// ============================================================================
// Constants
// ============================================================================

const AUTH_ENDPOINTS = {
  REGISTER: '/Auth/register',
  LOGIN: '/Auth/login',
};

// ============================================================================
// API Functions
// ============================================================================

/**
 * Registers a new user account
 * Backend expects: fName, lName, username, email, password, confirmPassword, phone, birthDate, gender
 */
export const register = async (userData) => {
  try {
    // Map frontend field names to backend expected names
    const payload = {
      fName: userData.firstName || userData.fName,
      lName: userData.lastName || userData.lName,
      username: userData.username,
      email: userData.email,
      password: userData.password,
      confirmPassword: userData.confirmPassword,
      phone: userData.phone,
      birthDate: userData.birthDate,
      gender: userData.gender,
    };

    console.log('📤 Register payload:', payload);
    const response = await api.post(AUTH_ENDPOINTS.REGISTER, payload);
    
    // Backend returns: { success, message, data: { token, username, email, role, ... } }
    console.log('📥 Register response:', response.data);
    
    // Return normalized response
    return {
      success: response.data.success || true,
      message: response.data.message || 'Registration successful',
      data: response.data.data || response.data,
    };
  } catch (error) {
    console.error('❌ Registration error:', error);
    return handleApiError(error);
  }
};

/**
 * Authenticates a user
 * Backend expects: EmailOrUsername (single field) + Password
 */
export const login = async (credentials) => {
  try {
    // Backend expects { emailOrUsername, password } - SINGLE field for identifier
    const payload = {
      emailOrUsername: credentials.identifier || credentials.emailOrUsername || credentials.username || credentials.email,
      password: credentials.password,
    };

    console.log('📤 Login payload:', { emailOrUsername: payload.emailOrUsername, password: '***' });
    const response = await api.post(AUTH_ENDPOINTS.LOGIN, payload);
    
    console.log('📥 Login response:', response.data);
    
    // Backend returns: { success, message, data: { token, username, email, role, ... } }
    return {
      success: response.data.success || true,
      message: response.data.message || 'Login successful',
      data: response.data.data || response.data,
    };
  } catch (error) {
    console.error('❌ Login error:', error);
    return handleApiError(error);
  }
};