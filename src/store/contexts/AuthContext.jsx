// src/store/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { ROLES } from '../../shared/constants/roles';
import { getToken, getUser, saveToken, removeToken, saveUser, clearUser } from '../../services/utils/tokenUtils';

// Helper: check if token exists and not expired
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
    const initialUser = getUser();
    console.log('🔧 AuthProvider initial user:', initialUser);
    return initialUser;
  });
  const [loading, setLoading] = useState(true);

  const login = useCallback((token, expiresOn) => {
    console.log('🔐 Login called with token:', token?.substring(0, 50) + '...');
    saveToken(token, expiresOn);
    // Force user state update by reading from token
    const userData = getUser();
    console.log('👤 User data after login:', userData);
    setUser(userData);
    // Save to localStorage for avatar persistence
    if (userData) {
      saveUser(userData);
    }
  }, []);

  const logout = useCallback(() => {
    removeToken();
    clearUser();
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedData) => {
    console.log('🔄 updateUser called with:', updatedData);
    setUser(prev => {
      const updated = { ...prev, ...updatedData };
      console.log('📝 Updated user:', updated);
      // Also update localStorage
      saveUser(updated);
      return updated;
    });
  }, []);

  // Derived authentication status
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
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};