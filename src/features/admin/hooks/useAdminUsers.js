// src/features/admin/hooks/useAdminUsers.js

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getAdminUsers } from '../api/admin.api';

const PAGE_SIZE = 10;
const ROLE_OPTIONS = ['All', 'SuperAdmin', 'Admin', 'Instructor', 'Student'];

const useAdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [role, setRoleState] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ totalCount: 0, totalPages: 1 });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const apiRole = role === 'All' ? undefined : role;
      const res = await getAdminUsers({ role: apiRole, page, pageSize: PAGE_SIZE });

      console.log('[useAdminUsers] Response:', res); // Debug log

      if (res.success) {
        setUsers(res.data || []);
        setMeta({
          totalCount: res.pagination?.totalCount || 0,
          totalPages: res.pagination?.totalPages || 1,
        });
      } else {
        setError(res.message || 'Failed to load users');
        setUsers([]);
      }
    } catch (err) {
      // The backend returns 404 when a role filter matches zero users
      if (err.response?.status === 404) {
        setUsers([]);
        setMeta({ totalCount: 0, totalPages: 1 });
      } else {
        setError(err.response?.data?.message || 'Something went wrong while loading users.');
        setUsers([]);
      }
    } finally {
      setLoading(false);
    }
  }, [role, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Changing the role filter should always reset back to page 1
  const setRole = useCallback((nextRole) => {
    setRoleState(nextRole);
    setPage(1);
  }, []);

  const visibleUsers = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.trim().toLowerCase();
    return users.filter((u) =>
      u.fullName?.toLowerCase().includes(q) ||
      u.userName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  }, [users, search]);

  return {
    users: visibleUsers,
    loading,
    error,
    role,
    setRole,
    search,
    setSearch,
    page,
    setPage,
    pagination: {
      page,
      pageSize: PAGE_SIZE,
      totalCount: meta.totalCount,
      totalPages: meta.totalPages,
    },
    roleOptions: ROLE_OPTIONS,
    refetch: fetchUsers,
  };
};

export default useAdminUsers;