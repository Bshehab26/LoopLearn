// src/features/admin/components/UserFilters.jsx
import { useState } from 'react';
import { HiSearch, HiFilter } from 'react-icons/hi';

const UserFilters = ({ filters, onFilterChange }) => {
  const [search, setSearch] = useState(filters.search || '');
  const [role, setRole] = useState(filters.role || '');
  const [status, setStatus] = useState(filters.status || '');

  const handleSearch = () => {
    onFilterChange({ search, role, status, page: 1 });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setRole(newRole);
    onFilterChange({ search, role: newRole, status, page: 1 });
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    onFilterChange({ search, role, status: newStatus, page: 1 });
  };

  const clearFilters = () => {
    setSearch('');
    setRole('');
    setStatus('');
    onFilterChange({ search: '', role: '', status: '', page: 1 });
  };

  const hasFilters = search || role || status;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by username or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Role Filter */}
        <select
          value={role}
          onChange={handleRoleChange}
          className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
        >
          <option value="">All Roles</option>
          <option value="Student">Student</option>
          <option value="Instructor">Instructor</option>
          <option value="Admin">Admin</option>
        </select>

        {/* Status Filter */}
        <select
          value={status}
          onChange={handleStatusChange}
          className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Suspended">Suspended</option>
          <option value="Inactive">Inactive</option>
        </select>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="px-6 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition"
        >
          Search
        </button>

        {/* Clear Filters */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default UserFilters;