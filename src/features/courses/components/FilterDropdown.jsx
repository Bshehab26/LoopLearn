/**
 * FilterDropdown.jsx
 *
 * Fixes:
 *  1. Categories were HARDCODED in a static array — now fetched from
 *     GET /api/Category via the useCategories hook.
 *  2. Loading & error states shown inside the dropdown.
 *  3. Course counts still computed client-side from the `courses` prop
 *     (matches DB category names dynamically instead of the old static list).
 *  4. Outside-click uses the shared useOutsideClick hook.
 */

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { HiOutlineAdjustmentsHorizontal, HiChevronDown } from 'react-icons/hi2';
import { HiX } from 'react-icons/hi';
import { useNavigate, useLocation } from 'react-router-dom';
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
// Helpers
// ============================================================================

/**
 * Build category-to-count map from the courses already loaded.
 * Uses the DB category names (from useCategories) so counts align correctly.
 */
const buildCounts = (courses = [], dbCategories = []) => {
  const map = {};
  dbCategories.forEach(c => { map[c.name] = 0; });
  courses.forEach(course => {
    const cat = course.category;
    if (cat && map[cat] !== undefined) map[cat]++;
  });
  return map;
};

const extractCategoryFromUrl = (params) => {
  const raw = params.get('category') ?? params.get('categories');
  if (!raw) return null;
  try { return decodeURIComponent(raw); } catch { return raw; }
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
      <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{count}</span>
    )}
  </div>
);

// ============================================================================
// Main Component
// ============================================================================

const FilterDropdown = ({ courses = [], onFilterChange }) => {
  const [isOpen,   setIsOpen]   = useState(false);
  const [selected, setSelected] = useState(null);

  // ✅ FIX: real categories from the database
  const { categories: dbCategories, loading: catLoading, error: catError } = useCategories();

  const dropdownRef = useRef(null);
  const navigate    = useNavigate();
  const location    = useLocation();

  // Sync selected state from URL on mount / navigation
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSelected(extractCategoryFromUrl(params));
  }, [location.search]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ✅ Counts built from DB category names + loaded courses
  const countMap = useMemo(
    () => buildCounts(courses, dbCategories),
    [courses, dbCategories]
  );

  const handleSelect = useCallback((name) => {
    setSelected(prev => (prev === name ? null : name));
  }, []);

  const handleApply = useCallback(() => {
    if (!selected) return;
    navigate(`/courses?category=${encodeURIComponent(selected)}`, { replace: true });
    onFilterChange?.({ categories: [selected] });
    setIsOpen(false);
  }, [selected, navigate, onFilterChange]);

  const handleClear = useCallback(() => {
    setSelected(null);
    navigate('/courses', { replace: true });
    onFilterChange?.({ categories: [] });
    setIsOpen(false);
  }, [navigate, onFilterChange]);

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
                <button onClick={handleClear} className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 transition font-medium">
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
              ) : dbCategories.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-400">No categories found</p>
              ) : (
                dbCategories.map(cat => (
                  <CategoryRow
                    key={cat.id}
                    name={cat.name}
                    count={countMap[cat.name] ?? 0}
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