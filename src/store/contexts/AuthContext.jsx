// src/store/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../../services/utils/storage';
import { isTokenExpired, getUserIdFromToken, getUserRoleFromToken } from '../../services/utils/Parsetoken';
import { ROUTES } from '../../shared/constants/routes';
import { ROLES } from '../../shared/constants/roles';

// ============================================================================
// Helper: Extract full user data from JWT token
// ============================================================================

const extractUserFromToken = (token) => {
  if (!token || isTokenExpired(token)) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Extract claims (ASP.NET Core format)
    const userId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || payload.nameid || payload.sub;
    const username = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || payload.unique_name || payload.name;
    const email = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || payload.email;
    const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role;
    
    return {
      id: userId,
      username: username,
      email: email,
      role: role,
      token: token,
      isAuthenticated: true,
    };
  } catch (error) {
    console.error('[Auth] Failed to parse token:', error);
    return null;
  }
};

// ============================================================================
// Context
// ============================================================================

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// ============================================================================
// Provider
// ============================================================================

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const isInitialized = useRef(false);

  // Login user - receives token from backend
  const login = useCallback((authResponse) => {
    const jwtToken = authResponse.token;
    
    if (!jwtToken) {
      console.error('[Auth] No token in response');
      return false;
    }
    
    const userData = extractUserFromToken(jwtToken);
    if (!userData) return false;
    
    setUser(userData);
    setToken(jwtToken);
    storage.setUser(userData);
    storage.setToken(jwtToken);
    
    return true;
  }, []);

  // Logout user
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    storage.removeUser();
    storage.removeToken();
    navigate(ROUTES.SIGN_IN);
  }, [navigate]);

  // Update token (when refreshed)
  const updateToken = useCallback((newToken) => {
    const userData = extractUserFromToken(newToken);
    if (userData) {
      setUser(userData);
      setToken(newToken);
      storage.setUser(userData);
      storage.setToken(newToken);
    }
  }, []);

  // Initialize auth from storage
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const storedUser = storage.getUser();
    const storedToken = storage.getToken();

    if (storedUser?.token && storedToken && !isTokenExpired(storedToken)) {
      setUser(storedUser);
      setToken(storedToken);
    } else if (storedToken && isTokenExpired(storedToken)) {
      storage.removeUser();
      storage.removeToken();
    }
    
    setLoading(false);
  }, []);

  // Role helpers
  const isStudent = user?.role === ROLES.STUDENT;
  const isInstructor = user?.role === ROLES.INSTRUCTOR;
  const isAdmin = user?.role === ROLES.ADMIN || user?.role === ROLES.SUPER_ADMIN;
  const isAuthenticated = !!user?.isAuthenticated && !isTokenExpired(token);

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    isStudent,
    isInstructor,
    isAdmin,
    login,
    logout,
    updateToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};