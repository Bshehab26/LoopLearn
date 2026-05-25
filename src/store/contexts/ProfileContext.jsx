// src/store/contexts/ProfileContext.jsx
import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getProfile, updateProfile, changePassword, updateAvatar } from '../../features/profile/api/profile.api';

// ============================================================================
// Context
// ============================================================================

const ProfileContext = createContext(null);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
};

// ============================================================================
// Provider
// ============================================================================

export const ProfileProvider = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
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

  // Update profile
  const editProfile = useCallback(async (updates) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await updateProfile(updates);
      if (response.success) {
        setProfile(response.data);
        return { success: true, data: response.data };
      }
      setError(response.message);
      return { success: false, error: response.message };
    } catch (err) {
      const message = err.message || 'Failed to update profile';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Change password
  const changeUserPassword = useCallback(async (oldPassword, newPassword, confirmPassword) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await changePassword({ oldPassword, newPassword, confirmPassword });
      if (response.success) {
        return { success: true, message: response.message };
      }
      setError(response.message);
      return { success: false, error: response.message };
    } catch (err) {
      const message = err.message || 'Failed to change password';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update avatar
  const editAvatar = useCallback(async (avatarUrl) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await updateAvatar(avatarUrl);
      if (response.success) {
        setProfile(response.data);
        return { success: true, data: response.data };
      }
      setError(response.message);
      return { success: false, error: response.message };
    } catch (err) {
      const message = err.message || 'Failed to update avatar';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Load profile when authenticated
  useEffect(() => {
    if (isAuthenticated && !profile) {
      fetchProfile();
    }
  }, [isAuthenticated, profile, fetchProfile]);

  const value = {
    profile,
    loading,
    error,
    fetchProfile,
    editProfile,
    changeUserPassword,
    editAvatar,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};