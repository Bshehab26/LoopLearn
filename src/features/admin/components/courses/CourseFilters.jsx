// src/features/admin/components/courses/CourseFilters.jsx

import React from 'react';
import { HiOutlineSearch } from 'react-icons/hi';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'Published', label: 'Published' },
  { value: 'PendingReview', label: 'Pending Review' },
  { value: 'Draft', label: 'Draft' },
  { value: 'Rejected', label: 'Rejected' },
  { value: 'Archived', label: 'Archived' },
];

const CourseFilters = ({ search, onSearchChange, status, onStatusChange }) => (
  <div className="flex flex-col sm:flex-row gap-3 px-4 py-3 border-b border-gray-100">
    <div className="relative flex-1">
      <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by title or instructor…"
        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-[#534AB7]/20 focus:border-[#534AB7]"
      />
    </div>
    <select
      value={status}
      onChange={(e) => onStatusChange(e.target.value)}
      className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white
        focus:outline-none focus:ring-2 focus:ring-[#534AB7]/20 focus:border-[#534AB7]"
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

export default CourseFilters;