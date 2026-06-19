// src/features/admin/components/users/UserTable.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UserRoleBadge from './UserRoleBadge';
import UserActionsMenu from './UserActionsMenu';
import Avatar from '../common/Avatar';
import StatusBadge from '../common/StatusBadge';
import TableSkeleton from '../common/TableSkeleton';
import EmptyState from '../common/EmptyState';
import ErrorState from '../common/ErrorState';
import Pagination from '../../../../shared/components/Pagination';
import { HiOutlineUserGroup, HiOutlineMail } from 'react-icons/hi';

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const UserRow = ({ user, index, currentUserId, onViewDetails, onChangeRole, onToggleBan }) => {
  const isSelf = user.id === currentUserId;
  const isSuperAdmin = user.role === 'SuperAdmin';

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      className="border-b border-gray-50 last:border-0 hover:bg-gradient-to-r hover:from-[#EEEDFE]/20 hover:to-transparent transition-colors group"
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar name={user.fullName} imageUrl={user.profileImageUrl} size={36} />
          <div className="min-w-0">
            <p className="font-medium text-gray-800 truncate text-sm">
              {user.fullName}
              {isSelf && (
                <span className="ml-2 text-[10px] font-normal text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                  You
                </span>
              )}
            </p>
            <div className="flex items-center gap-1.5">
              <p className="text-xs text-gray-400 truncate">@{user.userName}</p>
              <span className="text-gray-300">·</span>
              <p className="text-xs text-gray-400 truncate flex items-center gap-1">
                <HiOutlineMail size={10} /> {user.email}
              </p>
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3"><UserRoleBadge role={user.role} /></td>
      <td className="px-4 py-3">
        {user.isLocked
          ? <StatusBadge label="Banned" tone="red" dot />
          : <StatusBadge label="Active" tone="green" dot />}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(user.createdAt)}</td>
      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(user.lastLoginAt)}</td>
      <td className="px-4 py-3 text-right">
        <UserActionsMenu
          user={user}
          onViewDetails={onViewDetails}
          onChangeRole={onChangeRole}
          onToggleBan={onToggleBan}
          disableRoleChange={isSelf || isSuperAdmin}
          disableBan={isSelf || isSuperAdmin}
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
        description="Try adjusting your search or filter to find what you're looking for."
      />
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Last Login</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {users.map((user, index) => (
                <UserRow
                  key={user.id}
                  user={user}
                  index={index}
                  currentUserId={currentUserId}
                  onViewDetails={onViewDetails}
                  onChangeRole={onChangeRole}
                  onToggleBan={onToggleBan}
                />
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
          <p className="text-xs text-gray-400">
            Showing{' '}
            <span className="font-medium text-gray-600">
              {(pagination.page - 1) * pagination.pageSize + 1}
              –
              {Math.min(pagination.page * pagination.pageSize, pagination.totalCount)}
            </span>{' '}
            of <span className="font-medium text-gray-600">{pagination.totalCount}</span> users
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