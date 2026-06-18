// src/features/admin/components/common/TableSkeleton.jsx

import React from 'react';

const TableSkeleton = ({ rows = 6, columns = 5 }) => (
  <div className="animate-pulse">
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="flex items-center gap-4 px-4 py-3.5 border-b border-gray-50 last:border-0">
        {Array.from({ length: columns }).map((__, c) => (
          <div
            key={c}
            className="h-3 bg-gray-100 rounded flex-1"
            style={{ maxWidth: c === 0 ? 180 : 90 }}
          />
        ))}
      </div>
    ))}
  </div>
);

export default TableSkeleton;
