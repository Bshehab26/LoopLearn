// src/features/student/hooks/useEnrollments.js
//
// CHANGED: Uses real API data from EnrolledCourseDTO.
// progressPercentage comes directly from the backend — no fake progress array.
// getCourseProgress mock is no longer called on mount (still available for future use).

import { useState, useEffect, useCallback } from 'react';
import { getEnrolledCourses } from '../api/enrollment.api';
import { useAuth } from '../../../store/AppProvider';

const COURSES_PER_PAGE = 5;

const useEnrollments = () => {
  const { isAuthenticated } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [currentPage, setCurrentPage]         = useState(1);

  const fetchEnrolledCourses = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await getEnrolledCourses();
      if (response.success) {
        // EnrolledCourseDTO[] — progressPercentage already included
        setEnrolledCourses(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch enrolled courses:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => { fetchEnrolledCourses(); }, [fetchEnrolledCourses]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const totalPages   = Math.ceil(enrolledCourses.length / COURSES_PER_PAGE);
  const indexOfFirst = (currentPage - 1) * COURSES_PER_PAGE;
  const currentCourses = enrolledCourses.slice(indexOfFirst, indexOfFirst + COURSES_PER_PAGE);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return {
    currentCourses,
    currentPage,
    totalPages,
    loading,
    goToPage,
    isEmpty: !loading && enrolledCourses.length === 0,
    refetch: fetchEnrolledCourses,
  };
};

export default useEnrollments;