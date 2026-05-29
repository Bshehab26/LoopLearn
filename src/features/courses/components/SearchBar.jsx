/**
 * SearchBar.jsx
 * Search input component with suggestions, debouncing, and flexible matching.
 * Features real-time suggestions, clear button, and keyboard navigation.
 * 
 * @module features/courses/components/SearchBar
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { HiSearch, HiX } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// Constants
// ============================================================================

const POPULAR_SUGGESTIONS = [
  'Web Development', 'Data Science', 'UI/UX Design', 'Mobile Apps',
  'AI & ML', 'Cybersecurity', 'DevOps', 'React', 'JavaScript',
  'Python', 'Machine Learning', 'Cloud Computing',
];

const MIN_SUGGESTION_CHARS = 1;
const NAVIGATION_DEBOUNCE_DELAY = 800;
const MAX_SUGGESTIONS = 8;

const SUGGESTIONS_ANIMATION = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
};

// ============================================================================
// Helper Functions
// ============================================================================

const normalizeString = (str) => {
  if (!str) return '';
  return str.toLowerCase().trim().replace(/\s+/g, ' ');
};

const filterSuggestions = (query) => {
  if (!query || query.length < MIN_SUGGESTION_CHARS) return [];
  
  const normalizedQuery = normalizeString(query);
  
  const scored = POPULAR_SUGGESTIONS.map(suggestion => {
    const normalizedSuggestion = normalizeString(suggestion);
    let score = 0;
    let matchType = '';
    
    if (normalizedSuggestion === normalizedQuery) {
      score = 100;
      matchType = 'exact';
    } else if (normalizedSuggestion.startsWith(normalizedQuery)) {
      score = 80;
      matchType = 'startsWith';
    } else if (normalizedSuggestion.includes(normalizedQuery)) {
      score = 60;
      matchType = 'contains';
    } else {
      const words = normalizedSuggestion.split(' ');
      for (const word of words) {
        if (word.startsWith(normalizedQuery)) {
          score = 40;
          matchType = 'wordStart';
          break;
        }
        if (word === normalizedQuery) {
          score = 50;
          matchType = 'wordExact';
          break;
        }
      }
    }
    
    return { suggestion, score, matchType };
  });
  
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_SUGGESTIONS)
    .map(item => ({ ...item, displayText: highlightMatch(item.suggestion, normalizedQuery) }));
};

const highlightMatch = (text, query) => {
  if (!query) return text;
  
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  
  if (lowerText === lowerQuery) {
    return <span className="font-semibold text-purple-600">{text}</span>;
  }
  
  if (lowerText.includes(lowerQuery)) {
    const index = lowerText.indexOf(lowerQuery);
    return (
      <>
        {text.slice(0, index)}
        <span className="font-semibold text-purple-600">{text.slice(index, index + query.length)}</span>
        {text.slice(index + query.length)}
      </>
    );
  }
  
  return text;
};

// ============================================================================
// Subcomponents
// ============================================================================

const SuggestionsDropdown = ({ suggestions, onSelect, onClose }) => {
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);
  
  if (suggestions.length === 0) return null;
  
  return (
    <motion.div
      ref={dropdownRef}
      {...SUGGESTIONS_ANIMATION}
      className='absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden'
    >
      <div className='py-2'>
        <div className='px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center justify-between'>
          <span>Popular Searches</span>
          <span className="text-[10px] text-gray-300">Click to search</span>
        </div>
        {suggestions.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(item.suggestion)}
            className='w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 transition flex items-center gap-3 group'
          >
            <HiSearch size={14} className='text-gray-400 group-hover:text-purple-500 flex-shrink-0' />
            <span className='group-hover:text-purple-600 truncate flex-1'>{item.displayText}</span>
            {item.matchType === 'exact' && (
              <span className='ml-auto text-xs text-purple-400 bg-purple-50 px-1.5 py-0.5 rounded-full'>Exact</span>
            )}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

const HeroSearchBar = ({ value, onChange, onSubmit, onClear, inputRef, onFocus, onBlur }) => (
  <form onSubmit={onSubmit} className='relative w-full max-w-2xl mx-auto'>
    <div className='relative'>
      <HiSearch className='absolute left-5 top-1/2 -translate-y-1/2 text-gray-400' size={20} />
      <input
        ref={inputRef}
        type='text'
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder='Search for courses... (e.g., Web Development, React, Python)'
        className='w-full pl-12 pr-24 py-4 text-base rounded-full border border-gray-200 bg-white shadow-sm focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all'
      />
      {value && (
        <button
          type='button'
          onClick={onClear}
          className='absolute right-24 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition'
          aria-label='Clear search'
        >
          <HiX size={18} />
        </button>
      )}
      <button
        type='submit'
        className='absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-full text-sm font-medium hover:shadow-md transition'
      >
        Search
      </button>
    </div>
  </form>
);

const DefaultSearchBar = ({ value, onChange, onSubmit, onClear, inputRef, onFocus, onBlur }) => (
  <form onSubmit={onSubmit} className='relative'>
    <HiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' size={16} />
    <input
      ref={inputRef}
      type='text'
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder='Search courses...'
      className='w-48 md:w-64 pl-9 pr-8 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all'
    />
    {value && (
      <button
        type='button'
        onClick={onClear}
        className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition'
        aria-label='Clear search'
      >
        <HiX size={14} />
      </button>
    )}
  </form>
);

// ============================================================================
// Main Component
// ============================================================================

const SearchBar = ({ 
  variant = 'default', 
  onSearch, 
  onSearchComplete,
  showSuggestions = true,
  initialValue = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const navigationTimeoutRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (showSuggestions && isFocused) {
      const filtered = filterSuggestions(searchQuery);
      setSuggestions(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setShowDropdown(false);
    }
  }, [searchQuery, showSuggestions, isFocused]);

  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  // ✅ FIXED: Navigate to /courses with search param
  const navigateToSearch = useCallback((query) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;
    
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
    
    navigationTimeoutRef.current = setTimeout(() => {
      if (onSearch) {
        onSearch(trimmedQuery);
      }
      
      navigate(`/courses?search=${encodeURIComponent(trimmedQuery)}`);
      
      if (onSearchComplete) {
        onSearchComplete();
      }
    }, NAVIGATION_DEBOUNCE_DELAY);
  }, [navigate, onSearch, onSearchComplete]);

  // ✅ FIXED: Navigate to /courses with search param
  const performImmediateSearch = useCallback((query = searchQuery) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;
    
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
    
    if (onSearch) {
      onSearch(trimmedQuery);
    }
    
    navigate(`/courses?search=${encodeURIComponent(trimmedQuery)}`);
    
    setSearchQuery('');
    setShowDropdown(false);
    
    if (onSearchComplete) {
      onSearchComplete();
    }
  }, [searchQuery, navigate, onSearch, onSearchComplete]);

  const handleChange = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      navigateToSearch(value);
    } else {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    }
  }, [navigateToSearch]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    performImmediateSearch();
  }, [performImmediateSearch]);

  const handleSuggestionClick = useCallback((suggestion) => {
    setSearchQuery(suggestion);
    setShowDropdown(false);
    performImmediateSearch(suggestion);
  }, [performImmediateSearch]);

  const handleClear = useCallback(() => {
    setSearchQuery('');
    setShowDropdown(false);
    inputRef.current?.focus();
    
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
  }, []);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    if (showSuggestions && searchQuery) {
      const filtered = filterSuggestions(searchQuery);
      setSuggestions(filtered);
      setShowDropdown(filtered.length > 0);
    }
  }, [showSuggestions, searchQuery]);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setIsFocused(false);
      setShowDropdown(false);
    }, 200);
  }, []);

  const commonProps = {
    value: searchQuery,
    onChange: handleChange,
    onSubmit: handleSubmit,
    onClear: handleClear,
    onFocus: handleFocus,
    onBlur: handleBlur,
    inputRef,
  };

  return (
    <div className='relative'>
      {variant === 'hero' ? <HeroSearchBar {...commonProps} /> : <DefaultSearchBar {...commonProps} />}
      
      <AnimatePresence>
        {showDropdown && showSuggestions && (
          <SuggestionsDropdown
            suggestions={suggestions}
            onSelect={handleSuggestionClick}
            onClose={() => setShowDropdown(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;