// src/features/admin/hooks/useAdminUsers.js

import { useState, useCallback } from 'react';
import { getUsers, updateUserRole, deleteUser, suspendUser, activateUser } from '../api/admin.api';

const useAdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchUsers = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUsers({ ...params, page: params.page || pagination.page });
      if (response.success) {
        setUsers(response.data);
        setPagination({
          page: response.pagination?.page || 1,
          limit: response.pagination?.limit || 10,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.totalPages || 0,
        });
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [pagination.page]);

  const changeUserRole = useCallback(async (userId, newRole) => {
    const response = await updateUserRole(userId, newRole);
    if (response.success) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    }
    return response;
  }, []);

  const removeUser = useCallback(async (userId) => {
    const response = await deleteUser(userId);
    if (response.success) {
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
    return response;
  }, []);

  const suspendUserAccount = useCallback(async (userId) => {
    const response = await suspendUser(userId);
    if (response.success) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'Suspended' } : u));
    }
    return response;
  }, []);

  const activateUserAccount = useCallback(async (userId) => {
    const response = await activateUser(userId);
    if (response.success) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'Active' } : u));
    }
    return response;
  }, []);

  return {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    changeUserRole,
    removeUser,
    suspendUserAccount,
    activateUserAccount,
  };
};

export default useAdminUsers;