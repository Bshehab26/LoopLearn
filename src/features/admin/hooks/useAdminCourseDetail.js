// src/features/admin/hooks/useAdminCourseDetail.js

import { useState, useEffect, useCallback } from 'react';
import { getAdminCourseById } from '../api/admin.api';

const useAdminCourseDetail = (courseId) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDetail = useCallback(async () => {
    if (!courseId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminCourseById(courseId);
      if (res.success) setCourse(res.data);
      else setError(res.message || 'Failed to load course details.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load course details.');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) fetchDetail();
    else setCourse(null);
  }, [courseId, fetchDetail]);

  return { course, loading, error, refetch: fetchDetail };
};

export default useAdminCourseDetail;