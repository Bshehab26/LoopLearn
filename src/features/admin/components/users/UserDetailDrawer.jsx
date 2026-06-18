// src/features/admin/components/users/UserDetailDrawer.jsx

import React from 'react';
import Drawer from '../common/Drawer';
import Avatar from '../common/Avatar';
import UserRoleBadge from './UserRoleBadge';
import StatusBadge from '../common/StatusBadge';
import useAdminUserDetail from '../../hooks/useAdminUserDetail';
import {
  HiOutlineMail,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineAcademicCap,
  HiOutlineBookOpen,
} from 'react-icons/hi';

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—';

const formatDateTime = (d) =>
  d
    ? new Date(d).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
      })
    : '—';

const UserDetailDrawer = ({ userId, open, onClose }) => {
  const { user, loading, error } = useAdminUserDetail(open ? userId : null);

  return (
    <Drawer open={open} onClose={onClose} title="User details">
      {loading && (
        <div className="animate-pulse space-y-4">
          <div className="h-16 w-16 rounded-full bg-gray-100 mx-auto" />
          <div className="h-3 bg-gray-100 rounded w-2/3 mx-auto" />
          <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto" />
        </div>
      )}

      {error && <p className="text-sm text-red-600 text-center py-6">{error}</p>}

      {user && !loading && (
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center">
            <Avatar name={user.fullName} imageUrl={user.profileImageUrl} size={64} />
            <p className="mt-3 font-semibold text-gray-800">{user.fullName}</p>
            <p className="text-xs text-gray-400">@{user.userName}</p>
            <div className="flex items-center gap-2 mt-2">
              <UserRoleBadge role={user.role} />
              {user.isLocked
                ? <StatusBadge label="Banned" tone="red" dot />
                : <StatusBadge label="Active" tone="green" dot />}
            </div>
          </div>

          {user.bio && (
            <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">{user.bio}</p>
          )}

          <div className="border-t border-gray-100 pt-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <HiOutlineMail size={15} className="text-gray-400 flex-shrink-0" /> {user.email}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <HiOutlineCalendar size={15} className="text-gray-400 flex-shrink-0" /> Joined {formatDate(user.createdAt)}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <HiOutlineClock size={15} className="text-gray-400 flex-shrink-0" /> Last login {formatDateTime(user.lastLoginAt)}
            </div>
          </div>

          {(user.enrollmentCount !== null && user.enrollmentCount !== undefined) && (
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <HiOutlineAcademicCap size={15} className="text-gray-400 flex-shrink-0" />
                Enrolled in <span className="font-medium text-gray-800">{user.enrollmentCount}</span>{' '}
                course{user.enrollmentCount === 1 ? '' : 's'}
              </div>
            </div>
          )}

          {(user.courseCount !== null && user.courseCount !== undefined) && (
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <HiOutlineBookOpen size={15} className="text-gray-400 flex-shrink-0" />
                Teaching <span className="font-medium text-gray-800">{user.courseCount}</span>{' '}
                course{user.courseCount === 1 ? '' : 's'}
              </div>
            </div>
          )}
        </div>
      )}
    </Drawer>
  );
};

export default UserDetailDrawer;
