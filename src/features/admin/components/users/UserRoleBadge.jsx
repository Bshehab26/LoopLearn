// src/features/admin/components/users/UserRoleBadge.jsx

import React from 'react';
import StatusBadge from '../common/StatusBadge';

const ROLE_TONE = {
  SuperAdmin: 'purple',
  Admin: 'blue',
  Instructor: 'amber',
  Student: 'green',
};

const UserRoleBadge = ({ role }) => (
  <StatusBadge label={role || 'No role'} tone={ROLE_TONE[role] || 'gray'} />
);

export default UserRoleBadge;
