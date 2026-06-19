// src/features/admin/components/courses/CourseFilters.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineSearch } from 'react-icons/hi';

const STATUS_TABS = [
  { key: 'all', label: 'All', color: '#534AB7' },
  { key: 'PendingReview', label: 'Pending', color: '#D97706' },
  { key: 'Published', label: 'Published', color: '#16A34A' },
  { key: 'Rejected', label: 'Rejected', color: '#DC2626' },
  { key: 'Draft', label: 'Draft', color: '#94A3B8' },
  { key: 'Archived', label: 'Archived', color: '#3B82F6' },
];

const CourseFilters = ({ search, onSearchChange, status, onStatusChange, statusCounts = {} }) => {
  const countFor = (key) => {
    if (key === 'all') return null;
    const v = statusCounts[key] ?? statusCounts[key.charAt(0).toLowerCase() + key.slice(1)];
    return v != null ? v : null;
  };

  return (
    <div className="border-b border-gray-100 bg-gray-50/30">
      {/* Search */}
      <div className="px-4 pt-3.5 pb-2.5">
        <div className="relative max-w-sm">
          <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, instructor, or category…"
            className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl
              focus:outline-none focus:ring-2 focus:ring-[#534AB7]/20 focus:border-[#534AB7]
              transition-shadow placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-0.5 px-4 pb-0 overflow-x-auto no-scrollbar">
        {STATUS_TABS.map(({ key, label, color }) => {
          const count = countFor(key);
          const isActive = status === key;
          return (
            <button
              key={key}
              onClick={() => onStatusChange(key)}
              className={`relative flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium rounded-t-xl
                whitespace-nowrap transition-all
                ${isActive
                  ? 'text-gray-800 bg-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'}`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white rounded-t-xl shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{label}</span>
              {count != null && (
                <span
                  className={`relative z-10 px-1.5 py-0.5 rounded-full text-[10px] font-semibold
                    ${isActive ? 'bg-[#EEEDFE] text-[#534AB7]' : 'bg-gray-100 text-gray-500'}`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CourseFilters;