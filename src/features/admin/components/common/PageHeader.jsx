// src/features/admin/components/common/PageHeader.jsx
//
// Generic page-level header: title, optional subtitle, optional action
// (e.g. a button) on the right. Used by every admin page so they stay
// pure-composition with no layout logic of their own.

import React from 'react';

const PageHeader = ({ title, subtitle, action }) => (
  <div className="flex items-start justify-between gap-4 mb-6">
    <div>
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);

export default PageHeader;
