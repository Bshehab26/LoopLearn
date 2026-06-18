// src/features/admin/hooks/useAdminUserDetail.js
//
// Fetches GET /api/admin/users/{id} on demand. Pass `null`/`undefined` as
// userId to skip fetching (e.g. while a drawer is closed).

import { useState, useEffect, useCallback } from 'react';
import { getAdminUserById } from '../api/admin.api';

const useAdminUserDetail = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDetail = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminUserById(userId);
      if (res.success) setUser(res.data);
      else setError(res.message || 'Failed to load user details.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load user details.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) fetchDetail();
    else setUser(null);
  }, [userId, fetchDetail]);

  return { user, loading, error, refetch: fetchDetail };
};

export default useAdminUserDetail;
