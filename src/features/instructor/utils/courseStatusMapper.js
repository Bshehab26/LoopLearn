// Backend to frontend status mapping
export const mapBackendStatus = (backendStatus) => {
  const map = {
    'Draft': 'draft',
    'PendingReview': 'pending',
    'Approved': 'published',
    'Rejected': 'rejected'
  };
  return map[backendStatus] || 'draft';
};

// Frontend to backend status mapping (for sending, though usually not needed)
export const mapFrontendStatus = (frontendStatus) => {
  const map = {
    'draft': 'Draft',
    'pending': 'PendingReview',
    'published': 'Approved',
    'rejected': 'Rejected'
  };
  return map[frontendStatus] || 'Draft';
};