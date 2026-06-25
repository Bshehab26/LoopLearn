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

  const mapped = map[backendStatus];

  if (mapped === undefined) {
    // IMPORTANT: do NOT default to 'draft' here. 'draft' is the most
    // permissive/editable status in the app. If this function silently
    // falls back to 'draft' whenever it receives an unexpected value
    // (wrong field name from the API, null, a status string we haven't
    // mapped yet, etc.), every caller that uses the result to decide
    // "can this be edited?" will incorrectly say yes — which is exactly
    // the bug that let pending/published courses load in the edit page.
    console.error(
      `[courseStatusMapper] Unrecognized backend status: ${JSON.stringify(backendStatus)}. ` +
      `Defaulting to 'unknown' (treated as NOT editable) instead of 'draft'.`
    );
    return 'unknown';
  }

  return mapped;
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
    draft: 'gray',
    pending: 'yellow',
    published: 'green',
    rejected: 'red',
    archived: 'gray'
  };
  return colors[status] || 'gray';
};