// src/features/admin/hooks/useAdminCourses.js

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getAdminCourses } from '../api/admin.api';

const PAGE_SIZE = 10;

const useAdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusCounts, setStatusCounts] = useState({});

  const [status, setStatusState] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ totalCount: 0, totalPages: 1 });

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const apiStatus = status === 'all' ? undefined : status;
      const res = await getAdminCourses({ status: apiStatus, page, pageSize: PAGE_SIZE });

      console.log('[useAdminCourses] Response:', res);

      if (res.success) {
        setCourses(res.data || []);
        setStatusCounts(res.coursesStatusCounts || {});
        setMeta({
          totalCount: res.pagination?.totalCount || 0,
          totalPages: res.pagination?.totalPages || 1,
        });
      } else {
        setError(res.message || 'Failed to load courses');
        setCourses([]);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setCourses([]);
        setMeta({ totalCount: 0, totalPages: 1 });
      } else {
        setError(err.response?.data?.message || 'Something went wrong while loading courses.');
        setCourses([]);
      }
    } finally {
      setLoading(false);
    }
  }, [status, page]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const setStatus = useCallback((nextStatus) => {
    setStatusState(nextStatus);
    setPage(1);
  }, []);

  const visibleCourses = useMemo(() => {
    if (!search.trim()) return courses;
    const q = search.trim().toLowerCase();
    return courses.filter((c) =>
      c.title?.toLowerCase().includes(q) ||
      c.instructorName?.toLowerCase().includes(q) ||
      c.category?.toLowerCase().includes(q)
    );
  }, [courses, search]);

  return {
    courses: visibleCourses,
    allCourses: courses,
    loading,
    error,
    status,
    setStatus,
    search,
    setSearch,
    page,
    setPage,
    statusCounts,
    pagination: {
      page,
      pageSize: PAGE_SIZE,
      totalCount: meta.totalCount,
      totalPages: meta.totalPages,
    },
    refetch: fetchCourses,
  };
};

export default useAdminCourses;