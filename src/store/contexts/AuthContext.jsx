import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { ROLES } from '../../shared/constants/roles';
import { getToken, getUser, saveToken, removeToken } from '../../services/utils/tokenUtils';

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
  const [user, setUser] = useState(() => getUser());
  const [loading, setLoading] = useState(true);

  const login = useCallback((token, expiresOn) => {
    saveToken(token, expiresOn);
    // Force user state update by reading from token
    setUser(getUser());
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  }, []);

  // Derived authentication status: user exists AND token is not expired
  const isAuthenticated = !!user && isTokenValid();

  const role = user?.role || null;
  const isStudent = role === ROLES.STUDENT;
  const isInstructor = role === ROLES.INSTRUCTOR;
  const isAdmin = role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;

  // Listen for cookie changes (e.g., logout from another tab)
  useEffect(() => {
    const handleCookieChange = () => {
      setUser(getUser());
    };
    // Polling is not ideal, but storage events don't work for cookies.
    // A better approach is to use a custom event. For simplicity, we'll rely on
    // the fact that login/logout happen in the same tab and trigger re-renders.
    // This effect ensures initial loading is done.
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