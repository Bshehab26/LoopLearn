// src/features/courses/components/ProgressBar.jsx

import React from 'react';

const ProgressBar = ({ courseTitle, progress, completedCount, totalCount }) => (
  <div className="sticky top-16 z-40 bg-white border-b border-gray-100 px-6 md:px-10 py-3">
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <p className="text-sm font-medium text-gray-700 truncate flex-1">{courseTitle}</p>
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="w-48 h-1.5 rounded-full overflow-hidden bg-gray-100">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: '#534AB7' }}
          />
        </div>
        <span className="text-xs font-medium text-purple-600">
          {completedCount}/{totalCount} • {progress}%
        </span>
      </div>
    </div>
  </div>
);

export default ProgressBar;