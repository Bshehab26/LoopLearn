// src/features/admin/hooks/useAdminUserActions.js
//
// Mutations for the Users section, kept separate from useAdminUsers (which
// only reads). Each action tracks its own loading/error state so a modal
// can show inline feedback without affecting the table underneath it.

import { useState } from 'react';
import { updateUserStatus, updateUserRole } from '../api/admin.api';

const useAdminUserActions = () => {
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState(null);

  const [roleLoading, setRoleLoading] = useState(false);
  const [roleError, setRoleError] = useState(null);

  const banUser = async (userId, reason) => {
    setStatusLoading(true);
    setStatusError(null);
    try {
      const res = await updateUserStatus(userId, { isBanned: true, reason });
      return { ok: true, data: res.data, message: res.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not ban this user.';
      setStatusError(msg);
      return { ok: false, error: msg };
    } finally {
      setStatusLoading(false);
    }
  };

  const unbanUser = async (userId, reason) => {
    setStatusLoading(true);
    setStatusError(null);
    try {
      const res = await updateUserStatus(userId, { isBanned: false, reason });
      return { ok: true, data: res.data, message: res.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not unban this user.';
      setStatusError(msg);
      return { ok: false, error: msg };
    } finally {
      setStatusLoading(false);
    }
  };

  const changeRole = async (userId, newRole) => {
    setRoleLoading(true);
    setRoleError(null);
    try {
      const res = await updateUserRole(userId, { newRole });
      return { ok: true, data: res.data, message: res.message };
    } catch (err) {
      const msg = err.response?.data?.message || "Could not update this user's role.";
      setRoleError(msg);
      return { ok: false, error: msg };
    } finally {
      setRoleLoading(false);
    }
  };

  return {
    banUser,
    unbanUser,
    changeRole,
    statusLoading,
    statusError,
    clearStatusError: () => setStatusError(null),
    roleLoading,
    roleError,
    clearRoleError: () => setRoleError(null),
  };
};

export default useAdminUserActions;
