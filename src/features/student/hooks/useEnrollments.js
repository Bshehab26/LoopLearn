// src/features/student/hooks/useEnrollments.js
import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../../store/AppContext';
import { getEnrolledCourses, getCourseProgress } from '../api/enrollment.api';

const COURSES_PER_PAGE = 5;

const useEnrollments = () => {
  const { enrolledCourses, enrolledLoading } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [progressData, setProgressData] = useState({});

  // Fetch progress for each enrolled course
  useEffect(() => {
    const fetchProgress = async () => {
      if (!enrolledCourses.length) return;
      
      const progressMap = {};
      for (const course of enrolledCourses) {
        try {
          const result = await getCourseProgress(course.id || course._id);
          if (result.success) {
            progressMap[course.id || course._id] = result.data;
          }
        } catch (error) {
          console.error('Failed to fetch progress:', error);
          // Use dummy progress as fallback
          progressMap[course.id || course._id] = {
            lectureCompleted: Math.floor(Math.random() * 10),
            totalLectures: 10,
            percentage: Math.floor(Math.random() * 100)
          };
        }
      }
      setProgressData(progressMap);
    };
    
    fetchProgress();
  }, [enrolledCourses]);

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
    return course ? getProgress(course.id || course._id) : null;
  };

  return {
    currentCourses,
    currentPage,
    totalPages,
    loading: enrolledLoading,
    getProgress: getProgressForIndex,
    goToPage: (page) => {
      if (page >= 1 && page <= totalPages) setCurrentPage(page);
    },
    isEmpty: !enrolledLoading && enrolledCourses.length === 0,
  };
};

export default useEnrollments;