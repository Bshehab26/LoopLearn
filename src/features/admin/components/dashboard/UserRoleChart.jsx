// src/features/admin/components/dashboard/UserRoleChart.jsx
//
// Colors deliberately match UserRoleBadge's tones (see Users section) so
// "Instructor" looks like the same color everywhere in the admin app.

import React from 'react';
import ChartCard from './ChartCard';

const COLORS = {
  SuperAdmin: '#7C3AED',
  Admin: '#3B82F6',
  Instructor: '#D97706',
  Student: '#16A34A',
};

const UserRoleChart = ({ stats }) => {
  if (!stats) return null;

  const data = [
    { label: 'Students', value: stats.totalStudents, color: COLORS.Student },
    { label: 'Instructors', value: stats.totalInstructors, color: COLORS.Instructor },
    { label: 'Admins', value: stats.totalAdmins, color: COLORS.Admin },
    { label: 'Super admins', value: stats.totalSuperAdmins, color: COLORS.SuperAdmin },
  ];

  return <ChartCard title="Users by role" data={data} />;
};

export default UserRoleChart;
