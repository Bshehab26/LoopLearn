// src/features/admin/components/CourseFilters.jsx

import { useState } from 'react';
import { HiSearch } from 'react-icons/hi';

const CourseFilters = ({ filters, onFilterChange }) => {
  const [search, setSearch] = useState(filters.search || '');
  const [status, setStatus] = useState(filters.status || '');

  const handleSearch = () => {
    onFilterChange({ search, status, page: 1 });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const clearFilters = () => {
    setSearch('');
    setStatus('');
    onFilterChange({ search: '', status: '', page: 1 });
  };

  const hasFilters = search || status;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by course title or instructor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            onFilterChange({ search, status: e.target.value, page: 1 });
          }}
          className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
        >
          <option value="">All Status</option>
          <option value="Published">Published</option>
          <option value="Pending">Pending</option>
          <option value="Draft">Draft</option>
          <option value="Rejected">Rejected</option>
        </select>

        <button
          onClick={handleSearch}
          className="px-6 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition"
        >
          Search
        </button>

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

export default CourseFilters;