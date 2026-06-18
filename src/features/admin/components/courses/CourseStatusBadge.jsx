// src/features/admin/components/courses/CourseStatusBadge.jsx

import React from 'react';
import StatusBadge from '../common/StatusBadge';

const STATUS_CONFIG = {
  Published: { tone: 'green', label: 'Published' },
  PendingReview: { tone: 'amber', label: 'Pending Review' },
  Draft: { tone: 'gray', label: 'Draft' },
  Rejected: { tone: 'red', label: 'Rejected' },
  Archived: { tone: 'gray', label: 'Archived' },
};

const CourseStatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Draft;
  return <StatusBadge label={config.label} tone={config.tone} dot />;
};

export default CourseStatusBadge;