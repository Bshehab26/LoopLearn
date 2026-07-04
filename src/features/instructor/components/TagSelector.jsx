// src/features/instructor/components/TagSelector.jsx
//
// Loading strategy: fetch the first chunk of tags immediately so the
// picker is usable right away (no multi-second blocking spinner), then
// fetch any remaining chunks in PARALLEL in the background and merge
// them in as they land. Search/pagination run client-side over whatever
// has loaded so far, so results just get more complete as background
// chunks arrive — nothing is blocked waiting for the full catalog.
//
// (Earlier version of this file waited for getAllTags() — every page,
// fetched sequentially — before rendering anything. Correct, but slow to
// open on any catalog bigger than one chunk. Before that, it cached
// server pages one at a time keyed by page number, which broke whenever
// a page was skipped. This version keeps the "load once, filter/paginate
// in memory" approach — it just streams that load in instead of blocking
// on it.)

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSearch, HiX, HiPlus, HiTag, HiOutlineRefresh, HiOutlineExclamationCircle } from 'react-icons/hi';
import { getTags } from '../../../shared/api/preLoadData.api';
import usePagination from '../../../shared/hooks/usePagination';
import Pagination from '../../../shared/components/Pagination';

const PAGE_SIZE = 20;          // tags shown per UI page
const FETCH_CHUNK_SIZE = 100;  // tags requested per network call
const MAX_FETCH_CHUNKS = 50;   // safety cap (5,000 tags)

export const TagSelector = ({ selectedTags = [], onTagsChange, isEditable }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(false);             // blocks first paint only
  const [backgroundLoading, setBackgroundLoading] = useState(false); // never blocks interaction
  const [loadError, setLoadError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [totalKnownCount, setTotalKnownCount] = useState(null);

  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const abortRef = useRef(null);

  const loadTags = useCallback(async () => {
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setLoadError(null);

    try {
      // First chunk lands → UI unblocks immediately, even on a big catalog.
      const first = await getTags(1, FETCH_CHUNK_SIZE, controller.signal);
      if (!first.success) {
        setLoadError(first.message || 'Failed to load tags.');
        setLoading(false);
        return;
      }

      setAllTags(first.data);
      setTotalKnownCount(first.pagination.totalCount);
      setLoaded(true);
      setLoading(false);

      const { totalCount, pageSize } = first.pagination;
      const totalChunks = Math.min(Math.ceil(totalCount / pageSize) || 1, MAX_FETCH_CHUNKS);

      if (totalChunks > 1) {
        // Remaining chunks fetched IN PARALLEL, not one-at-a-time — the
        // wait is ~one round trip regardless of how many chunks there are,
        // and the picker is already fully usable while this runs.
        setBackgroundLoading(true);
        const remainingChunkNumbers = Array.from({ length: totalChunks - 1 }, (_, i) => i + 2);
        const results = await Promise.all(
          remainingChunkNumbers.map((chunk) => getTags(chunk, pageSize, controller.signal))
        );
        const more = results.filter((r) => r.success).flatMap((r) => r.data);
        setAllTags((prev) => {
          const seen = new Set(prev.map((t) => t.id));
          return [...prev, ...more.filter((t) => !seen.has(t.id))];
        });
        setBackgroundLoading(false);
      }
    } catch (err) {
      if (err.name !== 'AbortError' && !controller.signal.aborted) {
        setLoadError('Failed to load tags.');
      }
      setLoading(false);
      setBackgroundLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && !loaded && !loading) {
      loadTags();
    }
  }, [isOpen, loaded, loading, loadTags]);

  // Cancel any in-flight requests if the component unmounts.
  useEffect(() => () => abortRef.current?.abort(), []);

  const handleRetry = () => {
    setAllTags([]);
    setTotalKnownCount(null);
    setLoaded(false); // triggers the load effect again
  };

  // Tags not already selected, filtered by search — recomputed over
  // whatever's loaded so far, so it just gets more complete over time.
  const filteredTags = useMemo(() => {
    const selectedIds = new Set(selectedTags.map((t) => t?.id));
    const term = searchTerm.trim().toLowerCase();
    return allTags.filter(
      (tag) =>
        !selectedIds.has(tag.id) &&
        (!term || tag.name.toLowerCase().includes(term))
    );
  }, [allTags, selectedTags, searchTerm]);

  // Client-side pagination over the filtered set — resets to page 1
  // whenever the filtered list actually changes (search, selection, or
  // a background chunk landing), via the shared hook's fingerprint check.
  const {
    currentItems: pageTags,
    currentPage,
    totalPages,
    goToPage,
  } = usePagination({ items: filteredTags, itemsPerPage: PAGE_SIZE, scrollToTop: false });

  const handleAddTag = (tag) => {
    if (!selectedTags.some((t) => t?.id === tag.id)) {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tagId) => {
    onTagsChange(selectedTags.filter((tag) => tag.id !== tagId));
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

  // Display only mode (non-editable)
  if (!isEditable) {
    return (
      <div className="flex flex-wrap gap-2">
        {selectedTags.length > 0 ? (
          selectedTags.map((tag) => (
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
            selectedTags.map((tag) => (
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
        {loaded && totalKnownCount > 0 && !isOpen && (
          <span className="text-xs text-gray-400 ml-1">({totalKnownCount} available)</span>
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
                  disabled={loading || !!loadError}
                  className="w-full pl-9 pr-9 py-2 border border-gray-200 rounded-lg text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              {!loading && !loadError && (
                <div className="flex items-center justify-between mt-1.5">
                  <p className="text-xs text-gray-400 flex items-center gap-1.5">
                    {filteredTags.length} shown
                    {backgroundLoading && (
                      <span className="inline-flex items-center gap-1 text-gray-400">
                        <HiOutlineRefresh className="w-3 h-3 animate-spin" />
                        loading more…
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400">{selectedTags.length} selected</p>
                </div>
              )}
            </div>

            {/* Tags Grid */}
            <div className="p-3 max-h-64 overflow-y-auto">
              {loading ? (
                <div className="text-center py-8">
                  <HiOutlineRefresh className="w-6 h-6 animate-spin text-purple-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">Loading tags...</p>
                </div>
              ) : loadError ? (
                <div className="text-center py-8">
                  <HiOutlineExclamationCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">{loadError}</p>
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="mt-2 text-xs font-medium text-purple-600 hover:text-purple-700"
                  >
                    Try again
                  </button>
                </div>
              ) : pageTags.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {pageTags.map((tag) => (
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
                  <p className="text-xs text-gray-400 mt-1">
                    {backgroundLoading ? 'Still loading more tags to search…' : 'Try a different search term'}
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">No tags available</p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {!loading && !loadError && totalPages > 1 && (
              <div className="p-3 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                  />
                </div>
                <p className="text-center text-xs text-gray-400 mt-2">
                  Page {currentPage} of {totalPages} • {filteredTags.length} tag{filteredTags.length !== 1 ? 's' : ''}
                  {searchTerm ? ' matching search' : ' available'}
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