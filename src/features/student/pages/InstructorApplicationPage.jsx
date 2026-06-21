// src/features/student/pages/InstructorApplicationPage.jsx

import React from 'react';
import InstructorApplication from '../components/InstructorApplication';
import { useAuth } from '../../../store/AppProvider';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes';

const InstructorApplicationPage = () => {
  const { isAuthenticated, user, isInstructorRequested } = useAuth();

  // Redirect if not logged in
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.SIGN_IN} replace />;
  }

  // If already instructor, redirect to dashboard
  if (user?.role === 'Instructor' || user?.role === 'Admin' || user?.role === 'SuperAdmin') {
    return <Navigate to={ROUTES.INSTRUCTOR_DASHBOARD} replace />;
  }

  // If has pending application, show the status page
  // The InstructorApplication component will handle showing the status

  return <InstructorApplication />;
};

export default InstructorApplicationPage;