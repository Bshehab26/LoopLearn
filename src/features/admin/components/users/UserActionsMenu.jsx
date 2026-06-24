// src/features/admin/components/users/UserActionsMenu.jsx

import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import {
  HiOutlineDotsVertical,
  HiOutlineEye,
  HiOutlineUserCircle,
  HiOutlineLockClosed,
  HiOutlineLockOpen,
} from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const UserActionsMenu = ({
  user,
  currentUser,
  onViewDetails,
  onChangeRole,
  onToggleBan,
  disableRoleChange = false,
  disableBan = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0, direction: 'down' });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  // Calculate menu position
  const calculatePosition = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const menuWidth = 180;
    const menuHeight = 200;
    const padding = 10;

    // X position - align to right
    let x = rect.right - menuWidth;
    if (x < padding) x = padding;
    if (x + menuWidth > window.innerWidth - padding) {
      x = window.innerWidth - menuWidth - padding;
    }

    // Y position - smart flip
    const spaceDown = window.innerHeight - rect.bottom - padding;
    const spaceUp = rect.top - padding;
    const shouldGoUp = spaceDown < menuHeight && spaceUp > spaceDown;

    let y;
    let direction;
    if (shouldGoUp) {
      y = rect.top - menuHeight - padding;
      direction = 'up';
    } else {
      y = rect.bottom + padding;
      direction = 'down';
    }

    // Keep in viewport
    if (y < padding) y = padding;
    if (y + menuHeight > window.innerHeight - padding) {
      y = window.innerHeight - menuHeight - padding;
    }

    setPosition({ x, y, direction });
  }, []);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        buttonRef.current && !buttonRef.current.contains(e.target) &&
        menuRef.current && !menuRef.current.contains(e.target)
      ) {
        closeMenu();
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') closeMenu();
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      window.addEventListener('scroll', calculatePosition, true);
      window.addEventListener('resize', calculatePosition);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('scroll', calculatePosition, true);
      window.removeEventListener('resize', calculatePosition);
    };
  }, [isOpen, closeMenu, calculatePosition]);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(calculatePosition);
    }
  }, [isOpen, calculatePosition]);

  const handleToggle = () => {
    if (!isOpen) {
      requestAnimationFrame(calculatePosition);
    }
    setIsOpen(!isOpen);
  };

  const handleAction = (callback) => () => {
    closeMenu();
    if (callback) callback(user);
  };

  // Action Button Component
  const ActionButton = ({ icon: Icon, label, onClick, color = 'gray', disabled = false }) => {
    const colors = {
      gray: 'hover:bg-gray-50 text-gray-700',
      blue: 'hover:bg-blue-50 text-blue-600',
      green: 'hover:bg-green-50 text-green-600',
      red: 'hover:bg-red-50 text-red-600',
    };

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          w-full flex items-center gap-3 px-4 py-2.5 text-sm
          transition-all duration-150
          ${colors[color] || colors.gray}
          ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:pl-5'}
        `}
      >
        <Icon size={15} className="flex-shrink-0" />
        <span className="flex-1 text-left font-medium">{label}</span>
      </button>
    );
  };

  // Determine permissions
  const isSelf = currentUser?.id === user?.id;
  const isSuperAdmin = currentUser?.role === 'SuperAdmin';
  const isAdmin = currentUser?.role === 'Admin';
  const isTargetAdmin = user?.role === 'Admin';
  const isTargetSuperAdmin = user?.role === 'SuperAdmin';

  // Only SuperAdmin can modify Admin or SuperAdmin roles
  const canModifyRole = !isSelf && !isTargetSuperAdmin && (isSuperAdmin || (!isTargetAdmin && isAdmin));
  
  // Only SuperAdmin can ban/unban other admins
  const canToggleBan = !isSelf && !isTargetSuperAdmin && (isSuperAdmin || !isTargetAdmin);

  // Count actions to determine menu height
  let actionCount = 1; // View details always visible
  if (!disableRoleChange && canModifyRole) actionCount++;
  if (!disableBan && canToggleBan) actionCount++;
  
  const menuHeight = Math.min(actionCount * 44 + 60, 250);

  return (
    <>
      {/* Trigger Button */}
      <div ref={buttonRef} className="inline-block">
        <button
          onClick={handleToggle}
          className={`
            p-1.5 rounded-lg transition-all duration-200
            ${isOpen 
              ? 'bg-purple-100 text-purple-700 ring-2 ring-purple-200' 
              : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
            }
          `}
          aria-label="User actions"
        >
          <HiOutlineDotsVertical size={18} />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && ReactDOM.createPortal(
        <AnimatePresence>
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.92, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -5 }}
            transition={{ duration: 0.12 }}
            className="fixed z-[9999] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
            style={{
              top: position.y,
              left: position.x,
              width: 180,
              maxHeight: menuHeight,
              transformOrigin: position.direction === 'up' ? 'bottom right' : 'top right',
            }}
          >
            {/* Header */}
            <div className="px-4 py-2 bg-gray-50/80 border-b border-gray-100">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Actions
              </span>
            </div>

            {/* Actions */}
            <div className="py-1">
              <ActionButton
                icon={HiOutlineEye}
                label="View Details"
                onClick={handleAction(onViewDetails)}
                color="gray"
              />

              {!disableRoleChange && canModifyRole && (
                <>
                  <div className="border-t border-gray-100 mx-3 my-1" />
                  <ActionButton
                    icon={HiOutlineUserCircle}
                    label="Change Role"
                    onClick={handleAction(onChangeRole)}
                    color="blue"
                  />
                </>
              )}

              {!disableBan && canToggleBan && (
                <>
                  <div className="border-t border-gray-100 mx-3 my-1" />
                  <ActionButton
                    icon={user?.isLocked ? HiOutlineLockOpen : HiOutlineLockClosed}
                    label={user?.isLocked ? 'Unban User' : 'Ban User'}
                    onClick={handleAction(onToggleBan)}
                    color={user?.isLocked ? 'green' : 'red'}
                  />
                </>
              )}

              {isSelf && (
                <>
                  <div className="border-t border-gray-100 mx-3 my-1" />
                  <div className="px-4 py-2.5 text-xs text-gray-400 text-center">
                    You cannot modify your own account
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-1.5 bg-gray-50/80 border-t border-gray-100">
              <p className="text-[9px] text-gray-400 text-center">
                <kbd className="px-1 py-0.5 bg-white rounded border border-gray-200 text-[8px] font-mono">ESC</kbd> to close
              </p>
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default UserActionsMenu;