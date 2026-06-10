// src/features/admin/pages/Users.jsx

import { useState, useEffect } from 'react';
import UserTable from '../components/UserTable';
import UserFilters from '../components/UserFilters';
import useAdminUsers from '../hooks/useAdminUsers';

const Users = () => {
  const {
    users,
    loading,
    pagination,
    fetchUsers,
    changeUserRole,
    removeUser,
    suspendUserAccount,
    activateUserAccount,
  } = useAdminUsers();

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    role: '',
    status: '',
  });

  useEffect(() => {
    fetchUsers(filters);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <p className="text-gray-500 mt-1">Manage platform users, roles, and permissions</p>
      </div>

      <UserFilters filters={filters} onFilterChange={handleFilterChange} />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <UserTable
          users={users}
          loading={loading}
          onRoleChange={changeUserRole}
          onDelete={removeUser}
          onSuspend={suspendUserAccount}
          onActivate={activateUserAccount}
        />

        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 py-4 border-t border-gray-100">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1 rounded-lg text-sm border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-1 rounded-lg text-sm border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;