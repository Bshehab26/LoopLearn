// src/features/instructor/components/TagSelector.jsx

import React, { useState, useEffect, useRef } from 'react';
import { HiSearch, HiX, HiPlus, HiTag, HiCheck } from 'react-icons/hi';
import { getTags } from '../../../shared/api/preLoadData.api';

export const TagSelector = ({ selectedTags = [], onTagsChange, isEditable }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Load all tags on mount
  useEffect(() => {
    const loadTags = async () => {
      setLoading(true);
      try {
        const response = await getTags();
        if (response.success && response.data) {
          setAvailableTags(response.data);
        }
      } catch (error) {
        console.error('Failed to load tags:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTags();
  }, []);

  // Filter available tags (exclude selected ones)
  const getAvailableTags = () => {
    return availableTags.filter(tag => 
      !selectedTags.some(selected => selected.id === tag.id) &&
      tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const availableTagsList = getAvailableTags();

  const handleAddTag = (tag) => {
    if (!selectedTags.some(t => t.id === tag.id)) {
      onTagsChange([...selectedTags, tag]);
    }
    setSearchTerm('');
  };

  const handleRemoveTag = (tagId) => {
    onTagsChange(selectedTags.filter(tag => tag.id !== tagId));
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
      {/* Selected Tags - Display all selected tags prominently */}
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
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200"
      >
        <HiPlus size={18} />
        <span>{isOpen ? 'Close Tag Picker' : 'Add Tags'}</span>
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
          </div>

          {/* Tags Grid - All available tags visible */}
          <div className="p-3 max-h-64 overflow-y-auto">
            {loading ? (
              <div className="text-center py-6">
                <div className="inline-block w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-gray-400 mt-2">Loading tags...</p>
              </div>
            ) : availableTagsList.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableTagsList.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleAddTag(tag)}
                    className="flex items-center justify-between gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-all group border border-transparent hover:border-purple-200"
                  >
                    <span className="flex items-center gap-2">
                      <HiTag size={14} className="text-gray-400 group-hover:text-purple-500" />
                      {tag.name}
                    </span>
                    <HiPlus size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition" />
                  </button>
                ))}
              </div>
            ) : searchTerm ? (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500">No tags found matching "{searchTerm}"</p>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500">All tags added</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-400 flex justify-between">
            <span>Click a tag to add it</span>
            <span>{availableTagsList.length} tags available</span>
          </div>
        </div>
      )}
    </div>
  );
};