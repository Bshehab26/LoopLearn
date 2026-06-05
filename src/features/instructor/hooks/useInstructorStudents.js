// src/features/instructor/hooks/useInstructorStudents.js

import { useState, useEffect, useCallback, useRef } from 'react';
import { getInstructorStudents } from '../api/instructor.api';

const DEFAULT_PAGE_SIZE = 10;

const useInstructorStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    totalCount: 0,
    pageNumber: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const [courseId, setCourseId] = useState(null);
  const [page, setPage] = useState(1);

  const abortRef = useRef(null);

  const fetchStudents = useCallback(async (activeCourseId, activePage) => {
    // Abort previous request
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const result = await getInstructorStudents({
        courseId: activeCourseId ?? undefined,
        page: activePage,
        pageSize: DEFAULT_PAGE_SIZE,
        signal: abortRef.current.signal,
      });

      // Always ensure students is an array
      const studentsArray = Array.isArray(result?.data) ? result.data : [];
      
      setStudents(studentsArray);
      setPagination(result?.pagination || {
        totalCount: studentsArray.length,
        pageNumber: activePage,
        pageSize: DEFAULT_PAGE_SIZE,
      });
      
      if (!result?.success && result?.message) {
        setError(result.message);
      } else {
        setError(null);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Fetch students error:', err);
        setStudents([]);
        setError(err.message || 'Failed to load students');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents(courseId, page);
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [courseId, page, fetchStudents]);

  const filterByCourse = useCallback((id) => {
    setCourseId(id ?? null);
    setPage(1);
  }, []);

  const totalPages = Math.max(1, Math.ceil(pagination.totalCount / DEFAULT_PAGE_SIZE));

  const goToPage = useCallback((n) => {
    setPage(Math.max(1, Math.min(n, totalPages)));
  }, [totalPages]);

  return {
    students,
    loading,
    error,
    pagination,
    totalPages,
    currentPage: page,
    activeCourseId: courseId,
    filterByCourse,
    goToPage,
    goNext: () => goToPage(page + 1),
    goPrev: () => goToPage(page - 1),
    isFirstPage: page === 1,
    isLastPage: page === totalPages,
    refetch: () => fetchStudents(courseId, page),
  };
};

export default useInstructorStudents;