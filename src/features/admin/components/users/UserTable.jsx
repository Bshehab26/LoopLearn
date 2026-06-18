// src/features/admin/components/users/UserTable.jsx

import React from 'react';
import UserRoleBadge from './UserRoleBadge';
import UserActionsMenu from './UserActionsMenu';
import Avatar from '../common/Avatar';
import StatusBadge from '../common/StatusBadge';
import TableSkeleton from '../common/TableSkeleton';
import EmptyState from '../common/EmptyState';
import ErrorState from '../common/ErrorState';
// Shared, app-wide pagination UI — controlled via currentPage/totalPages/onPageChange.
import Pagination from '../../../../shared/components/Pagination';
import { HiOutlineUserGroup } from 'react-icons/hi';

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const UserTable = ({
  users,
  loading,
  error,
  onRetry,
  currentUserId,
  onViewDetails,
  onChangeRole,
  onToggleBan,
  pagination,
  onPageChange,
}) => {
  if (loading) return <TableSkeleton rows={6} columns={5} />;

  if (error) return <ErrorState message={error} onRetry={onRetry} />;

  if (!users.length) {
    return (
      <EmptyState
        icon={HiOutlineUserGroup}
        title="No users found"
        description="Try a different search term or role filter."
      />
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-[11px] uppercase tracking-wide text-gray-400">
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Last login</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isSelf = u.id === currentUserId;
              const isSuperAdmin = u.role === 'SuperAdmin';
              return (
                <tr key={u.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={u.fullName} size={32} />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 truncate">{u.fullName}</p>
                        <p className="text-xs text-gray-400 truncate">@{u.userName} · {u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><UserRoleBadge role={u.role} /></td>
                  <td className="px-4 py-3">
                    {u.isLocked
                      ? <StatusBadge label="Banned" tone="red" dot />
                      : <StatusBadge label="Active" tone="green" dot />}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(u.lastLoginAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <UserActionsMenu
                      user={u}
                      onViewDetails={onViewDetails}
                      onChangeRole={onChangeRole}
                      onToggleBan={onToggleBan}
                      disableRoleChange={isSelf || isSuperAdmin}
                      disableBan={isSelf || isSuperAdmin}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing{' '}
            <span className="font-medium text-gray-600">
              {(pagination.page - 1) * pagination.pageSize + 1}
              –
              {Math.min(pagination.page * pagination.pageSize, pagination.totalCount)}
            </span>{' '}
            of <span className="font-medium text-gray-600">{pagination.totalCount}</span>
          </p>
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </>
  );
};

export default UserTable;
