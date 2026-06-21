// src/features/admin/components/users/UserTable.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UserActionsMenu from './UserActionsMenu';
import UserRoleBadge from './UserRoleBadge';
import TableSkeleton from '../common/TableSkeleton';
import EmptyState from '../common/EmptyState';
import ErrorState from '../common/ErrorState';
import Pagination from '../../../../shared/components/Pagination';

const UserRow = ({ user, currentUser, onViewDetails, onChangeRole, onToggleBan }) => {
  const isSelf = currentUser?.id === user?.id;
  const isSuperAdmin = currentUser?.role === 'SuperAdmin';
  const isAdmin = currentUser?.role === 'Admin';
  const isTargetAdmin = user?.role === 'Admin';
  const isTargetSuperAdmin = user?.role === 'SuperAdmin';

  // Determine what actions are allowed
  const canModifyRole = !isSelf && !isTargetSuperAdmin && (isSuperAdmin || (!isTargetAdmin && isAdmin));
  const canToggleBan = !isSelf && !isTargetSuperAdmin && (isSuperAdmin || !isTargetAdmin);

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="border-b border-gray-50 last:border-0 hover:bg-[#EEEDFE]/30 transition-colors"
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#534AB7] to-purple-500 flex items-center justify-center text-white text-xs font-medium">
            {user.fullName?.charAt(0) || user.userName?.charAt(0) || '?'}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{user.fullName}</p>
            <p className="text-xs text-gray-400">@{user.userName}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm text-gray-600">{user.email}</p>
      </td>
      <td className="px-4 py-3">
        <UserRoleBadge role={user.role} />
      </td>
      <td className="px-4 py-3">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          user.isLocked 
            ? 'bg-red-100 text-red-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {user.isLocked ? 'Banned' : 'Active'}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <UserActionsMenu
          user={user}
          currentUser={currentUser}
          onViewDetails={onViewDetails}
          onChangeRole={onChangeRole}
          onToggleBan={onToggleBan}
          disableRoleChange={!canModifyRole}
          disableBan={!canToggleBan}
        />
      </td>
    </motion.tr>
  );
};

const UserTable = ({
  users,
  loading,
  error,
  onRetry,
  currentUser,
  onViewDetails,
  onChangeRole,
  onToggleBan,
  pagination,
  onPageChange,
}) => {
  if (loading) {
    return <TableSkeleton rows={5} columns={5} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (!users || users.length === 0) {
    return <EmptyState message="No users found matching your criteria." />;
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="wait">
              {users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  currentUser={currentUser}
                  onViewDetails={onViewDetails}
                  onChangeRole={onChangeRole}
                  onToggleBan={onToggleBan}
                />
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default UserTable;