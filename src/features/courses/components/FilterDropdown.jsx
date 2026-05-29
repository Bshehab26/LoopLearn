/**
 * FilterDropdown.jsx
 * Filter dropdown component for courses by category.
 * SUPPORTS SINGLE CATEGORY SELECTION ONLY (radio buttons)
 */

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { HiOutlineAdjustmentsHorizontal, HiChevronDown } from 'react-icons/hi2';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  'Web Development', 'Mobile Apps', 'Data Science', 'UI/UX Design',
  'Cybersecurity', 'DevOps', 'AI & ML',
];

const DROPDOWN_ANIMATION = {
  initial: { opacity: 0, y: -10, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.95 },
  transition: { duration: 0.2 },
};

const DROPDOWN_WIDTH = 320;

const calculateCategoryCounts = (courses) => {
  const counts = {};
  CATEGORIES.forEach(cat => { counts[cat] = 0; });
  
  courses?.forEach(course => {
    const category = course.category;
    if (category && counts[category] !== undefined) {
      counts[category]++;
    }
  });
  
  return CATEGORIES.map(label => ({ label, count: counts[label] || 0 }));
};

const extractCategoryFromUrl = (params) => {
  let category = params.get('category');
  if (!category) category = params.get('categories');
  if (!category) return null;
  try { return decodeURIComponent(category); } catch { return category; }
};

const FilterButton = ({ isOpen, onClick, hasActiveFilter, disabled }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    disabled={disabled}
    className='flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all bg-white border border-gray-200 hover:border-purple-300 hover:shadow-md disabled:opacity-50'
    style={{ borderColor: hasActiveFilter ? '#534AB7' : undefined, color: hasActiveFilter ? '#534AB7' : '#5F5E5A' }}
  >
    <HiOutlineAdjustmentsHorizontal size={16} className={hasActiveFilter ? 'text-purple-600' : ''} />
    Filter
    {hasActiveFilter && <span className='text-white text-xs rounded-full px-1.5 py-0.5' style={{ background: '#534AB7' }}>1</span>}
    <HiChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
  </motion.button>
);

const CategoryList = ({ categories, selectedCategory, onSelectCategory }) => {
  if (categories.length === 0) {
    return <div className='px-5 py-8 text-center'><p className='text-sm text-gray-500'>No categories available</p></div>;
  }

  return (
    <div className='px-5 py-3'>
      <h4 className='text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3'>Select Category (Single Selection)</h4>
      <div className='flex flex-col gap-1 max-h-64 overflow-y-auto'>
        {categories.map(({ label, count }) => (
          <div key={label} onClick={() => onSelectCategory(label)} className='flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer transition hover:bg-purple-50 group'>
            <div className='w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all border-2' style={{ borderColor: selectedCategory === label ? '#534AB7' : '#D1D5DB' }}>
              {selectedCategory === label && <div className='w-2.5 h-2.5 rounded-full bg-purple-600' />}
            </div>
            <span className='text-sm flex-1 text-gray-700 group-hover:text-purple-600 transition'>{label}</span>
            {count > 0 && <span className='text-xs text-gray-400'>{count}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

const ApplyButton = ({ onClick, hasSelection, loading }) => (
  <div className='sticky bottom-0 bg-white px-5 py-4 border-t border-gray-100'>
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={loading || !hasSelection}
      className='w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all bg-gradient-to-r from-purple-600 to-purple-800 hover:shadow-md disabled:opacity-50'
    >
      {loading ? (
        <span className='flex items-center justify-center gap-2'>
          <svg className='animate-spin h-4 w-4' viewBox='0 0 24 24'>
            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' fill='none' />
            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
          </svg>
          Loading...
        </span>
      ) : 'Apply Filter'}
    </motion.button>
  </div>
);

const DropdownHeader = ({ selectedCategory, onClearAll }) => (
  <div className='sticky top-0 bg-white z-10 flex items-center justify-between px-5 pt-4 pb-2 border-b border-gray-100'>
    <span className='text-sm font-semibold text-gray-800'>Filter Courses</span>
    {selectedCategory && (
      <button onClick={onClearAll} className='text-xs text-purple-600 hover:text-purple-700 transition font-medium'>Clear filter</button>
    )}
  </div>
);

const FilterDropdown = ({ courses = [], onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState('left-0');
  
  const categoriesWithCounts = useMemo(() => calculateCategoryCounts(courses), [courses]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = extractCategoryFromUrl(params);
    setSelectedCategory(categoryFromUrl);
  }, [location.search]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownPosition(rect.right + DROPDOWN_WIDTH > window.innerWidth ? 'right-0' : 'left-0');
    }
  }, [isOpen]);

  const selectCategory = useCallback((category) => {
    setSelectedCategory(prev => prev === category ? null : category);
  }, []);

  // ✅ FIXED: Navigate to /courses
  const clearFilter = useCallback(() => {
    setSelectedCategory(null);
    navigate('/courses', { replace: true });
    if (onFilterChange) onFilterChange({ categories: [] });
    setIsOpen(false);
  }, [navigate, onFilterChange]);

  // ✅ FIXED: Navigate to /courses with category param
  const applyFilter = useCallback(() => {
    if (!selectedCategory) return;
    navigate(`/courses?category=${encodeURIComponent(selectedCategory)}`, { replace: true });
    if (onFilterChange) onFilterChange({ categories: [selectedCategory] });
    setIsOpen(false);
  }, [selectedCategory, navigate, onFilterChange]);

  return (
    <div className='relative' ref={dropdownRef}>
      <FilterButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} hasActiveFilter={!!selectedCategory} disabled={loading} />
      <AnimatePresence>
        {isOpen && (
          <motion.div {...DROPDOWN_ANIMATION} className={`absolute ${dropdownPosition} mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden`} style={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
            <DropdownHeader selectedCategory={selectedCategory} onClearAll={clearFilter} />
            <CategoryList categories={categoriesWithCounts} selectedCategory={selectedCategory} onSelectCategory={selectCategory} />
            <ApplyButton onClick={applyFilter} hasSelection={!!selectedCategory} loading={loading} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterDropdown;