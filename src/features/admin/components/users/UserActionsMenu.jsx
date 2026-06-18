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
  onViewDetails,
  onChangeRole,
  onToggleBan,
  disableRoleChange,
  disableBan,
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

          {!disableRoleChange && (
            <button
              onClick={() => { onChangeRole(user); close(); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50"
            >
              <HiOutlineUserCircle size={14} /> Change role
            </button>
          )}

          {!disableBan && (
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
        </div>
      )}
    </div>
  );
};

export default UserActionsMenu;
