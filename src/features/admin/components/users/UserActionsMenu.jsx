// src/features/admin/components/users/UserActionsMenu.jsx

import React, { useState, useRef, useEffect } from 'react';
import {
  HiOutlineDotsVertical,
  HiOutlineEye,
  HiOutlineUserCircle,
  HiOutlineLockClosed,
  HiOutlineLockOpen,
} from 'react-icons/hi';

const UserActionsMenu = ({
  user,
  currentUser,
  onViewDetails,
  onChangeRole,
  onToggleBan,
  disableRoleChange = false,
  disableBan = false,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const close = () => setOpen(false);

  // Determine if the current user can modify this user
  const isSelf = currentUser?.id === user?.id;
  const isSuperAdmin = currentUser?.role === 'SuperAdmin';
  const isAdmin = currentUser?.role === 'Admin';
  const isTargetAdmin = user?.role === 'Admin';
  const isTargetSuperAdmin = user?.role === 'SuperAdmin';

  // Only SuperAdmin can modify Admin or SuperAdmin roles
  const canModifyRole = !isSelf && !isTargetSuperAdmin && (isSuperAdmin || (!isTargetAdmin && isAdmin));
  
  // Only SuperAdmin can ban/unban other admins
  const canToggleBan = !isSelf && !isTargetSuperAdmin && (isSuperAdmin || !isTargetAdmin);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        aria-label="User actions"
      >
        <HiOutlineDotsVertical size={16} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-100 z-20 py-1">
          <button
            onClick={() => { onViewDetails(user); close(); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50"
          >
            <HiOutlineEye size={14} /> View details
          </button>

          {!disableRoleChange && canModifyRole && (
            <button
              onClick={() => { onChangeRole(user); close(); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50"
            >
              <HiOutlineUserCircle size={14} /> Change role
            </button>
          )}

          {!disableBan && canToggleBan && (
            <button
              onClick={() => { onToggleBan(user); close(); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-50 ${
                user.isLocked ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {user.isLocked ? <HiOutlineLockOpen size={14} /> : <HiOutlineLockClosed size={14} />}
              {user.isLocked ? 'Unban user' : 'Ban user'}
            </button>
          )}

          {isSelf && (
            <div className="px-3 py-2 text-xs text-gray-400 italic border-t border-gray-100">
              You cannot modify your own account
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserActionsMenu;