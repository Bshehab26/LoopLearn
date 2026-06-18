// src/features/admin/components/dashboard/EnrollmentStatusChart.jsx
//
// Active/Suspended/Refunded are mutually exclusive (the donut), but
// "completed" is a separate flag a student can have while Active — so it's
// shown as a footnote instead of a slice, rather than double-counting.

import React from 'react';
import ChartCard from './ChartCard';

const COLORS = {
  Active: '#16A34A',
  Suspended: '#D97706',
  Refunded: '#DC2626',
};

const EnrollmentStatusChart = ({ stats }) => {
  if (!stats) return null;

  const data = [
    { label: 'Active', value: stats.activeEnrollments, color: COLORS.Active },
    { label: 'Suspended', value: stats.suspendedEnrollments, color: COLORS.Suspended },
    { label: 'Refunded', value: stats.refundedEnrollments, color: COLORS.Refunded },
  ];

  return (
    <ChartCard
      title="Enrollment status"
      data={data}
      footnote={`${stats.completedEnrollments} completed enrollment${stats.completedEnrollments === 1 ? '' : 's'} overall`}
    />
  );
};

export default EnrollmentStatusChart;
