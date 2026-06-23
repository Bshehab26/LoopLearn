// src/features/instructor/components/TagSelector.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSearch, HiX, HiPlus, HiTag, HiChevronLeft, HiChevronRight, HiOutlineRefresh } from 'react-icons/hi';
import { getTags } from '../../../shared/api/preLoadData.api';

const PAGE_SIZE = 20; // Fixed page size matching backend

export const TagSelector = ({ selectedTags = [], onTagsChange, isEditable }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [allTags, setAllTags] = useState([]);       // All loaded tags from all pages
  const [displayedTags, setDisplayedTags] = useState([]); // Tags for current page view
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Load tags for a specific page
  const loadTagsPage = async (pageNum) => {
    if (loading) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);

    try {
      const response = await getTags(pageNum, PAGE_SIZE);

      if (response.success && response.data) {
        const newTags = response.data;
        const total = response.pagination.totalCount || newTags.length;
        const pages = Math.ceil(total / PAGE_SIZE) || 1;

        // Store all loaded tags for local search
        setAllTags(prev => {
          const existingIds = new Set(prev.map(t => t.id));
          const uniqueNew = newTags.filter(t => !existingIds.has(t.id));
          return [...prev, ...uniqueNew];
        });

        setDisplayedTags(newTags);
        setTotalCount(total);
        setTotalPages(pages);
        setCurrentPage(pageNum);

        if (!initialLoadDone) {
          setInitialLoadDone(true);
        }
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Failed to load tags:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load tags on first open
  useEffect(() => {
    if (isOpen && !initialLoadDone) {
      loadTagsPage(1);
    }
  }, [isOpen]);

  // Local search across all loaded tags
  useEffect(() => {
    if (!searchTerm.trim()) {
      // Show current page tags when no search
      const start = (currentPage - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      setDisplayedTags(allTags.slice(start, end));
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = allTags.filter(tag => 
      tag.name.toLowerCase().includes(term)
    );
    setDisplayedTags(filtered);
  }, [searchTerm, allTags, currentPage]);

  // Pagination handlers
  const goToPage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;

    // Check if we need to load this page from API
    const requiredTagsCount = page * PAGE_SIZE;
    if (allTags.length < requiredTagsCount && page > currentPage) {
      loadTagsPage(page);
    } else {
      // We have enough tags loaded locally
      setCurrentPage(page);
      const start = (page - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      setDisplayedTags(allTags.slice(start, end));
    }
  };

  const goToPrevious = () => goToPage(currentPage - 1);
  const goToNext = () => goToPage(currentPage + 1);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Filter available tags (exclude already selected)
  const availableTags = displayedTags.filter(tag => 
    !selectedTags.some(selected => selected?.id === tag.id)
  );

  const handleAddTag = (tag) => {
    if (!selectedTags.some(t => t?.id === tag.id)) {
      const newSelectedTags = [...selectedTags, tag];
      onTagsChange(newSelectedTags);
    }
  };

  const handleRemoveTag = (tagId) => {
    const newSelectedTags = selectedTags.filter(tag => tag.id !== tagId);
    onTagsChange(newSelectedTags);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Display only mode (non-editable)
  if (!isEditable) {
    return (
      <div className="flex flex-wrap gap-2">
        {selectedTags.length > 0 ? (
          selectedTags.map(tag => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm"
            >
              <HiTag size={12} />
              {tag.name}
            </span>
          ))
        ) : (
          <span className="text-sm text-gray-400">No tags added</span>
        )}
      </div>
    );
  }

  return (
    <div className="w-full" ref={dropdownRef}>
      {/* Selected Tags Display */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Selected Tags ({selectedTags.length})
        </label>
        <div className="flex flex-wrap gap-2 min-h-[42px] p-2 bg-gray-50 rounded-lg border border-gray-200">
          {selectedTags.length > 0 ? (
            selectedTags.map(tag => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium"
              >
                <HiTag size={14} />
                {tag.name}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag.id)}
                  className="ml-1 rounded-full p-0.5 hover:bg-purple-200 transition-colors"
                  aria-label={`Remove tag ${tag.name}`}
                >
                  <HiX size={14} />
                </button>
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-400 py-1">No tags selected yet</span>
          )}
        </div>
      </div>

      {/* Add Tag Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200"
      >
        <HiPlus size={18} />
        <span>{isOpen ? 'Close Tag Picker' : 'Add Tags'}</span>
        {totalCount > 0 && !isOpen && (
          <span className="text-xs text-gray-400 ml-1">({totalCount} available)</span>
        )}
      </button>

      {/* Tag Picker Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="mt-3 border border-gray-200 rounded-xl bg-white shadow-xl overflow-hidden"
          >
            {/* Search Header */}
            <div className="p-3 border-b border-gray-100 bg-gray-50">
              <div className="relative">
                <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tags..."
                  className="w-full pl-9 pr-9 py-2 border border-gray-200 rounded-lg text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition bg-white"
                  autoFocus
                />
                {searchTerm && (
                  <button
                    onClick={() => { setSearchTerm(''); searchInputRef.current?.focus(); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                  >
                    <HiX size={14} />
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-xs text-gray-400">
                  {loading ? 'Loading...' : `${availableTags.length} shown`}
                </p>
                <p className="text-xs text-gray-400">
                  {selectedTags.length} selected
                </p>
              </div>
            </div>

            {/* Tags Grid */}
            <div className="p-3 max-h-64 overflow-y-auto">
              {loading && allTags.length === 0 ? (
                <div className="text-center py-8">
                  <HiOutlineRefresh className="w-6 h-6 animate-spin text-purple-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">Loading tags...</p>
                </div>
              ) : availableTags.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleAddTag(tag)}
                      className="flex items-center justify-between gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-all group border border-transparent hover:border-purple-200"
                    >
                      <span className="flex items-center gap-2 truncate">
                        <HiTag size={14} className="text-gray-400 group-hover:text-purple-500 flex-shrink-0" />
                        <span className="truncate">{tag.name}</span>
                      </span>
                      <HiPlus size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition flex-shrink-0" />
                    </button>
                  ))}
                </div>
              ) : searchTerm ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">No tags found matching "{searchTerm}"</p>
                  <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">No tags available</p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {!searchTerm.trim() && totalPages > 1 && (
              <div className="p-3 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={goToPrevious}
                    disabled={currentPage === 1 || loading}
                    className="p-2 rounded-lg text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    title="Previous page"
                  >
                    <HiChevronLeft size={18} />
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        disabled={loading}
                        className={`
                          min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition
                          ${page === currentPage
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-200'
                          }
                          disabled:opacity-50
                        `}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={goToNext}
                    disabled={currentPage === totalPages || loading}
                    className="p-2 rounded-lg text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    title="Next page"
                  >
                    <HiChevronRight size={18} />
                  </button>
                </div>

                {/* Page Info */}
                <p className="text-center text-xs text-gray-400 mt-2">
                  Page {currentPage} of {totalPages} • {totalCount} total tags
                </p>
              </div>
            )}

            {/* Search Results Info */}
            {searchTerm.trim() && (
              <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
                <p className="text-xs text-gray-400">
                  {availableTags.length} results from {allTags.length} loaded tags
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TagSelector;