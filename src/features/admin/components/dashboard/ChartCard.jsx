// src/features/admin/components/dashboard/ChartCard.jsx

import React from 'react';
import Chart from './Chart';

const ChartCard = ({ title, data, footnote }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        <span className="text-xs text-gray-400">{total} total</span>
      </div>
      <Chart data={data} />
      {footnote && <p className="text-xs text-gray-400 mt-2 text-center">{footnote}</p>}
    </div>
  );
};

export default ChartCard;
