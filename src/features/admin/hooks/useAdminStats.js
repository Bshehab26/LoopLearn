// src/features/admin/hooks/useAdminStats.js

import { useState, useEffect, useCallback } from 'react';
import { getAdminDashboardStats } from '../api/admin.api';

const useAdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminDashboardStats();
      
      console.log('[useAdminStats] Response:', res); // Debug log
      
      if (res.success) {
        setStats(res.data);
      } else {
        setError(res.message || 'Failed to load dashboard stats.');
      }
    } catch (err) {
      console.error('[useAdminStats] Error:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard stats.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
};

export default useAdminStats;