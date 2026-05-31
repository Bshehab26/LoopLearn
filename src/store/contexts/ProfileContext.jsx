import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getProfile, updateProfile, changePassword, updateAvatar } from '../../features/profile/api/profile.api';

const ProfileContext = createContext(null);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfile must be used within ProfileProvider');
  return context;
};

export const ProfileProvider = ({ children }) => {
  const { user, setUserAvatar, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated && !user?.id) {
      console.log('⚠️ Not authenticated, skipping profile fetch');
      setProfile(null);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await getProfile();
      console.log('📥 Profile fetched:', response);
      if (response.success) {
        setProfile(response.data);
        if (response.data?.avatar) {
          console.log('✅ Setting avatar from profile:', response.data.avatar);
          setUserAvatar(response.data.avatar);
        }
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.error('❌ Profile fetch error:', err);
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id, setUserAvatar]);

  useEffect(() => {
    if (user?.id) {
      console.log('🔄 User ID detected, fetching profile...');
      fetchProfile();
    }
  }, [user?.id, fetchProfile]);

  useEffect(() => {
    const handleUserLogin = (event) => {
      console.log('🎉 User logged in event received:', event.detail);
      setTimeout(() => {
        fetchProfile();
      }, 100);
    };
    
    window.addEventListener('user-logged-in', handleUserLogin);
    return () => window.removeEventListener('user-logged-in', handleUserLogin);
  }, [fetchProfile]);

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

  const changeUserPassword = useCallback(async (oldPassword, newPassword, confirmPassword) => {
    setLoading(true);
    setError(null);
    try {
      const response = await changePassword({ oldPassword, newPassword, confirmPassword });
      if (response.success) return { success: true, message: response.message };
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

  const editAvatar = useCallback(async (avatarUrl) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateAvatar(avatarUrl);
      if (response.success) {
        setProfile(response.data);
        if (response.data?.avatar) {
          console.log('🖼️ Avatar updated, syncing to AuthContext:', response.data.avatar);
          setUserAvatar(response.data.avatar);
        }
        window.dispatchEvent(new CustomEvent('avatar-updated', { 
          detail: { avatarUrl: response.data.avatar, timestamp: Date.now() } 
        }));
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
  }, [setUserAvatar]);

  return (
    <ProfileContext.Provider value={{
      profile, loading, error,
      fetchProfile, editProfile, changeUserPassword, editAvatar,
    }}>
      {children}
    </ProfileContext.Provider>
  );
};