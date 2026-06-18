// src/features/admin/components/common/StatusBadge.jsx
//
// Generic status pill. Deliberately not user-specific — Courses/Categories
// admin pages can reuse this for CourseStatus/ApplicationStatus later.

import React from 'react';

const TONE_STYLES = {
  green:  'bg-green-50 text-green-700 border-green-200',
  red:    'bg-red-50 text-red-700 border-red-200',
  amber:  'bg-amber-50 text-amber-700 border-amber-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  blue:   'bg-blue-50 text-blue-700 border-blue-200',
  gray:   'bg-gray-100 text-gray-600 border-gray-200',
};

const StatusBadge = ({ label, tone = 'gray', dot = false }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border
      text-[11px] font-medium whitespace-nowrap ${TONE_STYLES[tone] || TONE_STYLES.gray}`}
  >
    {dot && <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />}
    {label}
  </span>
);

export default StatusBadge;
