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

export const Login = async (credentials) => {
  try {
    console.log('📤 Login payload:', { emailOrUsername: credentials.emailOrUsername, password: '***' });
    const response = await api.post(AUTH_ENDPOINTS.LOGIN, credentials);
    console.log('📥 Login response:', response.data);
    
    const data = response.data;
    // Backend returns { isAuthenticated, token, expiresOn, message }
    return {
      isAuthenticated: data.isAuthenticated === true,
      token: data.token || null,
      expiresOn: data.expiresOn || null,
      message: data.message || (data.isAuthenticated ? 'Login successful' : 'Login failed'),
    };
  } catch (error) {
    console.error('❌ Login error:', error);
    const handled = handleApiError(error);
    return {
      isAuthenticated: false,
      token: null,
      expiresOn: null,
      message: handled.message,
    };
  }
};

export const Register = async (userData) => {
  try {
    console.log('📤 Register payload:', userData);
    const response = await api.post(AUTH_ENDPOINTS.REGISTER, userData);
    console.log('📥 Register response:', response.data);
    
    const data = response.data;
    return {
      isAuthenticated: data.isAuthenticated === true,
      token: data.token || null,
      expiresOn: data.expiresOn || null,
      message: data.message || (data.isAuthenticated ? 'Registration successful' : 'Registration failed'),
    };
  } catch (error) {
    console.error('❌ Registration error:', error);
    const handled = handleApiError(error);
    return {
      isAuthenticated: false,
      token: null,
      expiresOn: null,
      message: handled.message,
    };
  }
};