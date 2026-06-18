// src/features/admin/components/dashboard/StatsCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const StatsCard = ({ icon: Icon, label, value, tone = '#534AB7', to }) => {
  const content = (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 h-full transition hover:border-gray-300">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${tone}1A`, color: tone }}
      >
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-bold text-gray-900 truncate">{value}</p>
        <p className="text-xs text-gray-400 truncate">{label}</p>
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block h-full">
        {content}
      </Link>
    );
  }
  return content;
};

export default StatsCard;
