// src/features/admin/hooks/useAdminUsers.js

import { useState, useEffect, useCallback } from 'react';
import { getAdminUsers } from '../api/admin.api';
import useDebounce from '../../../shared/hooks/useDebounce';

const useAdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState('All');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
  });
  const [roleOptions, setRoleOptions] = useState(['All', 'SuperAdmin', 'Admin', 'Instructor', 'Student']);

  const debouncedSearch = useDebounce(search, 500);

  const fetchUsers = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page,
        pageSize: pagination.pageSize,
      };
      
      if (role !== 'All') params.role = role;
      if (debouncedSearch.trim()) params.searchTerm = debouncedSearch.trim();
      
      const response = await getAdminUsers(params);
      
      if (response.success) {
        setUsers(response.data);
        const p = response.pagination || {};
        setPagination(prev => ({
          ...prev,
          currentPage: p.page || page,
          totalItems: p.totalCount || 0,
          totalPages: p.totalPages || 1,
          pageSize: p.pageSize || prev.pageSize,
        }));
      } else {
        setError(response.message || 'Failed to load users.');
      }
    } catch (err) {
      setError(err.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [role, debouncedSearch, pagination.pageSize]);

  useEffect(() => {
    fetchUsers(pagination.currentPage);
  }, [fetchUsers]);

  const setPage = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchUsers(newPage);
    }
  };

  const refetch = useCallback(() => {
    fetchUsers(pagination.currentPage);
  }, [fetchUsers, pagination.currentPage]);

  return {
    users,
    loading,
    error,
    role,
    setRole,
    search,
    setSearch,
    pagination,
    setPage,
    roleOptions,
    refetch,
  };
};

export default useAdminUsers;