// src/features/student/hooks/useEnrollments.js
import { useState, useEffect, useCallback } from 'react';
import { getEnrolledCourses, getCourseProgress } from '../api/enrollment.api';
import { useAuth } from '../../../store/AppProvider';

const COURSES_PER_PAGE = 5;

const useEnrollments = () => {
  const { isAuthenticated } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [progressData, setProgressData] = useState({});

  // Fetch enrolled courses
  const fetchEnrolledCourses = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getEnrolledCourses();
      if (response.success) {
        setEnrolledCourses(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch enrolled courses:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch progress for each enrolled course
  const fetchProgress = useCallback(async () => {
    if (!enrolledCourses.length) return;
    
    const progressMap = {};
    for (const course of enrolledCourses) {
      try {
        const result = await getCourseProgress(course.courseId || course.id);
        if (result.success) {
          progressMap[course.courseId || course.id] = result.data;
        }
      } catch (error) {
        console.error('Failed to fetch progress:', error);
        progressMap[course.courseId || course.id] = {
          completedLessons: 0,
          totalLessons: 0,
          percentage: 0,
        };
      }
    }
    setProgressData(progressMap);
  }, [enrolledCourses]);

  useEffect(() => {
    fetchEnrolledCourses();
  }, [fetchEnrolledCourses]);

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      fetchProgress();
    }
  }, [enrolledCourses, fetchProgress]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const totalPages = Math.ceil(enrolledCourses.length / COURSES_PER_PAGE);
  const indexOfFirst = (currentPage - 1) * COURSES_PER_PAGE;
  const indexOfLast = indexOfFirst + COURSES_PER_PAGE;
  const currentCourses = enrolledCourses.slice(indexOfFirst, indexOfLast);

  const getProgress = (courseId) => {
    return progressData[courseId] || null;
  };

  const getProgressForIndex = (localIndex) => {
    const course = currentCourses[localIndex];
    return course ? getProgress(course.courseId || course.id) : null;
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return {
    currentCourses,
    currentPage,
    totalPages,
    loading,
    getProgress: getProgressForIndex,
    goToPage,
    isEmpty: !loading && enrolledCourses.length === 0,
    refetch: fetchEnrolledCourses,
  };
};

export default useEnrollments;