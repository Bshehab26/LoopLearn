/**
 * FilterDropdown.jsx
 *
 * Fixes:
 *  1. Categories fetched from GET /api/Category via useCategories hook.
 *  2. Category counts are accurate (fetched from all courses, not just current page).
 *  3. Filtering calls the API directly (backend filtering).
 *  4. Removes URL navigation - filtering is handled entirely by the API.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { HiOutlineAdjustmentsHorizontal, HiChevronDown } from 'react-icons/hi2';
import { HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import useCategories from '../hooks/useCategories';

// ============================================================================
// Animation
// ============================================================================

const ANIM = {
  initial: { opacity: 0, y: -8, scale: 0.97 },
  animate: { opacity: 1, y: 0,  scale: 1    },
  exit:    { opacity: 0, y: -8, scale: 0.97 },
  transition: { duration: 0.18 },
};

// ============================================================================
// Sub-components
// ============================================================================

const FilterButton = ({ isOpen, onClick, hasFilter, disabled }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    disabled={disabled}
    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all bg-white border hover:shadow-sm disabled:opacity-50"
    style={{
      borderColor: hasFilter ? '#534AB7' : '#E5E7EB',
      color:       hasFilter ? '#534AB7' : '#5F5E5A',
    }}
  >
    <HiOutlineAdjustmentsHorizontal size={16} className={hasFilter ? 'text-purple-600' : ''} />
    Filter
    {hasFilter && (
      <span className="bg-purple-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none">
        1
      </span>
    )}
    <HiChevronDown
      size={14}
      className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
    />
  </motion.button>
);

const CategoryRow = ({ name, count, selected, onSelect }) => (
  <div
    onClick={() => onSelect(name)}
    className="flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer transition hover:bg-purple-50 group"
  >
    {/* Radio circle */}
    <div
      className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
      style={{ borderColor: selected ? '#534AB7' : '#D1D5DB' }}
    >
      {selected && <div className="w-2 h-2 rounded-full bg-purple-600" />}
    </div>
    <span className={`text-sm flex-1 transition-colors ${selected ? 'text-purple-700 font-medium' : 'text-gray-700 group-hover:text-purple-600'}`}>
      {name}
    </span>
    {count > 0 && (
      <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
        {count}
      </span>
    )}
  </div>
);

// ============================================================================
// Main Component
// ============================================================================

const FilterDropdown = ({ onFilterChange, activeCategory = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(activeCategory);

  // ✅ Fetch real categories with ACCURATE counts from all courses
  const { categories, categoryCounts, loading: catLoading, error: catError } = useCategories();

  const dropdownRef = useRef(null);

  // Sync with external activeCategory prop (from parent)
  useEffect(() => {
    setSelected(activeCategory);
  }, [activeCategory]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = useCallback((name) => {
    setSelected(prev => (prev === name ? null : name));
  }, []);

  const handleApply = useCallback(() => {
    // Call the parent's onFilterChange with the selected category
    // This will trigger the API call in the parent component
    onFilterChange?.({ categories: selected ? [selected] : [] });
    setIsOpen(false);
  }, [selected, onFilterChange]);

  const handleClear = useCallback(() => {
    setSelected(null);
    // Clear filter - fetch all courses
    onFilterChange?.({ categories: [] });
    setIsOpen(false);
  }, [onFilterChange]);

  const hasFilter = !!selected;

  return (
    <div className="relative" ref={dropdownRef}>
      <FilterButton
        isOpen={isOpen}
        onClick={() => setIsOpen(v => !v)}
        hasFilter={hasFilter}
        disabled={catLoading}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            {...ANIM}
            className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
            style={{ maxHeight: 'calc(100vh - 120px)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-800">Filter by Category</span>
              {hasFilter && (
                <button 
                  onClick={handleClear} 
                  className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 transition font-medium"
                >
                  <HiX size={12} /> Clear
                </button>
              )}
            </div>

            {/* Category list */}
            <div className="px-4 py-3 overflow-y-auto" style={{ maxHeight: 280 }}>
              {catLoading ? (
                // Skeleton rows
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 px-2 py-2 animate-pulse">
                      <div className="w-4 h-4 rounded-full bg-gray-200 flex-shrink-0" />
                      <div className="h-3 bg-gray-200 rounded flex-1" style={{ width: `${55 + i * 8}%` }} />
                      <div className="h-3 w-5 bg-gray-100 rounded" />
                    </div>
                  ))}
                </div>
              ) : catError ? (
                <div className="py-6 text-center">
                  <p className="text-sm text-red-500 mb-2">Failed to load categories</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-xs text-purple-600 underline hover:text-purple-700"
                  >
                    Retry
                  </button>
                </div>
              ) : categories.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-400">No categories found</p>
              ) : (
                categories.map(cat => (
                  <CategoryRow
                    key={cat.id}
                    name={cat.name}
                    count={categoryCounts[cat.name] ?? 0}
                    selected={selected === cat.name}
                    onSelect={handleSelect}
                  />
                ))
              )}
            </div>

            {/* Apply button */}
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleApply}
                disabled={!hasFilter || catLoading}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all
                           bg-gradient-to-r from-purple-600 to-indigo-600
                           hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Apply Filter
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterDropdown;