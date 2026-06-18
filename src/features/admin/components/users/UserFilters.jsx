// src/features/admin/components/users/UserFilters.jsx

import React from 'react';
import { HiOutlineSearch } from 'react-icons/hi';

const UserFilters = ({ search, onSearchChange, role, onRoleChange, roleOptions = ['All'] }) => (
  <div className="flex flex-col sm:flex-row gap-3 px-4 py-3 border-b border-gray-100">
    <div className="relative flex-1">
      <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by name, username, or email…"
        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-[#534AB7]/20 focus:border-[#534AB7]"
      />
    </div>
    <select
      value={role}
      onChange={(e) => onRoleChange(e.target.value)}
      className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white
        focus:outline-none focus:ring-2 focus:ring-[#534AB7]/20 focus:border-[#534AB7]"
    >
      {roleOptions.map((r) => (
        <option key={r} value={r}>{r === 'All' ? 'All roles' : r}</option>
      ))}
    </select>
  </div>
);

export default UserFilters;
