import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { ROLES } from '../../shared/constants/roles';
import { getToken, getUser, saveToken, removeToken, saveUser, clearUser } from '../../services/utils/tokenUtils';

const isTokenValid = () => {
  const token = getToken();
  if (!token) return false;
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return !(decoded.exp && decoded.exp * 1000 < Date.now());
  } catch {
    return false;
  }
};

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const userData = getUser();
    console.log('🔧 Initial user load:', userData);
    return userData;
  });
  const [loading, setLoading] = useState(true);

  const login = useCallback((token, expiresOn) => {
    console.log('🔐 Login called with token');
    saveToken(token, expiresOn);
    const userData = getUser();
    console.log('👤 User after login:', userData);
    setUser(userData);
    if (userData) {
      saveUser(userData);
    }
    
    window.dispatchEvent(new CustomEvent('user-logged-in', { 
      detail: { user: userData, timestamp: Date.now() } 
    }));
    
    return userData;
  }, []);

  const logout = useCallback(() => {
    removeToken();
    clearUser();
    setUser(null);
    window.dispatchEvent(new CustomEvent('user-logged-out'));
  }, []);

  const updateUser = useCallback((updatedData) => {
    setUser(prev => {
      const updated = { ...prev, ...updatedData };
      saveUser(updated);
      return updated;
    });
  }, []);

  const setUserAvatar = useCallback((avatarUrl) => {
    console.log('🖼️ Setting avatar in AuthContext:', avatarUrl);
    setUser(prev => {
      const updated = { ...prev, avatar: avatarUrl };
      saveUser(updated);
      return updated;
    });
  }, []);

  const refreshUser = useCallback(() => {
    const freshUser = getUser();
    console.log('🔄 Refreshing user:', freshUser);
    if (freshUser) {
      setUser(freshUser);
      saveUser(freshUser);
    }
    return freshUser;
  }, []);

  const isAuthenticated = !!user && isTokenValid();
  const role = user?.role || null;
  const isStudent = role === ROLES.STUDENT;
  const isInstructor = role === ROLES.INSTRUCTOR;
  const isAdmin = role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;

  useEffect(() => {
    setLoading(false);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    isStudent,
    isInstructor,
    isAdmin,
    role,
    login,
    logout,
    updateUser,
    setUserAvatar,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};