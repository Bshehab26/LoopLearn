// src/store/AppProvider.jsx
import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ProfileProvider } from './contexts/ProfileContext';
import { UIProvider } from './contexts/UIContext';
import { CourseProvider } from './contexts/CourseContext';

// ============================================================================
// Combined Provider - Wraps all contexts
// Order matters: Auth must be first (Profile depends on it)
// ============================================================================

export const AppProvider = ({ children }) => {
  return (
    <AuthProvider>
      <ProfileProvider>
        <UIProvider>
          <CourseProvider>
            {children}
          </CourseProvider>
        </UIProvider>
      </ProfileProvider>
    </AuthProvider>
  );
};

// ============================================================================
// Re-export all hooks for convenience
// ============================================================================

export { useAuth } from './contexts/AuthContext';
export { useProfile } from './contexts/ProfileContext';
export { useUI } from './contexts/UIContext';
export { useCourseContext } from './contexts/CourseContext';