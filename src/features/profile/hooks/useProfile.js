/**
 * useProfile.js
 * Custom hook for managing user profile data using the unified /Profile endpoint.
 * Handles profile fetching, updates, avatar uploads, and password changes.
 * 
 * @module features/profile/hooks/useProfile
 */

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../../../store/AppProvider';
import { 
  getProfile, 
  updateProfile, 
  changePassword, 
  updateAvatar,
  updateProfileAvatar
} from '../api/profile.api';

// ============================================================================
// Constants
// ============================================================================

const TOAST_DURATION = 3500;

// ============================================================================
// Hook
// ============================================================================

const useProfile = () => {
  const { isAuthenticated, user } = useAuth();
  
  // State
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Toast helper
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), TOAST_DURATION);
  }, []);

  // Fetch profile
  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await getProfile();
      
      if (response.success) {
        setProfile(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Update profile (basic info)
  const updateUserProfile = useCallback(async (updates) => {
    try {
      setSaving(true);
      setError(null);
      
      const response = await updateProfile(updates);
      
      if (response.success) {
        setProfile(response.data);
        showToast(response.message || 'Profile updated successfully');
        return { success: true, data: response.data };
      }
      
      setError(response.message);
      showToast(response.message || 'Failed to update profile', 'error');
      return { success: false, error: response.message };
    } catch (err) {
      const message = err.message || 'Failed to update profile';
      setError(message);
      showToast(message, 'error');
      return { success: false, error: message };
    } finally {
      setSaving(false);
    }
  }, [showToast]);

  // Change password
  const updatePassword = useCallback(async (oldPassword, newPassword, confirmPassword) => {
    try {
      setSaving(true);
      setError(null);
      
      const response = await changePassword({ oldPassword, newPassword, confirmPassword });
      
      if (response.success) {
        showToast(response.message || 'Password changed successfully');
        return { success: true };
      }
      
      setError(response.message);
      showToast(response.message || 'Failed to change password', 'error');
      return { success: false, error: response.message };
    } catch (err) {
      const message = err.message || 'Failed to change password';
      setError(message);
      showToast(message, 'error');
      return { success: false, error: message };
    } finally {
      setSaving(false);
    }
  }, [showToast]);

  // Update avatar - handles both File upload and direct URL update
  const updateUserAvatar = useCallback(async (avatarInput) => {
    try {
      setSaving(true);
      setError(null);
      
      let response;
      
      // Check if input is a File object or a URL string
      if (avatarInput instanceof File) {
        // It's a File - upload it
        response = await updateAvatar(avatarInput);
      } else if (typeof avatarInput === 'string' && avatarInput.startsWith('http')) {
        // It's a URL string - update profile directly
        response = await updateProfileAvatar(avatarInput);
      } else {
        throw new Error('Invalid input: expected File or URL string');
      }
      
      if (response.success) {
        // Refresh profile data to get the latest avatar
        await fetchProfile();
        showToast(response.message || 'Avatar updated successfully');
        return { success: true, data: response.data };
      }
      
      setError(response.message);
      showToast(response.message || 'Failed to update avatar', 'error');
      return { success: false, error: response.message };
    } catch (err) {
      const message = err.message || 'Failed to update avatar';
      setError(message);
      showToast(message, 'error');
      return { success: false, error: message };
    } finally {
      setSaving(false);
    }
  }, [showToast, fetchProfile]);

  // Load profile on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Role helpers
  const isStudent = user?.role?.toLowerCase() === 'student';
  const isInstructor = user?.role?.toLowerCase() === 'instructor';
  const isAdmin = user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'superadmin';

  return {
    // Data
    profile,
    loading,
    saving,
    error,
    toast,
    
    // Role info
    isStudent,
    isInstructor,
    isAdmin,
    userRole: user?.role,
    
    // Actions
    fetchProfile,
    updateUserProfile,
    updatePassword,
    updateUserAvatar,
    showToast,
  };
};

export default useProfile;