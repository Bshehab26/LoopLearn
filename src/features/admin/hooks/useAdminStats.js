// src/features/admin/hooks/useAdminStats.js

import { useState, useEffect, useCallback } from 'react';
import { getDashboardStats } from '../api/admin.api';

const useAdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDashboardStats();
      if (response.success) {
        setStats(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to load stats');
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