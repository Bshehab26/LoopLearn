// src/features/profile/hooks/useProfile.js
import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../../../store/AppProvider';
import { getProfile, updateProfile, changePassword, updateAvatar } from '../api/profile.api';
import { uploadAvatar } from '../../../shared/api/upload.api';

const TOAST_DURATION = 3500;

// ============================================================================
// Hook
// ============================================================================

/**
 * useProfile - Manages user profile operations
 * @returns {Object} Profile state and handler functions
 */
export const useProfile= () => {
  const { isAuthenticated, user, updateUser } = useAuth();

  // State
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const abortRef = useRef(null);
  const toastTimeoutRef = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ message, type });
    toastTimeoutRef.current = setTimeout(() => setToast(null), TOAST_DURATION);
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);
    try {
      const data = await getProfile({ signal: controller.signal });
      setProfile(data);
      return data;
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to load profile');
        showToast(err.message || 'Failed to load profile', 'error');
      }
      throw err;
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, [isAuthenticated, showToast]);

  useEffect(() => {
    fetchProfile().catch(() => {});
    return () => {
      if (abortRef.current) abortRef.current.abort();
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, [fetchProfile]);

  // Update profile – expects { firstName, lastName, email, phone }
 const updateUserProfile = useCallback(async (formData) => {
  setSaving(true);
  setError(null);
  try {
    const updated = await updateProfile(formData);
    setProfile(updated);
    if (updateUser) updateUser(updated); // now defined
    showToast('Profile updated successfully');
    return { success: true, data: updated };
  } catch (err) {
    const message = err.message || 'Failed to update profile';
    setError(message);
    showToast(message, 'error');
    return { success: false, error: message };
  } finally {
    setSaving(false);
  }
}, [updateUser, showToast]);

const updateUserAvatar = useCallback(async (file) => {
  setSaving(true);
  setError(null);
  try {
    const imageUrl = await uploadAvatar(file);
    const updated = await updateAvatar(imageUrl);
    setProfile(updated);
    if (updateUser) updateUser(updated);
    showToast('Profile photo updated');
    return { success: true, data: updated };
  } catch (err) {
    const message = err.message || 'Failed to update avatar';
    setError(message);
    showToast(message, 'error');
    return { success: false, error: message };
  } finally {
    setSaving(false);
  }
}, [updateUser, showToast]);

  // Change password – expects { oldPassword, newPassword }
  const updatePassword = useCallback(async (passwordData) => {
    setSaving(true);
    setError(null);
    try {
      await changePassword(passwordData);
      showToast('Password changed successfully');
      return { success: true };
    } catch (err) {
      const message = err.message || 'Failed to change password';
      setError(message);
      showToast(message, 'error');
      return { success: false, error: message };
    } finally {
      setSaving(false);
    }
  }, [showToast]);

  const isStudent = user?.role?.toLowerCase() === 'student';
  const isInstructor = user?.role?.toLowerCase() === 'instructor';
  const isAdmin = user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'superadmin';

  return {
    profile,
    loading,
    saving,
    error,
    toast,
    isStudent,
    isInstructor,
    isAdmin,
    userRole: user?.role,
    fetchProfile,
    updateUserProfile,
    updatePassword,
    updateUserAvatar,
    showToast,
  };
};

export default useProfile;