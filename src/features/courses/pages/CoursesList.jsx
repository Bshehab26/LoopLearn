// src/features/courses/pages/CoursesList.jsx
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import FilterDropdown from '../components/FilterDropdown';
import SearchBar from '../components/SearchBar';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineSortAscending, HiOutlineViewGrid, HiOutlineViewList } from 'react-icons/hi';
import { getAllCourses, searchCourses } from '../api/course.api';
import usePagination from '../../../shared/hooks/usePagination';

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

const CoursesList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const searchTermFromUrl = searchParams.get('search') || '';
  const categoryFromUrl = searchParams.get('category') || '';
  
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ 
    categories: categoryFromUrl ? [categoryFromUrl] : [] 
  });
  const [itemsPerPage, setItemsPerPage] = useState(getResponsiveItemsPerPage());
  const [searchTerm, setSearchTerm] = useState(searchTermFromUrl);
  
  const sortMenuRef = useRef(null);
  const fetchInProgressRef = useRef(false);

  // Fetch all courses (only published ones)
  const fetchCourses = useCallback(async () => {
    if (fetchInProgressRef.current) return;
    fetchInProgressRef.current = true;
    setLoading(true);
    
    try {
      let result;
      if (searchTerm) {
        result = await searchCourses(searchTerm);
      } else {
        result = await getAllCourses();
      }
      
      if (result.success) {
        // Filter only published courses for public view
        const publishedCourses = (result.data || []).filter(
          course => course.status === 'Published' || course.status === 'published'
        );
        setAllCourses(publishedCourses);
      } else {
        setAllCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setAllCourses([]);
    } finally {
      setLoading(false);
      fetchInProgressRef.current = false;
    }
  }, [searchTerm]);
  
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);
  
  // Apply filters
  const filteredCourses = useMemo(() => {
    let result = [...allCourses];
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(course => 
        course.title?.toLowerCase().includes(searchLower) ||
        course.category?.toLowerCase().includes(searchLower) ||
        course.instructorName?.toLowerCase().includes(searchLower)
      );
    }
    
    if (activeFilters.categories && activeFilters.categories.length > 0) {
      result = result.filter(course => 
        activeFilters.categories.includes(course.category)
      );
    }
    
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
      default:
        result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
    }
    
    return result;
  }, [allCourses, searchTerm, activeFilters, sortBy]);
  
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
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (activeFilters.categories[0]) params.set('category', activeFilters.categories[0]);
    setSearchParams(params, { replace: true });
  }, [searchTerm, activeFilters, setSearchParams]);
  
  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  
  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setActiveFilters({ categories: [] });
  };
  
  if (loading && allCourses.length === 0) {
    return <CoursesListSkeleton />;
  }
  
  const totalCourses = filteredCourses.length;
  
  return (
    <div className='relative md:px-36 px-6 pt-20 pb-16 text-left min-h-screen bg-gradient-to-b from-white to-gray-50'>
      {/* Header */}
      <div className='mb-10'>
        <div className='mb-6'>
          <p className='text-sm text-gray-500'>
            <span className='text-purple-600 cursor-pointer hover:underline' onClick={() => navigate('/')}>Home</span>
            <span className='mx-2'>/</span>
            <span className='text-gray-700'>Courses</span>
            {searchTerm && (
              <><span className='mx-2'>/</span><span className='text-purple-600'>Search: "{searchTerm}"</span></>
            )}
            {activeFilters.categories.length > 0 && !searchTerm && (
              <><span className='mx-2'>/</span><span className='text-purple-600'>Filtered: {activeFilters.categories[0]}</span></>
            )}
          </p>
        </div>

        <h1 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-4'>
          {searchTerm 
            ? `Search Results for "${searchTerm}"` 
            : activeFilters.categories.length > 0 
              ? `${activeFilters.categories[0]} Courses`
              : 'Explore Our Courses'}
        </h1>
        
        <p className='text-gray-500 text-lg max-w-2xl'>
          {searchTerm 
            ? `Found ${totalCourses} course${totalCourses !== 1 ? 's' : ''} matching your search`
            : activeFilters.categories.length > 0
              ? `Found ${totalCourses} course${totalCourses !== 1 ? 's' : ''} in ${activeFilters.categories[0]}`
              : `Discover ${totalCourses} courses from expert instructors`}
        </p>
        
        {/* Search Bar */}
        <div className="mt-6 max-w-xl">
          <SearchBar variant="default" onSearch={handleSearch} initialValue={searchTerm} />
        </div>
      </div>
      
      {/* Filters Bar */}
      <div className='flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gray-100'>
        <div className='flex items-center gap-3'>
          <FilterDropdown courses={allCourses} onFilterChange={setActiveFilters} />
          
          <div className="relative" ref={sortMenuRef}>
            <button onClick={() => setShowSortMenu(!showSortMenu)} className='flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white border border-gray-200 hover:border-purple-300'>
              <HiOutlineSortAscending size={16} className='text-purple-600' />
              <span className='hidden sm:inline'>Sort: </span>
              <span className='font-medium'>{SORT_OPTIONS.find(opt => opt.value === sortBy)?.label}</span>
            </button>
            
            <AnimatePresence>
              {showSortMenu && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden`}>
                  {SORT_OPTIONS.map(option => (
                    <button key={option.value} onClick={() => { setSortBy(option.value); setShowSortMenu(false); }} className={`w-full text-left px-4 py-3 text-sm transition-all flex items-center gap-2 ${sortBy === option.value ? 'bg-purple-50 text-purple-600 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}>
                      <span>{option.icon}</span> {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className='flex items-center gap-4'>
          <p className='text-sm text-gray-500'>Showing <span className='font-semibold text-purple-600'>{paginatedCourses.length}</span> of <span className='font-semibold'>{totalCourses}</span> results</p>
          <div className='flex gap-1 bg-gray-100 rounded-full p-1'>
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500 hover:text-purple-500'}`}><HiOutlineViewGrid size={18} /></button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-full transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500 hover:text-purple-500'}`}><HiOutlineViewList size={18} /></button>
          </div>
        </div>
      </div>
      
      {/* Course Grid */}
      {paginatedCourses.length > 0 ? (
        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'flex flex-col gap-4'} my-8`}>
          {paginatedCourses.map((course, index) => (
            <div key={course.id || index} onClick={() => handleCourseClick(course.id)} className="cursor-pointer">
              <CourseCard course={course} viewMode={viewMode} />
            </div>
          ))}
        </div>
      ) : !loading && (
        <div className='text-center py-20'>
          <div className='w-24 h-24 mx-auto mb-6 rounded-full bg-purple-100 flex items-center justify-center'><span className='text-4xl'>🔍</span></div>
          <h3 className='text-xl font-semibold text-gray-800 mb-2'>No courses found</h3>
          <button onClick={clearFilters} className='px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700'>Clear Filters</button>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex justify-center items-center mt-8 gap-2'>
          <button onClick={goPrev} disabled={isFirstPage} className='px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50'>← Prev</button>
          <span className='px-4 py-2 text-gray-600'>Page {currentPage} of {totalPages}</span>
          <button onClick={goNext} disabled={isLastPage} className='px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50'>Next →</button>
        </div>
      )}
    </div>
  );
};

// Skeleton component (keep existing)
const Shimmer = ({ style = {} }) => (
  <div style={{ background: '#EEEDFE', borderRadius: 12, overflow: 'hidden', position: 'relative', ...style }}>
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)', animation: 'shimmer 1.5s infinite' }} />
  </div>
);

const CourseCardSkeleton = () => (
  <div style={{ background: 'white', border: '0.5px solid rgba(0,0,0,0.07)', borderRadius: 16, overflow: 'hidden' }}>
    <Shimmer style={{ height: 180, borderRadius: 0 }} />
    <div style={{ padding: 16 }}>
      <Shimmer style={{ height: 18, width: '85%', marginBottom: 10 }} />
      <Shimmer style={{ height: 14, width: '55%', marginBottom: 10 }} />
      <Shimmer style={{ height: 20, width: '40%' }} />
    </div>
  </div>
);

const CoursesListSkeleton = () => (
  <div className='md:px-36 px-6 pt-20 pb-16'>
    <div className='mb-10'>
      <Shimmer style={{ height: 40, width: 220, marginBottom: 16 }} />
      <Shimmer style={{ height: 20, width: 300 }} />
    </div>
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {[...Array(8)].map((_, i) => <CourseCardSkeleton key={i} />)}
    </div>
  </div>
);

export default CoursesList;