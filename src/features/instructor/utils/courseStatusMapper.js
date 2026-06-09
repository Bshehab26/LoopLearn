// src/features/instructor/utils/courseStatusMapper.js

// Backend to frontend status mapping
export const mapBackendStatus = (backendStatus) => {
  const map = {
    'Draft': 'draft',
    'PendingReview': 'pending',
    'Published': 'published',
    'Approved': 'published',  // Backend uses both? 
    'Rejected': 'rejected',
    'Archived': 'archived'
  };
  return map[backendStatus] || 'draft';
};

// Frontend to backend status mapping (for sending, though usually not needed)
export const mapFrontendStatus = (frontendStatus) => {
  const map = {
    'draft': 'Draft',
    'pending': 'PendingReview',
    'published': 'Published',
    'rejected': 'Rejected',
    'archived': 'Archived'
  };
  return map[frontendStatus] || 'Draft';
};

// Get human readable status label
export const getStatusLabel = (status) => {
  const labels = {
    draft: 'Draft',
    pending: 'Pending Review',
    published: 'Published',
    rejected: 'Rejected',
    archived: 'Archived'
  };
  return labels[status] || status;
};

// Get status color for styling
export const getStatusColor = (status) => {
  const colors = {
    draft: 'amber',
    pending: 'yellow',
    published: 'green',
    rejected: 'red',
    archived: 'gray'
  };
  return colors[status] || 'gray';
};