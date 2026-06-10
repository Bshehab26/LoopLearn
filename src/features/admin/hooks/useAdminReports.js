// src/features/admin/hooks/useAdminReports.js

import { useState, useCallback } from 'react';
import { getReports } from '../api/admin.api';

const useAdminReports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('revenue');

  const fetchReports = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getReports({ ...params, type: activeTab });
      
      if (response.success) {
        setReports(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  const exportReport = useCallback((format = 'csv') => {
    if (!reports) return;
    console.log(`Exporting ${activeTab} report as ${format}`);
    alert(`Report exported as ${format.toUpperCase()}`);
  }, [reports, activeTab]);

  return {
    reports,
    loading,
    error,
    activeTab,
    setActiveTab,
    fetchReports,
    exportReport,
  };
};

export default useAdminReports;