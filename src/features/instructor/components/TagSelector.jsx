// src/features/instructor/components/TagSelector.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HiSearch, HiX, HiPlus, HiTag, HiChevronDown } from 'react-icons/hi';
import { getTags } from '../../../shared/api/preLoadData.api';

export const TagSelector = ({ selectedTags = [], onTagsChange, isEditable }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [displayedTags, setDisplayedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [totalTags, setTotalTags] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const loadMoreRef = useRef(null);
  const observerRef = useRef(null);

  const PAGE_SIZE = 20; // Load 20 at a time for better UX

  // Load tags on mount
  useEffect(() => {
    if (isOpen && !initialLoadDone) {
      loadTags(1, true);
      setInitialLoadDone(true);
    }
  }, [isOpen]);

  // Load tags when search changes
  useEffect(() => {
    if (!isOpen) return;
    
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim() === '') {
        // No search - show paginated tags
        setIsSearching(false);
        setSearchResults([]);
        if (!initialLoadDone) {
          loadTags(1, true);
          setInitialLoadDone(true);
        } else {
          // Reset to first page when clearing search
          setDisplayedTags(allTags.slice(0, PAGE_SIZE));
          setHasMore(allTags.length < totalTags);
          setPage(1);
        }
      } else {
        // Search mode
        handleSearch(searchTerm);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, isOpen]);

  // Load tags with pagination
  const loadTags = async (pageNum, reset = false) => {
    if (loading || loadingMore) return;
    
    const isFirstPage = pageNum === 1;
    if (isFirstPage) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await getTags(pageNum, PAGE_SIZE);
      console.log('[TagSelector] Loaded tags page:', pageNum, response);
      
      if (response.success && response.data) {
        const newTags = response.data;
        const totalCount = response.total || 0;
        
        if (reset || isFirstPage) {
          setAllTags(newTags);
          setDisplayedTags(newTags);
        } else {
          setAllTags(prev => {
            const updated = [...prev, ...newTags];
            return updated;
          });
          setDisplayedTags(prev => {
            const updated = [...prev, ...newTags];
            return updated;
          });
        }
        
        setTotalTags(totalCount);
        const currentTotal = reset ? newTags.length : allTags.length + newTags.length;
        setHasMore(currentTotal < totalCount);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Failed to load tags:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Handle search
  const handleSearch = async (term) => {
    if (!term.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setLoading(true);

    try {
      // Search in already loaded tags first
      const filtered = allTags.filter(tag => 
        tag.name.toLowerCase().includes(term.toLowerCase())
      );
      
      // If we have all tags loaded, use client-side search
      if (allTags.length >= totalTags) {
        setSearchResults(filtered);
        setLoading(false);
        return;
      }

      // Load all tags and search
      const allTagsResponse = await getTags(1, 100, true);
      if (allTagsResponse.success) {
        const allLoadedTags = allTagsResponse.data;
        const searchFiltered = allLoadedTags.filter(tag =>
          tag.name.toLowerCase().includes(term.toLowerCase())
        );
        setAllTags(allLoadedTags);
        setDisplayedTags(allLoadedTags);
        setTotalTags(allLoadedTags.length);
        setHasMore(false);
        setSearchResults(searchFiltered);
      }
    } catch (error) {
      console.error('Search tags error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load more tags (infinite scroll)
  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore || loading || isSearching) return;
    if (searchTerm.trim() !== '') return; // Don't paginate during search
    
    loadTags(page + 1, false);
  }, [hasMore, loadingMore, loading, page, searchTerm, isSearching]);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (!isOpen || isSearching || searchTerm.trim() !== '') {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      return;
    }

    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && hasMore) {
        loadMore();
      }
    }, options);

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isOpen, loadMore, hasMore, isSearching, searchTerm]);

  // Filter available tags (exclude selected ones)
  const getAvailableTags = () => {
    let source = [];
    
    if (isSearching || searchTerm.trim() !== '') {
      source = searchResults;
    } else {
      source = displayedTags;
    }
    
    return source.filter(tag => 
      !selectedTags.some(selected => selected?.id === tag.id)
    );
  };

  const availableTagsList = getAvailableTags();

  const handleAddTag = (tag) => {
    console.log('[TagSelector] Adding tag:', tag);
    
    if (!selectedTags.some(t => t?.id === tag.id)) {
      const newSelectedTags = [...selectedTags, tag];
      console.log('[TagSelector] New selectedTags:', newSelectedTags);
      onTagsChange(newSelectedTags);
    }
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleRemoveTag = (tagId) => {
    console.log('[TagSelector] Removing tag id:', tagId);
    const newSelectedTags = selectedTags.filter(tag => tag.id !== tagId);
    console.log('[TagSelector] New selectedTags after remove:', newSelectedTags);
    onTagsChange(newSelectedTags);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
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
            <span className="text-sm text-gray-400">No tags selected yet</span>
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
        {totalTags > 0 && !isOpen && (
          <span className="text-xs text-gray-400 ml-1">({totalTags} available)</span>
        )}
      </button>

      {/* Tag Picker Popup */}
      {isOpen && (
        <div className="mt-3 border border-gray-200 rounded-xl bg-white shadow-lg overflow-hidden">
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
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition bg-white"
                autoFocus
              />
            </div>
            {searchTerm.trim() !== '' && (
              <p className="text-xs text-gray-400 mt-1.5">
                {loading ? 'Searching...' : `Found ${availableTagsList.length} matching tags`}
              </p>
            )}
          </div>

          {/* Tags Grid */}
          <div className="p-3 max-h-72 overflow-y-auto" style={{ maxHeight: '320px' }}>
            {loading && !loadingMore ? (
              <div className="text-center py-6">
                <div className="inline-block w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-gray-400 mt-2">Loading tags...</p>
              </div>
            ) : availableTagsList.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableTagsList.map((tag) => (
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
                
                {/* Load More Trigger */}
                {hasMore && searchTerm.trim() === '' && !isSearching && (
                  <div ref={loadMoreRef} className="py-4 text-center">
                    {loadingMore ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs text-gray-400">Loading more tags...</span>
                      </div>
                    ) : (
                      <button
                        onClick={loadMore}
                        className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1 mx-auto"
                      >
                        <HiChevronDown size={14} />
                        Load more tags
                      </button>
                    )}
                  </div>
                )}
                
                {/* All loaded indicator */}
                {!hasMore && searchTerm.trim() === '' && !isSearching && allTags.length > 0 && (
                  <div className="py-3 text-center">
                    <p className="text-xs text-gray-400">All {allTags.length} tags loaded</p>
                  </div>
                )}
              </>
            ) : searchTerm ? (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500">No tags found matching "{searchTerm}"</p>
                <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500">No tags available</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-400 flex justify-between">
            <span>{selectedTags.length} selected • {totalTags} total tags</span>
            <span>
              {searchTerm.trim() === '' 
                ? `Showing ${displayedTags.length} of ${totalTags}`
                : `${availableTagsList.length} matching`
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
};