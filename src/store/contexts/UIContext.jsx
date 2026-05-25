// src/store/contexts/UIContext.jsx
import React, { createContext, useState, useContext, useCallback } from 'react';

// ============================================================================
// Context
// ============================================================================

const UIContext = createContext(null);

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within UIProvider');
  }
  return context;
};

// ============================================================================
// Provider
// ============================================================================

export const UIProvider = ({ children }) => {
  const [isNavSearchVisible, setIsNavSearchVisible] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  const [modal, setModal] = useState({ isOpen: false, type: null, data: null });
  const [loading, setLoading] = useState(false);

  // Theme management
  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  }, []);

  // Modal management
  const openModal = useCallback((type, data = null) => {
    setModal({ isOpen: true, type, data });
  }, []);

  const closeModal = useCallback(() => {
    setModal({ isOpen: false, type: null, data: null });
  }, []);

  // Sidebar
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  // Global loading
  const showLoading = useCallback(() => setLoading(true), []);
  const hideLoading = useCallback(() => setLoading(false), []);

  const value = {
    isNavSearchVisible,
    setIsNavSearchVisible,
    sidebarOpen,
    setSidebarOpen,
    toggleSidebar,
    theme,
    toggleTheme,
    modal,
    openModal,
    closeModal,
    loading,
    showLoading,
    hideLoading,
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};