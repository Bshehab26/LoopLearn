// src/features/admin/components/common/EmptyState.jsx

import React from 'react';

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center text-center py-14 px-4">
    {Icon && (
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
        <Icon size={22} className="text-gray-400" />
      </div>
    )}
    <p className="text-sm font-medium text-gray-700">{title}</p>
    {description && <p className="text-xs text-gray-400 mt-1 max-w-sm">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
