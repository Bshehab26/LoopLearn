/**
 * CourseStatusBadge.jsx
 * Displays course status with appropriate styling
 */

import React from 'react';
import { HiClock, HiCheckCircle, HiXCircle, HiEye } from 'react-icons/hi';

const STATUS_CONFIG = {
  draft: {
    label: 'Draft',
    color: 'bg-gray-100 text-gray-600',
    icon: HiEye,
    description: 'Only you can see this course',
  },
  pending: {
    label: 'Pending Review',
    color: 'bg-yellow-100 text-yellow-700',
    icon: HiClock,
    description: 'Waiting for admin approval',
  },
  published: {
    label: 'Published',
    color: 'bg-green-100 text-green-700',
    icon: HiCheckCircle,
    description: 'Live on the platform',
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-700',
    icon: HiXCircle,
    description: 'Needs changes before resubmission',
  },
};

const CourseStatusBadge = ({ status, showDescription = true, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };
  const config = STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.draft;
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-start gap-1">
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon size={12} />
        {config.label}
      </span>
      {showDescription && (
        <span className="text-xs text-gray-400">{config.description}</span>
      )}
    </div>
  );
};

export default CourseStatusBadge;