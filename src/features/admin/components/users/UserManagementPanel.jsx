// src/features/admin/components/users/UserManagementPanel.jsx

import React, { useState } from 'react';
import { useAuth } from '../../../../store/AppProvider';
import useAdminUsers from '../../hooks/useAdminUsers';
import useAdminUserActions from '../../hooks/useAdminUserActions';
import UserFilters from './UserFilters';
import UserTable from './UserTable';
import UserDetailDrawer from './UserDetailDrawer';
import UserRoleChangeModal from './UserRoleChangeModal';
import UserBanModal from './UserBanModal';

const UserManagementPanel = () => {
  const { user: currentUser } = useAuth();

  const {
    users, loading, error,
    role, setRole,
    search, setSearch,
    pagination, setPage,
    roleOptions,
    refetch,
  } = useAdminUsers();

  const {
    banUser, unbanUser, changeRole,
    statusLoading, statusError, clearStatusError,
    roleLoading, roleError, clearRoleError,
  } = useAdminUserActions();

  const [detailUserId, setDetailUserId] = useState(null);
  const [roleModalUser, setRoleModalUser] = useState(null);
  const [banModalUser, setBanModalUser] = useState(null);

  const handleBanSubmit = async (isBanning, reason) => {
    const result = isBanning
      ? await banUser(banModalUser.id, reason)
      : await unbanUser(banModalUser.id, reason);
    if (result.ok) refetch();
    return result.ok;
  };

  const handleRoleSubmit = async (newRole) => {
    const result = await changeRole(roleModalUser.id, newRole);
    if (result.ok) refetch();
    return result.ok;
  };

  return (
    <div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <UserFilters
          search={search}
          onSearchChange={setSearch}
          role={role}
          onRoleChange={setRole}
          roleOptions={roleOptions}
        />
        <UserTable
          users={users}
          loading={loading}
          error={error}
          onRetry={refetch}
          currentUser={currentUser}  // ← FIXED: Pass the full user object, not just the ID
          onViewDetails={(u) => setDetailUserId(u.id)}
          onChangeRole={(u) => { clearRoleError(); setRoleModalUser(u); }}
          onToggleBan={(u) => { clearStatusError(); setBanModalUser(u); }}
          pagination={pagination}
          onPageChange={setPage}
        />
      </div>

      <UserDetailDrawer
        userId={detailUserId}
        open={!!detailUserId}
        onClose={() => setDetailUserId(null)}
      />

      <UserRoleChangeModal
        open={!!roleModalUser}
        onClose={() => setRoleModalUser(null)}
        user={roleModalUser}
        currentUser={currentUser}
        onSubmit={handleRoleSubmit}
        loading={roleLoading}
        error={roleError}
      />

      <UserBanModal
        open={!!banModalUser}
        onClose={() => setBanModalUser(null)}
        user={banModalUser}
        onSubmit={handleBanSubmit}
        loading={statusLoading}
        error={statusError}
      />
    </div>
  );
};

export default UserManagementPanel;