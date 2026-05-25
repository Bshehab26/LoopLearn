/**
 * SearchBar.jsx
 * Search input component with suggestions, debouncing, and flexible matching.
 * Features real-time suggestions, clear button, and keyboard navigation.
 * 
 * @module features/courses/components/SearchBar
 * 
 * @example
 * // Hero variant (large, for homepage)
 * <SearchBar variant="hero" onSearch={(term) => console.log(term)} />
 * 
 * // Default variant (compact, for navbar)
 * <SearchBar onSearch={(term) => console.log(term)} />
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { HiSearch, HiX } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// Constants
// ============================================================================

/** Popular search suggestions (fallback when API is not available) */
const POPULAR_SUGGESTIONS = [
  'Web Development',
  'Data Science',
  'UI/UX Design',
  'Mobile Apps',
  'AI & ML',
  'Cybersecurity',
  'DevOps',
  'React',
  'JavaScript',
  'Python',
  'Machine Learning',
  'Cloud Computing',
];

/** Minimum characters to show suggestions */
const MIN_SUGGESTION_CHARS = 1;

/** Debounce delay for search navigation (ms) - only for navigation, not for typing */
const NAVIGATION_DEBOUNCE_DELAY = 800;

/** Maximum number of suggestions to show */
const MAX_SUGGESTIONS = 8;

/** Animation variants for suggestions dropdown */
const SUGGESTIONS_ANIMATION = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Normalizes string for matching (lowercase, trim, remove extra spaces)
 * @param {string} str - Input string
 * @returns {string} Normalized string
 */
const normalizeString = (str) => {
  if (!str) return '';
  return str.toLowerCase().trim().replace(/\s+/g, ' ');
};

/**
 * Checks if a suggestion matches the search query
 * Supports partial matching, word matching, and exact matching
 * @param {string} suggestion - The suggestion text
 * @param {string} query - The search query
 * @returns {boolean} True if matches
 */
const matchesSearchQuery = (suggestion, query) => {
  if (!query) return true;
  
  const normalizedSuggestion = normalizeString(suggestion);
  const normalizedQuery = normalizeString(query);
  
  // Exact match (case-insensitive, trimmed)
  if (normalizedSuggestion === normalizedQuery) {
    return true;
  }
  
  // Starts with match (partial from beginning)
  if (normalizedSuggestion.startsWith(normalizedQuery)) {
    return true;
  }
  
  // Contains match (anywhere in the string)
  if (normalizedSuggestion.includes(normalizedQuery)) {
    return true;
  }
  
  // Word boundary match (matches individual words)
  const words = normalizedSuggestion.split(' ');
  for (const word of words) {
    if (word.startsWith(normalizedQuery) || word === normalizedQuery) {
      return true;
    }
  }
  
  return false;
};

/**
 * Filters popular searches based on query with smart matching
 * @param {string} query - Search query
 * @returns {Array} Filtered and scored suggestions
 */
const filterSuggestions = (query) => {
  if (!query || query.length < MIN_SUGGESTION_CHARS) return [];
  
  const normalizedQuery = normalizeString(query);
  
  // Score each suggestion based on match quality
  const scored = POPULAR_SUGGESTIONS.map(suggestion => {
    const normalizedSuggestion = normalizeString(suggestion);
    let score = 0;
    let matchType = '';
    
    // Exact match (highest score)
    if (normalizedSuggestion === normalizedQuery) {
      score = 100;
      matchType = 'exact';
    }
    // Starts with match (high score)
    else if (normalizedSuggestion.startsWith(normalizedQuery)) {
      score = 80;
      matchType = 'startsWith';
    }
    // Contains match (medium score)
    else if (normalizedSuggestion.includes(normalizedQuery)) {
      score = 60;
      matchType = 'contains';
    }
    // Word boundary match (lower score)
    else {
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
  
  // Filter out non-matching suggestions and sort by score
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_SUGGESTIONS)
    .map(item => ({
      ...item,
      displayText: highlightMatch(item.suggestion, normalizedQuery),
    }));
};

/**
 * Highlights the matching part of the suggestion
 * @param {string} text - Original text
 * @param {string} query - Search query
 * @returns {JSX.Element|string} Highlighted text or plain string
 */
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

/**
 * Search suggestions dropdown component with match highlighting
 */
const SuggestionsDropdown = ({ suggestions, onSelect, onClose }) => {
  const dropdownRef = useRef(null);
  
  // Close on click outside
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
            <span className='group-hover:text-purple-600 truncate flex-1'>
              {item.displayText}
            </span>
            {item.matchType === 'exact' && (
              <span className='ml-auto text-xs text-purple-400 bg-purple-50 px-1.5 py-0.5 rounded-full'>
                Exact
              </span>
            )}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

/**
 * Hero variant search bar (large, for homepage)
 */
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

/**
 * Default variant search bar (compact, for navbar)
 */
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

/**
 * SearchBar - Search input with suggestions and flexible matching
 * @param {Object} props
 * @param {string} props.variant - Visual variant ('hero' or 'default')
 * @param {Function} props.onSearch - Callback when search is performed
 * @param {Function} props.onSearchComplete - Callback when search is completed
 * @param {boolean} props.showSuggestions - Whether to show search suggestions
 * @returns {React.ReactElement} Search bar component
 */
const SearchBar = ({ 
  variant = 'default', 
  onSearch, 
  onSearchComplete,
  showSuggestions = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const navigationTimeoutRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Update suggestions based on search query with smart matching - INSTANT, no debounce
  useEffect(() => {
    if (showSuggestions && isFocused) {
      const filtered = filterSuggestions(searchQuery);
      setSuggestions(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setShowDropdown(false);
    }
  }, [searchQuery, showSuggestions, isFocused]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Handles search navigation (debounced to avoid too many navigations)
   * @param {string} query - Search query
   */
  const navigateToSearch = useCallback((query) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;
    
    // Clear any pending navigation
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
    
    // Debounce navigation to avoid rapid URL changes while typing
    navigationTimeoutRef.current = setTimeout(() => {
      // Call onSearch callback if provided
      if (onSearch) {
        onSearch(trimmedQuery);
      }
      
      // Navigate to search results page
      navigate(`/course-list/${encodeURIComponent(trimmedQuery)}`);
      
      // Call onSearchComplete callback if provided
      if (onSearchComplete) {
        onSearchComplete();
      }
    }, NAVIGATION_DEBOUNCE_DELAY);
  }, [navigate, onSearch, onSearchComplete]);

  /**
   * Handles immediate search (when user clicks search button or presses Enter)
   * @param {string} query - Search query
   */
  const performImmediateSearch = useCallback((query = searchQuery) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;
    
    // Clear any pending navigation
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
    
    // Call onSearch callback if provided
    if (onSearch) {
      onSearch(trimmedQuery);
    }
    
    // Navigate immediately
    navigate(`/course-list/${encodeURIComponent(trimmedQuery)}`);
    
    // Clear input and close dropdown
    setSearchQuery('');
    setShowDropdown(false);
    
    // Call onSearchComplete callback if provided
    if (onSearchComplete) {
      onSearchComplete();
    }
  }, [searchQuery, navigate, onSearch, onSearchComplete]);

  /**
   * Handles input change - updates query immediately for typing
   * @param {Event} e - Input change event
   */
  const handleChange = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Trigger debounced navigation as user types
    if (value.trim()) {
      navigateToSearch(value);
    } else {
      // Clear navigation if query is empty
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    }
  }, [navigateToSearch]);

  /**
   * Handles form submission (Enter key or search button)
   * @param {Event} e - Form submit event
   */
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    performImmediateSearch();
  }, [performImmediateSearch]);

  /**
   * Handles suggestion click
   * @param {string} suggestion - Selected suggestion
   */
  const handleSuggestionClick = useCallback((suggestion) => {
    setSearchQuery(suggestion);
    setShowDropdown(false);
    performImmediateSearch(suggestion);
  }, [performImmediateSearch]);

  /**
   * Clears the search input
   */
  const handleClear = useCallback(() => {
    setSearchQuery('');
    setShowDropdown(false);
    inputRef.current?.focus();
    
    // Clear pending navigation
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
  }, []);

  /**
   * Handles input focus
   */
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    if (showSuggestions && searchQuery) {
      const filtered = filterSuggestions(searchQuery);
      setSuggestions(filtered);
      setShowDropdown(filtered.length > 0);
    }
  }, [showSuggestions, searchQuery]);

  /**
   * Handles input blur
   */
  const handleBlur = useCallback(() => {
    // Delay closing to allow click on suggestions
    setTimeout(() => {
      setIsFocused(false);
      setShowDropdown(false);
    }, 200);
  }, []);

  // Common props for both variants
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
      {/* Search Input based on variant */}
      {variant === 'hero' ? (
        <HeroSearchBar {...commonProps} />
      ) : (
        <DefaultSearchBar {...commonProps} />
      )}
      
      {/* Suggestions Dropdown */}
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