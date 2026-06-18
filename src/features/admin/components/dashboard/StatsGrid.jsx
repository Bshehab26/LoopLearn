// src/features/admin/components/dashboard/StatsGrid.jsx

import React from 'react';
import StatsCard from './StatsCard';

const StatsGrid = ({ stats }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
    {stats.map((s) => (
      <StatsCard key={s.label} {...s} />
    ))}
  </div>
);

export default StatsGrid;
