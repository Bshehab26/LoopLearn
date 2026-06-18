// src/features/admin/pages/Users.jsx
//
// Pure composition — all state, data fetching, and logic live in
// UserManagementPanel and the hooks it uses. Nothing else belongs here.

import React from 'react';
import PageHeader from '../components/common/PageHeader';
import UserManagementPanel from '../components/users/UserManagementPanel';

const Users = () => (
  <div>
    <PageHeader
      title="Users"
      subtitle="Manage students, instructors, and admins across the platform."
    />
    <UserManagementPanel />
  </div>
);

export default Users;
