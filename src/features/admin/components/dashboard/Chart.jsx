// src/features/admin/components/dashboard/Chart.jsx
//
// Generic donut chart for category breakdowns (course status, user roles,
// enrollment status, payment status) — one chart component, reused by all
// four breakdown cards instead of writing a chart per page.
//
// Requires recharts: `npm install recharts` if it's not already a
// dependency.

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Chart = ({ data, height = 220 }) => {
  // data: [{ label, value, color }]
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center text-xs text-gray-400" style={{ height }}>
        No data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          innerRadius="60%"
          outerRadius="85%"
          paddingAngle={2}
        >
          {data.map((d, i) => (
            <Cell key={i} fill={d.color} stroke="#fff" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [`${value} (${((value / total) * 100).toFixed(0)}%)`, name]}
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          wrapperStyle={{ fontSize: 11, color: '#6B7280' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default Chart;
