// src/features/auth/hooks/useAuth.js
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth as useAppAuth } from '../../../store/AppProvider';  // ✅ Changed: import from AppProvider
import { login, register } from '../api/auth.api';

// ============================================================================
// Constants
// ============================================================================

const MIN_PASSWORD_LENGTH = 8;
const EGYPTIAN_PHONE_REGEX = /^01[0125]\d{8}$/;
const EMAIL_REGEX = /\S+@\S+\.\S+/;

const ROLE_REDIRECTS = {
  instructor: '/instructor',
  admin: '/admin',
  student: '/',
};
const DEFAULT_REDIRECT = '/';

// ============================================================================
// Validation Helpers
// ============================================================================

const validateSignIn = ({ identifier, password }) => {
  if (!identifier?.trim()) {
    return { isValid: false, error: 'Please enter your username or email.' };
  }
  if (!password) {
    return { isValid: false, error: 'Please enter your password.' };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { isValid: false, error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` };
  }
  return { isValid: true, error: null };
};

const validateSignUp = (form) => {
  const { username, firstName, lastName, phone, email, gender, birthDate, password, confirmPassword } = form;

  if (!username?.trim()) return { isValid: false, error: 'Username is required.' };
  if (!firstName?.trim()) return { isValid: false, error: 'First name is required.' };
  if (!lastName?.trim()) return { isValid: false, error: 'Last name is required.' };
  if (!phone?.trim()) return { isValid: false, error: 'Phone number is required.' };
  if (!email?.trim()) return { isValid: false, error: 'Email is required.' };
  if (!gender) return { isValid: false, error: 'Please select your gender.' };
  if (!birthDate) return { isValid: false, error: 'Birth date is required.' };
  if (!password) return { isValid: false, error: 'Password is required.' };
  if (!confirmPassword) return { isValid: false, error: 'Please confirm your password.' };

  if (!EMAIL_REGEX.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }
  if (!EGYPTIAN_PHONE_REGEX.test(phone)) {
    return { isValid: false, error: 'Invalid Egyptian phone number. Must start with 010, 011, 012, or 015.' };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { isValid: false, error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` };
  }
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match.' };
  }

  return { isValid: true, error: null };
};

// ============================================================================
// Hook
// ============================================================================

/**
 * useAuth - Authentication hook for sign in and sign up
 * Uses the global auth context from AppProvider
 */
const useAuth = () => {
  const navigate = useNavigate();
  const { login: appLogin } = useAppAuth();  // ✅ Changed: use the store's login method

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const clearError = useCallback(() => setError(''), []);

  /**
   * Sign in user
   */
  const signIn = useCallback(async ({ identifier, password }) => {
    const validation = validateSignIn({ identifier, password });
    if (!validation.isValid) {
      setError(validation.error);
      return false;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await login({ identifier, password });
      
      if (!response.success) {
        setError(response.message);
        return false;
      }

      const userData = response.data;
      
      // ✅ Changed: Use appLogin from store (expects { token, expiresOn, message })
      const loginSuccess = appLogin({
        token: userData.token,
        expiresOn: userData.expiresOn,
        message: userData.message,
      });
      
      if (!loginSuccess) {
        setError('Failed to authenticate. Please try again.');
        return false;
      }

      // Extract role from token (stored in user object after login)
      // We need to wait a moment for the auth context to update
      setTimeout(() => {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const role = storedUser?.role?.toLowerCase();
        const redirectPath = ROLE_REDIRECTS[role] || DEFAULT_REDIRECT;
        navigate(redirectPath, { replace: true });
      }, 100);
      
      return true;
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [navigate, appLogin]);

  /**
   * Sign up user
   */
  const signUp = useCallback(async (formData) => {
    const validation = validateSignUp(formData);
    if (!validation.isValid) {
      setError(validation.error);
      return false;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await register(formData);
      
      if (!response.success) {
        setError(response.message);
        return false;
      }

      const userData = response.data;
      
      // ✅ Changed: Use appLogin from store
      const loginSuccess = appLogin({
        token: userData.token,
        expiresOn: userData.expiresOn,
        message: userData.message,
      });
      
      if (!loginSuccess) {
        setError('Registration successful but login failed. Please sign in manually.');
        navigate('/signin');
        return false;
      }

      navigate('/', { replace: true });
      return true;
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [navigate, appLogin]);

  return { signIn, signUp, loading, error, clearError };
};

export default useAuth;