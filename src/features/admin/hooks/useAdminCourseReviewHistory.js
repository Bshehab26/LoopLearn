// src/features/admin/hooks/useAdminCourseReviewHistory.js
//
// Fetches GET /api/Admin/courses/{id}/review-history on demand.
// Returns history newest-first (the backend already orders this way).

import { useState, useEffect, useCallback } from 'react';
import { getAdminCourseReviewHistory } from '../api/admin.api';

const useAdminCourseReviewHistory = (courseId) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    if (!courseId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminCourseReviewHistory(courseId);
      if (res.success) setHistory(res.data || []);
      else setError(res.message || 'Failed to load review history.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load review history.');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) fetchHistory();
    else setHistory([]);
  }, [courseId, fetchHistory]);

  return { history, loading, error, refetch: fetchHistory };
};

export default useAdminCourseReviewHistory;
