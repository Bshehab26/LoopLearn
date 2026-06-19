// src/features/admin/components/dashboard/StatsCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const StatsCard = ({ icon: Icon, label, value, tone = '#534AB7', to }) => {
  const content = (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.06)' }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 h-full transition-all shadow-sm hover:border-gray-200 cursor-pointer"
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${tone}15`, color: tone }}
      >
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xl font-bold text-gray-900 truncate">{value}</p>
        <p className="text-xs text-gray-400 font-medium truncate">{label}</p>
      </div>
    </motion.div>
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