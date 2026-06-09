// src/features/instructor/components/TagSelector.jsx
import React, { useState, useEffect, useRef } from 'react';
import { HiSearch, HiX, HiPlus, HiCheck, HiTag } from 'react-icons/hi';
import { getTags } from '../../../shared/api/preLoadData.api';

export const TagSelector = ({ selectedTags = [], onTagsChange, isEditable }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState(null);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Load tags on component mount
  useEffect(() => {
    const loadTags = async () => {
      setLoading(true);
      try {
        const response = await getTags();
        console.log('[TagSelector] Loaded tags:', response);
        if (response.success && response.data) {
          setAvailableTags(response.data);
        }
      } catch (error) {
        console.error('[TagSelector] Failed to load tags:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTags();
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Filter tags based on search
  const getFilteredTags = () => {
    if (!availableTags.length) return [];
    
    return availableTags.filter(tag => {
      const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase());
      const notSelected = !selectedTags.some(selected => selected.id === tag.id);
      return matchesSearch && notSelected;
    });
  };

  const filteredTags = getFilteredTags();
  const hasSearchResults = filteredTags.length > 0;
  const noResults = searchTerm && !hasSearchResults && !loading;

  const handleAddTag = (tag) => {
    if (!selectedTags.some(t => t.id === tag.id)) {
      onTagsChange([...selectedTags, tag]);
      setRecentlyAdded(tag.id);
      setTimeout(() => setRecentlyAdded(null), 1000);
    }
    setSearchTerm('');
  };

  const handleRemoveTag = (tagId) => {
    onTagsChange(selectedTags.filter(tag => tag.id !== tagId));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    }
    if (e.key === 'Enter' && filteredTags.length === 1) {
      handleAddTag(filteredTags[0]);
    }
  };

  if (!isEditable) {
    return (
      <div className="flex flex-wrap gap-2">
        {selectedTags.length > 0 ? (
          selectedTags.map(tag => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm"
            >
              <HiTag size={12} />
              {tag.name}
            </span>
          ))
        ) : (
          <span className="text-sm text-gray-400 italic">No tags added</span>
        )}
      </div>
    );
  }

  return (
    <div className="w-full" ref={dropdownRef}>
      {/* Selected Tags - Modern Chip Design */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedTags.map(tag => (
            <div
              key={tag.id}
              className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                recentlyAdded === tag.id
                  ? 'bg-green-500 text-white scale-105'
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}
            >
              <HiTag size={14} />
              <span>{tag.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag.id)}
                className="ml-1 rounded-full p-0.5 hover:bg-purple-300 transition-colors"
                aria-label={`Remove ${tag.name}`}
              >
                <HiX size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Tag Button / Input Area */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-2.5 text-left border rounded-xl transition-all duration-200 flex items-center justify-between ${
            isOpen
              ? 'border-purple-500 ring-2 ring-purple-200 bg-white'
              : 'border-gray-300 bg-white hover:border-purple-400 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center gap-2">
            <HiPlus className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-45 text-purple-500' : ''}`} size={18} />
            <span className={isOpen ? 'text-purple-600' : 'text-gray-500'}>
              {selectedTags.length === 0 ? 'Add tags to your course' : 'Add more tags'}
            </span>
          </div>
          {selectedTags.length > 0 && (
            <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              {selectedTags.length}
            </span>
          )}
        </button>

        {/* Dropdown Panel - LinkedIn Style */}
        {isOpen && (
          <div className="absolute z-30 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Search Header */}
            <div className="p-3 border-b border-gray-100 bg-gray-50/50">
              <div className="relative">
                <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search tags..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition bg-white"
                />
              </div>
            </div>

            {/* Tags List */}
            <div className="max-h-64 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-gray-400 mt-2">Loading tags...</p>
                </div>
              ) : hasSearchResults ? (
                <div className="py-2">
                  {filteredTags.map((tag, index) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleAddTag(tag)}
                      className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition flex items-center justify-between group"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <div className="flex items-center gap-2">
                        <HiTag size={14} className="text-gray-400 group-hover:text-purple-500" />
                        <span className="text-gray-700 group-hover:text-purple-700">{tag.name}</span>
                      </div>
                      <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0 translate-x-2">
                        Click to add
                      </span>
                    </button>
                  ))}
                </div>
              ) : noResults ? (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                    <HiSearch size={20} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">No tags found</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Try a different search term
                  </p>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                    <HiTag size={20} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">All tags added</p>
                  <p className="text-xs text-gray-400 mt-1">
                    You've added all available tags
                  </p>
                </div>
              )}
            </div>

            {/* Footer with helpful tips */}
            <div className="p-3 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Press ⏎ to add first result</span>
                <span>ESC to close</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Help Text */}
      <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
        <HiTag size={10} />
        Add tags to help students discover your course
      </p>
    </div>
  );
};