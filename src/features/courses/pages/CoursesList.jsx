/**
 * CoursesList.jsx
 * Course listing page with search, filters, sorting, and pagination.
 * Uses client-side filtering since backend filter endpoint is not working.
 */

import React, { useEffect, useState, useContext, useRef, useCallback, useMemo } from 'react';
import { AppContext } from '../../../store/AppContext';
import CourseCard from '../components/CourseCard';
import FilterDropdown from '../components/FilterDropdown';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineSortAscending, HiOutlineViewGrid, HiOutlineViewList } from 'react-icons/hi';
import { courseApi } from '../api/course.api';
import usePagination from '../../../shared/hooks/usePagination';

// ============================================================================
// Constants
// ============================================================================

const getResponsiveItemsPerPage = () => {
  const width = window.innerWidth;
  if (width < 768) return 3;
  if (width < 1280) return 6;
  return 8;
};

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular', icon: '🔥' },
  { value: 'price-low', label: 'Price: Low to High', icon: '💰' },
  { value: 'price-high', label: 'Price: High to Low', icon: '💎' },
  { value: 'newest', label: 'Newest First', icon: '✨' }
];

// ============================================================================
// Skeleton Components
// ============================================================================

const Shimmer = ({ style = {} }) => (
  <div style={{ background: '#EEEDFE', borderRadius: 12, overflow: 'hidden', position: 'relative', ...style }}>
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)', animation: 'shimmer 1.5s infinite' }} />
  </div>
);

const CourseCardSkeleton = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    style={{ background: 'white', border: '0.5px solid rgba(0,0,0,0.07)', borderRadius: 16, overflow: 'hidden' }}
  >
    <Shimmer style={{ height: 180, borderRadius: 0 }} />
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Shimmer style={{ height: 18, width: '85%' }} />
      <Shimmer style={{ height: 14, width: '55%' }} />
      <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
        <Shimmer style={{ height: 14, width: 60 }} />
        <Shimmer style={{ height: 14, width: 100 }} />
      </div>
      <Shimmer style={{ height: 20, width: '40%', marginTop: 8 }} />
    </div>
  </motion.div>
);

const CoursesListSkeleton = () => {
  const itemsPerPage = getResponsiveItemsPerPage();
  return (
    <div className='md:px-36 px-6 pt-20 pb-16'>
      <style>{`@keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }`}</style>
      <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full mb-10'>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Shimmer style={{ height: 40, width: 220 }} />
          <Shimmer style={{ height: 16, width: 180 }} />
        </div>
        <Shimmer style={{ height: 42, width: 300, borderRadius: 99 }} />
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 my-10'>
        {[...Array(itemsPerPage)].map((_, i) => <CourseCardSkeleton key={i} />)}
      </div>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

const CoursesList = () => {
  const { navigate } = useContext(AppContext);
  const { input } = useParams();
  const location = useLocation();
  const decodedInput = decodeURIComponent(input || '');
  
  // State
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ categories: [] });
  const [itemsPerPage, setItemsPerPage] = useState(getResponsiveItemsPerPage());
  
  const sortMenuRef = useRef(null);
  const fetchInProgressRef = useRef(false);
  const isInitialMount = useRef(true);
  
  // Apply filters and search CLIENT-SIDE
  const filteredCourses = useMemo(() => {
    let result = [...allCourses];
    
    // Apply search filter (client-side)
    if (decodedInput) {
      const searchLower = decodedInput.toLowerCase();
      result = result.filter(course => 
        course.title?.toLowerCase().includes(searchLower) ||
        course.category?.toLowerCase().includes(searchLower) ||
        course.instructorName?.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply category filter (client-side)
    if (activeFilters.categories && activeFilters.categories.length > 0) {
      result = result.filter(course => 
        activeFilters.categories.includes(course.category)
      );
    }
    
    // Apply sorting (client-side)
    switch(sortBy) {
      case 'price-low':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      default: // 'popular'
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }
    
    console.log('[CoursesList] Filtered courses:', result.length, 'from', allCourses.length);
    return result;
  }, [allCourses, decodedInput, activeFilters, sortBy]);
  
  // Use pagination hook on filtered results
  const {
    currentItems: paginatedCourses,
    currentPage,
    totalPages,
    goToPage,
    goNext,
    goPrev,
    isFirstPage,
    isLastPage
  } = usePagination({
    items: filteredCourses,
    itemsPerPage: itemsPerPage,
    scrollToTop: true
  });
  
  // Handle window resize for responsive items per page
  useEffect(() => {
    const handleResize = () => {
      const newItemsPerPage = getResponsiveItemsPerPage();
      if (newItemsPerPage !== itemsPerPage) {
        setItemsPerPage(newItemsPerPage);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [itemsPerPage]);
  
  // Parse URL params to get active filters on load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // Check for category filter
    let category = params.get('category');
    if (!category) category = params.get('categories');
    
    if (category) {
      try {
        const decodedCategory = decodeURIComponent(category);
        setActiveFilters({ categories: [decodedCategory] });
        console.log('[CoursesList] Filter from URL:', decodedCategory);
      } catch {
        setActiveFilters({ categories: [category] });
      }
    } else {
      setActiveFilters({ categories: [] });
    }
    
    // Check for search term
    const searchTerm = params.get('search');
    // Search is handled by the URL param `input` already
  }, [location.search]);
  
  // Close sort menu when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target)) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  
  // Fetch all courses (once)
  const fetchCourses = useCallback(async () => {
    if (fetchInProgressRef.current) return;
    
    fetchInProgressRef.current = true;
    setLoading(true);
    
    try {
      console.log('[CoursesList] Fetching all courses...');
      const result = await courseApi.getAllCourses();
      
      if (result.success) {
        setAllCourses(result.data || []);
        console.log('[CoursesList] Loaded', result.data?.length, 'courses');
      } else {
        console.error('[CoursesList] API error:', result.message);
        setAllCourses([]);
      }
    } catch (error) {
      console.error('[CoursesList] Error fetching courses:', error);
      setAllCourses([]);
    } finally {
      setLoading(false);
      fetchInProgressRef.current = false;
    }
  }, []);
  
  // Fetch courses on mount
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);
  
  const clearSearch = useCallback(() => {
    navigate('/course-list');
    setActiveFilters({ categories: [] });
  }, [navigate]);
  
  const handleFilterChange = useCallback((filters) => {
    console.log('[CoursesList] Filter changed:', filters);
    setActiveFilters({ categories: filters.categories || [] });
  }, []);
  
  // Sort dropdown position
  const [sortDropdownPosition, setSortDropdownPosition] = useState('left-0');
  useEffect(() => {
    if (showSortMenu && sortMenuRef.current) {
      const rect = sortMenuRef.current.getBoundingClientRect();
      const screenWidth = window.innerWidth;
      const dropdownWidth = 224;
      setSortDropdownPosition(rect.left + dropdownWidth > screenWidth ? 'right-0' : 'left-0');
    }
  }, [showSortMenu]);
  
  // Loading state
  if (loading && allCourses.length === 0) {
    return <CoursesListSkeleton />;
  }
  
  const totalCourses = filteredCourses.length;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className='relative md:px-36 px-6 pt-20 pb-16 text-left min-h-screen bg-gradient-to-b from-white to-gray-50'
    >
      {/* Header */}
      <div className='mb-10'>
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className='mb-6'
        >
          <p className='text-sm text-gray-500'>
            <span className='text-purple-600 cursor-pointer hover:underline transition' onClick={() => navigate('/')}>
              Home
            </span>
            <span className='mx-2'>/</span>
            <span className='text-gray-700'>Courses</span>
            {decodedInput && (
              <>
                <span className='mx-2'>/</span>
                <span className='text-purple-600'>Search: "{decodedInput}"</span>
              </>
            )}
            {activeFilters.categories.length > 0 && !decodedInput && (
              <>
                <span className='mx-2'>/</span>
                <span className='text-purple-600'>
                  Filtered: {activeFilters.categories[0]}
                </span>
              </>
            )}
          </p>
        </motion.div>

        <motion.h1 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-4'
        >
          {decodedInput 
            ? `Search Results for "${decodedInput}"` 
            : activeFilters.categories.length > 0 
              ? `${activeFilters.categories[0]} Courses`
              : 'Explore Our Courses'}
        </motion.h1>
        
        <motion.p 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className='text-gray-500 text-lg max-w-2xl'
        >
          {decodedInput 
            ? `Found ${totalCourses} course${totalCourses !== 1 ? 's' : ''} matching your search`
            : activeFilters.categories.length > 0
              ? `Found ${totalCourses} course${totalCourses !== 1 ? 's' : ''} in ${activeFilters.categories[0]}`
              : `Discover ${totalCourses} courses from expert instructors`}
        </motion.p>
        
        {/* Active filters display */}
        {activeFilters.categories.length > 0 && !decodedInput && (
          <div className='flex flex-wrap gap-2 mt-4'>
            {activeFilters.categories.map(cat => (
              <span key={cat} className='px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700'>
                {cat}
              </span>
            ))}
            <button
              onClick={() => setActiveFilters({ categories: [] })}
              className='text-xs text-gray-500 hover:text-purple-600 transition'
            >
              Clear all
            </button>
          </div>
        )}
      </div>
      
      {/* Filters and Controls Bar */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className='flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gray-100'
      >
        <div className='flex items-center gap-3'>
          <FilterDropdown 
            courses={allCourses}
            onFilterChange={handleFilterChange} 
          />
          
          {/* Sort Dropdown */}
          <div className="relative" ref={sortMenuRef}>
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className='flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white border border-gray-200 hover:border-purple-300 transition-all'
            >
              <HiOutlineSortAscending size={16} className='text-purple-600' />
              <span className='hidden sm:inline'>Sort: </span>
              <span className='font-medium'>{SORT_OPTIONS.find(opt => opt.value === sortBy)?.label}</span>
            </button>
            
            <AnimatePresence>
              {showSortMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`absolute ${sortDropdownPosition} mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden`}
                >
                  {SORT_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowSortMenu(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm transition-all flex items-center gap-2 ${
                        sortBy === option.value 
                          ? 'bg-purple-50 text-purple-600 font-medium' 
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span>{option.icon}</span>
                      {option.label}
                      {sortBy === option.value && (
                        <svg className='ml-auto w-4 h-4' viewBox='0 0 20 20' fill='currentColor'>
                          <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                        </svg>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* View Mode Toggle & Results Count */}
        <div className='flex items-center gap-4'>
          <p className='text-sm text-gray-500'>
            Showing <span className='font-semibold text-purple-600'>{paginatedCourses.length}</span> of{' '}
            <span className='font-semibold'>{totalCourses}</span> results
            <span className='text-xs text-gray-400 ml-2'>({itemsPerPage} per page)</span>
          </p>
          <div className='flex gap-1 bg-gray-100 rounded-full p-1'>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500 hover:text-purple-500'}`}
            >
              <HiOutlineViewGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-full transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500 hover:text-purple-500'}`}
            >
              <HiOutlineViewList size={18} />
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Course Grid/List */}
      <AnimatePresence mode='wait'>
        {paginatedCourses.length > 0 ? (
          <motion.div 
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                : 'flex flex-col gap-4'
            } my-8`}
          >
            {paginatedCourses.map((course, index) => (
              <motion.div
                key={course.id || index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.5) }}
              >
                <CourseCard course={course} viewMode={viewMode} />
              </motion.div>
            ))}
          </motion.div>
        ) : !loading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className='text-center py-20'
          >
            <div className='w-24 h-24 mx-auto mb-6 rounded-full bg-purple-100 flex items-center justify-center'>
              <span className='text-4xl'>🔍</span>
            </div>
            <h3 className='text-xl font-semibold text-gray-800 mb-2'>No courses found</h3>
            <p className='text-gray-500 mb-6 max-w-md mx-auto'>
              {decodedInput 
                ? `We couldn't find any courses matching "${decodedInput}".`
                : activeFilters.categories.length > 0
                  ? `No courses found in ${activeFilters.categories[0]}.`
                  : 'No courses available at the moment.'}
            </p>
            {(decodedInput || activeFilters.categories.length > 0) && (
              <button
                onClick={clearSearch}
                className='px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition'
              >
                Clear {decodedInput ? 'Search' : 'Filters'}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className='flex justify-center items-center mt-8 gap-2 flex-wrap'>
          <button 
            onClick={goPrev}
            disabled={isFirstPage} 
            className='px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition'
          >
            ← Prev
          </button>
          
          {(() => {
            const pages = [];
            const maxVisible = 7;
            
            if (totalPages <= maxVisible) {
              for (let i = 1; i <= totalPages; i++) pages.push(i);
            } else if (currentPage <= 4) {
              for (let i = 1; i <= 5; i++) pages.push(i);
              pages.push('...');
              pages.push(totalPages);
            } else if (currentPage >= totalPages - 3) {
              pages.push(1);
              pages.push('...');
              for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
            } else {
              pages.push(1);
              pages.push('...');
              for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
              pages.push('...');
              pages.push(totalPages);
            }
            
            return pages.map((page, idx) => {
              if (page === '...') {
                return (
                  <span key={`ellipsis-${idx}`} className='px-4 py-2 text-gray-500'>
                    ...
                  </span>
                );
              }
              
              return (
                <button 
                  key={page}
                  onClick={() => goToPage(page)} 
                  className={`px-4 py-2 rounded-lg transition ${
                    currentPage === page 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              );
            });
          })()}
          
          <button 
            onClick={goNext}
            disabled={isLastPage} 
            className='px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition'
          >
            Next →
          </button>
        </div>
      )}
      
      {/* Page Info */}
      {totalPages > 1 && (
        <div className='text-center text-sm text-gray-500 mt-4'>
          Page {currentPage} of {totalPages} • {totalCourses} total courses
          <span className='ml-2 text-purple-600'>
            (Showing {paginatedCourses.length} of {totalCourses})
          </span>
        </div>
      )}
      
      {/* Back to Top Button */}
      {paginatedCourses.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className='text-center mt-12'
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className='px-8 py-3 border-2 border-purple-600 text-purple-600 rounded-full font-medium hover:bg-purple-50 transition-all duration-300'
          >
            Back to Top ↑
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CoursesList;