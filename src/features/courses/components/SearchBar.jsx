/**
 * SearchBar.jsx
 *
 * FIXES:
 *  1. Double clear button: `type="search"` was giving the browser its own ×
 *     in addition to the custom HiX button. Changed to `type="text"` so only
 *     the custom clear button exists.
 *  2. Hardcoded POPULAR_SUGGESTIONS replaced with real categories fetched from
 *     GET /api/Category via useCategories hook. Suggestions now show actual
 *     category names from the database, with a loading shimmer while fetching.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { HiSearch, HiX } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useCategories from '../hooks/useCategories';

// ============================================================================
// Constants
// ============================================================================

const MAX_SUGGESTIONS = 8;

const DROP_ANIM = {
  initial:    { opacity: 0, y: -8, scale: 0.98 },
  animate:    { opacity: 1, y: 0,  scale: 1     },
  exit:       { opacity: 0, y: -8, scale: 0.98  },
  transition: { duration: 0.18 },
};

// ============================================================================
// Helpers
// ============================================================================

const normalize = (str = '') => str.toLowerCase().trim().replace(/\s+/g, ' ');

/**
 * Filter category names by the current query.
 * Returns scored matches sorted by relevance.
 */
const filterSuggestions = (query, categoryNames) => {
  const q = normalize(query);
  if (!q || !categoryNames.length) return [];

  return categoryNames
    .map((name) => {
      const ns = normalize(name);
      let score = 0;
      if (ns === q)               score = 100;
      else if (ns.startsWith(q))  score = 80;
      else if (ns.includes(q))    score = 60;
      else if (ns.split(' ').some((w) => w.startsWith(q))) score = 40;
      return { label: name, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_SUGGESTIONS);
};

const Highlight = ({ text, query }) => {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1 || !query) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="font-semibold text-violet-600">
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </>
  );
};

// ============================================================================
// Suggestions Dropdown
// ============================================================================

const SuggestionsDropdown = ({ suggestions, query, activeIndex, onSelect, loading }) => {
  // Show loading shimmer while categories are being fetched
  if (loading) {
    return (
      <motion.div
        {...DROP_ANIM}
        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-3 px-4 space-y-2"
      >
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${60 + i * 15}%` }} />
        ))}
      </motion.div>
    );
  }

  if (!suggestions.length) return null;

  return (
    <motion.ul
      {...DROP_ANIM}
      role="listbox"
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden py-1"
    >
      <li className="px-4 pt-2 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
        Categories
      </li>
      {suggestions.map(({ label }, idx) => (
        <li key={label} role="option" aria-selected={idx === activeIndex}>
          <button
            onMouseDown={(e) => { e.preventDefault(); onSelect(label); }}
            className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors group
              ${idx === activeIndex ? 'bg-violet-50 text-violet-700' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            <HiSearch size={13} className="text-gray-400 flex-shrink-0 group-hover:text-violet-500" />
            <span className="truncate">
              <Highlight text={label} query={query} />
            </span>
          </button>
        </li>
      ))}
    </motion.ul>
  );
};

// ============================================================================
// Input variants
// FIX 1: type="text" instead of type="search" removes the browser's native ×
// ============================================================================

const HeroInput = ({ inputRef, value, onChange, onFocus, onBlur, onSubmit, onClear, inputId }) => (
  <form onSubmit={onSubmit} className="relative w-full max-w-2xl mx-auto" role="search">
    <HiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
    <input
      id={inputId}
      ref={inputRef}
      type="text"          // ← was "search" (caused double × button)
      autoComplete="off"
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder="Search courses… (e.g. React, Python, Design)"
      aria-label="Search courses"
      className="w-full pl-12 pr-28 py-4 text-base rounded-full border border-gray-200 bg-white shadow-sm
                 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 outline-none transition-all"
    />
    {value && (
      <button type="button" onClick={onClear} aria-label="Clear"
        className="absolute right-28 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition p-1">
        <HiX size={17} />
      </button>
    )}
    <button type="submit"
      className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600
                 text-white rounded-full text-sm font-semibold hover:shadow-md transition-shadow">
      Search
    </button>
  </form>
);

const DefaultInput = ({ inputRef, value, onChange, onFocus, onBlur, onSubmit, onClear, inputId }) => (
  <form onSubmit={onSubmit} role="search">
    <div className="relative">
      <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={15} />
      <input
        id={inputId}
        ref={inputRef}
        type="text"        // ← was "search" (caused double × button)
        autoComplete="off"
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Search courses…"
        aria-label="Search courses"
        className="w-48 md:w-64 pl-9 pr-8 py-2 text-sm rounded-full border border-gray-200 bg-gray-50
                   focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all"
      />
      {value && (
        <button type="button" onClick={onClear} aria-label="Clear"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
          <HiX size={13} />
        </button>
      )}
    </div>
  </form>
);

// ============================================================================
// Main Component
// ============================================================================

/**
 * SearchBar
 *
 * Props:
 *  variant          'hero' | 'default'
 *  onSearch(term)   called with trimmed query on submit / suggestion click
 *  onSearchComplete called after navigation (optional)
 *  showSuggestions  boolean (default true)
 *  initialValue     pre-filled value (e.g. from URL param) — only used on mount
 *  navigateOnSearch boolean (default true) — set false when parent owns the URL
 */
const SearchBar = ({
  variant          = 'default',
  onSearch,
  onSearchComplete,
  showSuggestions  = true,
  initialValue     = '',
  navigateOnSearch = true,
}) => {
  const [query,       setQuery]       = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [open,        setOpen]        = useState(false);
  const [focused,     setFocused]     = useState(false);
  const [activeIdx,   setActiveIdx]   = useState(-1);

  const inputRef = useRef(null);
  const navigate = useNavigate();
  const inputId  = useRef(`search-${Math.random().toString(36).slice(2)}`).current;

  // FIX 2: fetch real categories instead of using hardcoded array
  const { categories, loading: categoriesLoading } = useCategories();
  const categoryNames = categories.map((c) => c.name);

  // Update suggestions when query / focus / categories change
  useEffect(() => {
    if (focused && showSuggestions && query.length > 0) {
      const list = filterSuggestions(query, categoryNames);
      setSuggestions(list);
      // Show dropdown while loading too (will render shimmer)
      setOpen(categoriesLoading || list.length > 0);
    } else {
      setOpen(false);
    }
    setActiveIdx(-1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, focused, showSuggestions, categoriesLoading, JSON.stringify(categoryNames)]);

  const doSearch = useCallback((term) => {
    const t = term.trim();
    if (!t) return;
    onSearch?.(t);
    if (navigateOnSearch) {
      navigate(`/courses?search=${encodeURIComponent(t)}`);
    }
    setOpen(false);
    onSearchComplete?.();
  }, [navigate, navigateOnSearch, onSearch, onSearchComplete]);

  const handleChange  = (e) => setQuery(e.target.value);
  const handleSubmit  = (e) => { e.preventDefault(); doSearch(query); };
  const handleSelect  = (label) => { setQuery(label); doSearch(label); };
  const handleClear   = () => {
    setQuery('');
    setOpen(false);
    onSearch?.('');
    inputRef.current?.focus();
  };
  const handleFocus = () => setFocused(true);
  const handleBlur  = () => {
    setTimeout(() => { setFocused(false); setOpen(false); }, 150);
  };

  const handleKeyDown = (e) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIdx].label);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActiveIdx(-1);
    }
  };

  const sharedProps = {
    inputRef, value: query,
    onChange: handleChange, onFocus: handleFocus, onBlur: handleBlur,
    onSubmit: handleSubmit, onClear: handleClear, inputId,
  };

  return (
    <div className="relative" onKeyDown={handleKeyDown}>
      {variant === 'hero'
        ? <HeroInput    {...sharedProps} />
        : <DefaultInput {...sharedProps} />
      }

      <AnimatePresence>
        {open && showSuggestions && (
          <SuggestionsDropdown
            suggestions={suggestions}
            query={query}
            activeIndex={activeIdx}
            onSelect={handleSelect}
            loading={categoriesLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;