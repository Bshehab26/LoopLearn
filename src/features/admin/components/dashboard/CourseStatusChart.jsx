// src/features/admin/components/dashboard/CourseStatusChart.jsx

import React from 'react';
import ChartCard from './ChartCard';

const COLORS = {
  Published: '#16A34A',
  PendingReview: '#D97706',
  Draft: '#94A3B8',
  Archived: '#3B82F6',
  Rejected: '#DC2626',
};

const CourseStatusChart = ({ stats }) => {
  if (!stats) return null;

  const data = [
    { label: 'Published', value: stats.published, color: COLORS.Published },
    { label: 'Pending review', value: stats.pendingReview, color: COLORS.PendingReview },
    { label: 'Draft', value: stats.draft, color: COLORS.Draft },
    { label: 'Archived', value: stats.archived, color: COLORS.Archived },
    { label: 'Rejected', value: stats.rejected, color: COLORS.Rejected },
  ];

  return (
    <ChartCard
      title="Course status"
      data={data}
      footnote={
        stats.deleted > 0
          ? `${stats.deleted} deleted course${stats.deleted === 1 ? '' : 's'} not shown`
          : null
      }
    />
  );
};

export default CourseStatusChart;
