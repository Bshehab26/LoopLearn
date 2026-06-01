// src/features/courses/pages/CoursesList.jsx
//
// Fixes applied:
//  1. Removed duplicate getAllCourses / searchCourses imports — useCourses hook owns
//     all data fetching (no more parallel fetch in the component).
//  2. SearchBar rendered with navigateOnSearch=false so it doesn't re-navigate while
//     we're already ON the courses page — it just updates local state.
//  3. URL ↔ state sync: on mount, read ?search & ?category from URL and feed them
//     into useCourses; on filter change, update URL (replace) without navigation.
//  4. Sort menu now closes on outside click.
//  5. Active filter chips shown below the filter bar so the user can see & clear them.
//  6. Pagination fully controlled by usePagination (no duplicate page state).
//  7. fetchInProgressRef guard removed — useCourses handles deduplication.
//  8. Responsive: 1 col mobile → 2 col tablet → 3 col laptop → 4 col desktop.

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineSortAscending, HiOutlineViewGrid, HiOutlineViewList,
  HiX, HiOutlineFilter,
} from 'react-icons/hi';

import CourseCard      from '../components/CourseCard';
import FilterDropdown  from '../components/FilterDropdown';
import SearchBar       from '../components/SearchBar';
import useCourses      from '../hooks/useCourses';
import usePagination   from '../../../shared/hooks/usePagination';
import useOutsideClick from '../../../shared/hooks/useOutsideClick';

// ============================================================================
// Constants
// ============================================================================

const SORT_OPTIONS = [
  { value: 'popular',    label: 'Most Popular',        icon: '🔥' },
  { value: 'rating',     label: 'Highest Rated',       icon: '⭐' },
  { value: 'price-low',  label: 'Price: Low → High',   icon: '💰' },
  { value: 'price-high', label: 'Price: High → Low',   icon: '💎' },
  { value: 'newest',     label: 'Newest First',        icon: '✨' },
];

const ITEMS_PER_PAGE = (() => {
  const w = window.innerWidth;
  if (w < 640)  return 4;
  if (w < 1024) return 6;
  return 8;
})();

// ============================================================================
// Sort helper (client-side since API doesn't support it)
// ============================================================================

const sortCourses = (list, sortBy) => {
  const arr = [...list];
  switch (sortBy) {
    case 'rating':     return arr.sort((a, b) => (b.averageRating   ?? 0) - (a.averageRating   ?? 0));
    case 'price-low':  return arr.sort((a, b) => (a.price           ?? 0) - (b.price           ?? 0));
    case 'price-high': return arr.sort((a, b) => (b.price           ?? 0) - (a.price           ?? 0));
    case 'newest':     return arr.sort((a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0));
    default:           return arr.sort((a, b) => (b.enrollmentCount ?? 0) - (a.enrollmentCount ?? 0));
  }
};

// ============================================================================
// Component
// ============================================================================

const CoursesList = () => {
  const navigate      = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial values from URL (on first load)
  const initialSearch   = searchParams.get('search')   || '';
  const initialCategory = searchParams.get('category') || '';

  // ── useCourses owns all fetching ──────────────────────────────────────────
  const {
    courses,
    loading,
    error,
    filters,
    updateFilters,
    searchCoursesDebounced,
    filterByCategories,
    clearFilters: clearAllFilters,
  } = useCourses({
    searchTerm: initialSearch,
    categories: initialCategory ? [initialCategory] : [],
  });

  // ── UI state ──────────────────────────────────────────────────────────────
  const [viewMode,     setViewMode]     = useState('grid');
  const [sortBy,       setSortBy]       = useState('popular');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const sortMenuRef = useRef(null);
  useOutsideClick(sortMenuRef, () => setShowSortMenu(false));

  // ── Sync URL when filters change ──────────────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.searchTerm)      params.set('search',   filters.searchTerm);
    if (filters.categories[0])   params.set('category', filters.categories[0]);
    setSearchParams(params, { replace: true });
  }, [filters.searchTerm, filters.categories, setSearchParams]);

  // ── Derived data ──────────────────────────────────────────────────────────
  const sorted = sortCourses(courses, sortBy);

  const {
    currentItems:  paginatedCourses,
    currentPage,
    totalPages,
    goToPage,
    goNext,
    goPrev,
    isFirstPage,
    isLastPage,
  } = usePagination({ items: sorted, itemsPerPage: ITEMS_PER_PAGE, scrollToTop: true });

  // ── Handlers ──────────────────────────────────────────────────────────────

  /** ✅ FIX: SearchBar navigateOnSearch=false → only call updateFilters */
  const handleSearch = useCallback((term) => {
    searchCoursesDebounced(term);
  }, [searchCoursesDebounced]);

  const handleFilterChange = useCallback((newFilters) => {
    filterByCategories(newFilters.categories ?? []);
  }, [filterByCategories]);

  const handleClearFilters = () => {
    clearAllFilters();
    setSortBy('popular');
  };

  const removeCategory = (cat) => {
    filterByCategories(filters.categories.filter(c => c !== cat));
  };

  const hasActiveFilters = filters.searchTerm || filters.categories.length > 0;

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading && courses.length === 0) return <CoursesListSkeleton />;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-12 pt-20 pb-20">

        {/* ── Breadcrumb ── */}
        <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
          <span
            className="text-violet-600 cursor-pointer hover:underline"
            onClick={() => navigate('/')}
          >Home</span>
          <span className="mx-2">/</span>
          <span className="text-gray-700">Courses</span>
          {filters.searchTerm && (
            <><span className="mx-2">/</span>
            <span className="text-violet-600">"{filters.searchTerm}"</span></>
          )}
        </nav>

        {/* ── Page heading ── */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-3">
            {filters.searchTerm
              ? <>Results for <span className="text-violet-600">"{filters.searchTerm}"</span></>
              : filters.categories.length > 0
                ? <>{filters.categories[0]} <span className="text-violet-600">Courses</span></>
                : <>Explore <span className="text-violet-600">Our Courses</span></>
            }
          </h1>
          <p className="text-gray-500 text-base sm:text-lg">
            {courses.length === 0 && !loading
              ? 'No courses matched your search.'
              : `${courses.length.toLocaleString()} course${courses.length !== 1 ? 's' : ''} available`
            }
          </p>

          {/* ✅ SearchBar — navigateOnSearch=false, no re-navigation loop */}
          <div className="mt-5 max-w-lg">
            <SearchBar
              variant="default"
              onSearch={handleSearch}
              initialValue={filters.searchTerm}
              navigateOnSearch={false}
            />
          </div>
        </div>

        {/* ── Filter & Sort bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-4 border-y border-gray-200">
          {/* Left: filters + sort */}
          <div className="flex items-center gap-2 flex-wrap">
            <FilterDropdown courses={courses} onFilterChange={handleFilterChange} />

            {/* Sort dropdown */}
            <div className="relative" ref={sortMenuRef}>
              <button
                onClick={() => setShowSortMenu(v => !v)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium bg-white border border-gray-200 hover:border-violet-300 transition-colors shadow-sm"
              >
                <HiOutlineSortAscending size={15} className="text-violet-600" />
                <span className="hidden xs:inline text-gray-600">Sort:</span>
                <span className="font-semibold text-gray-800">
                  {SORT_OPTIONS.find(o => o.value === sortBy)?.label}
                </span>
              </button>

              <AnimatePresence>
                {showSortMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                  >
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortBy(opt.value); setShowSortMenu(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors
                          ${sortBy === opt.value
                            ? 'bg-violet-50 text-violet-700 font-semibold'
                            : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        <span>{opt.icon}</span> {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: result count + view toggle */}
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-500 hidden sm:block">
              Showing{' '}
              <span className="font-semibold text-violet-600">{paginatedCourses.length}</span>
              {' '}of{' '}
              <span className="font-semibold">{courses.length}</span>
            </p>

            <div className="flex gap-0.5 bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
                className={`p-2 rounded-full transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white shadow text-violet-600'
                    : 'text-gray-400 hover:text-violet-500'
                }`}
              >
                <HiOutlineViewGrid size={17} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                aria-label="List view"
                className={`p-2 rounded-full transition-all ${
                  viewMode === 'list'
                    ? 'bg-white shadow text-violet-600'
                    : 'text-gray-400 hover:text-violet-500'
                }`}
              >
                <HiOutlineViewList size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* ✅ Active filter chips — visible feedback, easy removal */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap items-center gap-2 mt-3 overflow-hidden"
            >
              {filters.searchTerm && (
                <FilterChip
                  label={`Search: "${filters.searchTerm}"`}
                  onRemove={() => updateFilters({ searchTerm: '' })}
                />
              )}
              {filters.categories.map(cat => (
                <FilterChip key={cat} label={cat} onRemove={() => removeCategory(cat)} />
              ))}
              <button
                onClick={handleClearFilters}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors underline ml-1"
              >
                Clear all
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Course grid / list ── */}
        {error && (
          <div className="mt-10 text-center py-12 bg-red-50 rounded-2xl border border-red-100">
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={() => clearAllFilters()}
              className="mt-3 px-4 py-2 text-sm bg-red-500 text-white rounded-full hover:bg-red-600 transition"
            >
              Retry
            </button>
          </div>
        )}

        {paginatedCourses.length > 0 ? (
          <div className={`mt-8 ${
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
              : 'flex flex-col gap-4'
          }`}>
            {paginatedCourses.map((course, i) => (
              <CourseCard key={course.id ?? i} course={course} viewMode={viewMode} />
            ))}
          </div>
        ) : !loading && !error && (
          <EmptyState onClear={handleClearFilters} hasFilters={hasActiveFilters} />
        )}

        {/* Loading spinner while re-fetching */}
        {loading && courses.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={goPrev}
            onNext={goNext}
            onGoTo={goToPage}
            isFirstPage={isFirstPage}
            isLastPage={isLastPage}
          />
        )}
      </div>
    </div>
  );
};

// ============================================================================
// Sub-components
// ============================================================================

const FilterChip = ({ label, onRemove }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-100 text-violet-700 text-xs font-medium rounded-full"
  >
    {label}
    <button onClick={onRemove} aria-label={`Remove ${label} filter`}
      className="hover:text-violet-900 transition-colors">
      <HiX size={12} />
    </button>
  </motion.span>
);

const EmptyState = ({ onClear, hasFilters }) => (
  <div className="text-center py-24">
    <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-violet-100 flex items-center justify-center text-4xl">
      🔍
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">No courses found</h3>
    <p className="text-gray-500 mb-5 text-sm">
      {hasFilters ? 'Try adjusting your filters or search term.' : 'No courses are available right now.'}
    </p>
    {hasFilters && (
      <button
        onClick={onClear}
        className="px-6 py-2 bg-violet-600 text-white rounded-full text-sm font-semibold hover:bg-violet-700 transition"
      >
        Clear Filters
      </button>
    )}
  </div>
);

const Pagination = ({ currentPage, totalPages, onPrev, onNext, onGoTo, isFirstPage, isLastPage }) => {
  // Build page numbers: always show first, last, current ±1, with ellipsis
  const pages = [];
  const range = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1]
    .filter(p => p >= 1 && p <= totalPages));
  const sorted = [...range].sort((a, b) => a - b);

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) pages.push('…');
    pages.push(sorted[i]);
  }

  return (
    <nav
      aria-label="Pagination"
      className="flex justify-center items-center gap-1.5 mt-12"
    >
      <PagBtn onClick={onPrev} disabled={isFirstPage} aria="Previous page">
        ← Prev
      </PagBtn>

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className="px-2 text-gray-400 text-sm select-none">…</span>
        ) : (
          <PagBtn
            key={p}
            onClick={() => onGoTo(p)}
            active={p === currentPage}
            aria={`Page ${p}`}
          >
            {p}
          </PagBtn>
        )
      )}

      <PagBtn onClick={onNext} disabled={isLastPage} aria="Next page">
        Next →
      </PagBtn>
    </nav>
  );
};

const PagBtn = ({ children, onClick, disabled, active, aria }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={aria}
    aria-current={active ? 'page' : undefined}
    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all
      ${active
        ? 'bg-violet-600 text-white shadow-md shadow-violet-200'
        : disabled
          ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
          : 'bg-white border border-gray-200 text-gray-700 hover:border-violet-400 hover:text-violet-600'
      }`}
  >
    {children}
  </button>
);

// ── Skeleton ─────────────────────────────────────────────────────────────────

const Shimmer = ({ className = '' }) => (
  <div className={`relative overflow-hidden bg-gray-100 rounded-xl ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[shimmer_1.4s_infinite]" />
  </div>
);

const CardSkeleton = () => (
  <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
    <Shimmer className="h-44 rounded-none" />
    <div className="p-4 space-y-2.5">
      <Shimmer className="h-4 w-4/5" />
      <Shimmer className="h-3 w-3/5" />
      <Shimmer className="h-3 w-2/5 mt-3" />
    </div>
  </div>
);

const CoursesListSkeleton = () => (
  <div className="max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-12 pt-20 pb-20">
    <Shimmer className="h-8 w-56 mb-3" />
    <Shimmer className="h-4 w-80 mb-10" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {[...Array(8)].map((_, i) => <CardSkeleton key={i} />)}
    </div>
  </div>
);

export default CoursesList;