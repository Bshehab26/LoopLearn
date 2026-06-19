// src/features/admin/components/courses/CourseStatusBadge.jsx
//
// Maps CourseStatus enum strings (Published, PendingReview, Rejected,
// Draft, Archived) to StatusBadge tones. Keep in sync with
// CourseStatus.cs enum values.

import React from 'react';
import StatusBadge from '../common/StatusBadge';

const STATUS_MAP = {
  Published:     { label: 'Published',      tone: 'green'  },
  PendingReview: { label: 'Pending Review', tone: 'amber'  },
  Rejected:      { label: 'Rejected',       tone: 'red'    },
  Draft:         { label: 'Draft',          tone: 'gray'   },
  Archived:      { label: 'Archived',       tone: 'blue'   },
};

const CourseStatusBadge = ({ status }) => {
  const config = STATUS_MAP[status] || { label: status || 'Unknown', tone: 'gray' };
  return <StatusBadge label={config.label} tone={config.tone} dot />;
};

export default CourseStatusBadge;
