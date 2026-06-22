// src/features/instructor/components/CourseLandingPageSection.jsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronDown, HiChevronUp, HiPencil, HiPhotograph, HiTag, HiDocumentText, HiExclamationCircle, HiRefresh } from 'react-icons/hi';
import { ThumbnailUploader } from './ThumbnailUploader';
import { TagSelector } from './TagSelector';
import { getAllTags } from '../../../shared/api/preLoadData.api';

const CourseLandingPageSection = ({ data, onUpdate, isEditable, isExpanded, onToggle }) => {
  const [editMode, setEditMode] = useState({
    subtitle: false,
    description: false
  });
  const [editValue, setEditValue] = useState({
    subtitle: '',
    description: ''
  });
  
  const [selectedTagObjects, setSelectedTagObjects] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [tagsLoaded, setTagsLoaded] = useState(false);
  const [refreshingTags, setRefreshingTags] = useState(false);
  
  // Use ref to track if we're updating from a save
  const isSavingRef = useRef(false);

  // Load all tags
  const loadAllTags = useCallback(async () => {
    setRefreshingTags(true);
    try {
      console.log('[CourseLandingPageSection] Loading all tags...');
      const response = await getAllTags();
      console.log('[CourseLandingPageSection] Loaded tags:', response.data?.length || 0);
      
      if (response.success && response.data) {
        setAvailableTags(response.data);
        setTagsLoaded(true);
        
        // Update selected tags based on loaded data
        const tagIds = data.tagIds || [];
        console.log('[CourseLandingPageSection] Current tagIds from data:', tagIds);
        
        if (tagIds.length > 0) {
          // First try to find tags in the loaded available tags
          let selected = response.data.filter(tag => tagIds.includes(tag.id));
          console.log('[CourseLandingPageSection] Found selected tags from available:', selected.length);
          
          if (selected.length === tagIds.length) {
            // All tags found
            setSelectedTagObjects(selected);
          } else if (selected.length > 0) {
            // Some tags found - use what we have
            setSelectedTagObjects(selected);
          } else if (data.tags && Array.isArray(data.tags) && data.tags.length > 0) {
            // No tags found in available, but tags exist in course data
            console.log('[CourseLandingPageSection] Using tags from course data:', data.tags);
            setSelectedTagObjects(data.tags);
          } else {
            // No tags found - keep empty
            console.warn('[CourseLandingPageSection] No tags found for IDs:', tagIds);
            setSelectedTagObjects([]);
          }
        } else {
          setSelectedTagObjects([]);
        }
        return response.data;
      }
    } catch (error) {
      console.error('Failed to load tags:', error);
    } finally {
      setRefreshingTags(false);
    }
  }, [data.tagIds, data.tags]);

  // Load tags on mount
  useEffect(() => {
    loadAllTags();
  }, []); // Run only once on mount

  // Update selected tags when tagIds or tags change (after save)
  useEffect(() => {
    if (!tagsLoaded || !availableTags.length) return;
    
    const tagIds = data.tagIds || [];
    console.log('[CourseLandingPageSection] Updating selected tags - tagIds:', tagIds);
    console.log('[CourseLandingPageSection] Available tags count:', availableTags.length);
    
    if (tagIds.length > 0) {
      // Try to find tags in available list
      let selected = availableTags.filter(tag => tagIds.includes(tag.id));
      console.log('[CourseLandingPageSection] Found selected tags from available:', selected.length);
      
      if (selected.length > 0) {
        setSelectedTagObjects(selected);
      } else if (data.tags && Array.isArray(data.tags) && data.tags.length > 0) {
        // Fallback to data.tags
        console.log('[CourseLandingPageSection] Using fallback tags from data.tags:', data.tags);
        setSelectedTagObjects(data.tags);
      } else {
        setSelectedTagObjects([]);
      }
    } else {
      setSelectedTagObjects([]);
    }
  }, [data.tagIds, data.tags, availableTags, tagsLoaded]);

  // Reset edit mode when data changes from parent (e.g. after a save/refresh),
  // WITHOUT clobbering the user's in-progress keystrokes.
  // We only want to react to `data.subtitle` / `data.description` actually
  // changing (an external update), never to `editValue` changing (the user typing).
  const prevDataRef = useRef({ subtitle: data.subtitle, description: data.description });

  useEffect(() => {
    const prev = prevDataRef.current;

    if (editMode.subtitle && data.subtitle !== prev.subtitle) {
      setEditValue(curr => ({ ...curr, subtitle: data.subtitle || '' }));
    }
    if (editMode.description && data.description !== prev.description) {
      setEditValue(curr => ({ ...curr, description: data.description || '' }));
    }

    prevDataRef.current = { subtitle: data.subtitle, description: data.description };
    // Intentionally NOT depending on editValue.* — that's what caused every
    // keystroke to be immediately reverted back to the saved value.
  }, [data.subtitle, data.description, editMode.subtitle, editMode.description]);

  const startEdit = (field, value) => {
    setEditMode({ ...editMode, [field]: true });
    setEditValue({ ...editValue, [field]: value || '' });
  };

  const cancelEdit = (field) => {
    setEditMode({ ...editMode, [field]: false });
  };

  const saveEdit = (field) => {
    if (editValue[field] !== data[field]) {
      onUpdate({ [field]: editValue[field] });
    }
    setEditMode({ ...editMode, [field]: false });
  };

  const handleTagsChange = useCallback((newTags) => {
    console.log('[CourseLandingPageSection] Tags changed:', newTags);
    setSelectedTagObjects(newTags);
    const tagIds = newTags.map(t => t.id);
    console.log('[CourseLandingPageSection] Tag IDs:', tagIds);
    onUpdate({ tagIds, tags: newTags });
  }, [onUpdate]);

  // Manual refresh tags
  const handleRefreshTags = useCallback(async () => {
    await loadAllTags();
  }, [loadAllTags]);

  const descriptionLength = data.description?.length || 0;
  const isDescriptionValid = descriptionLength >= 50;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
        type="button"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
            <HiDocumentText size={18} className="text-purple-600" />
          </div>
          <div className="text-left">
            <h2 className="text-lg font-semibold text-gray-800">Course Landing Page</h2>
            <p className="text-xs text-gray-500">Thumbnail, tags, subtitle & description</p>
          </div>
        </div>
        {isExpanded ? <HiChevronUp size={20} className="text-gray-400" /> : <HiChevronDown size={20} className="text-gray-400" />}
      </button>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100"
          >
            <div className="p-6 space-y-6">
              {/* Thumbnail Upload Section */}
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <HiPhotograph size={18} className="text-purple-600" />
                  <h3 className="font-medium text-gray-800">Course Thumbnail</h3>
                  <span className="text-xs text-red-500">*Required</span>
                </div>
                <ThumbnailUploader
                  thumbnailUrl={data.thumbnailUrl}
                  onThumbnailChange={(url) => onUpdate({ thumbnailUrl: url })}
                  isEditable={isEditable}
                />
                <p className="text-xs text-gray-400 mt-3">
                  Recommended: 1280x720px (16:9 ratio). Max 5MB. JPG, PNG, or WEBP.
                </p>
              </div>

              {/* Tags Section */}
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <HiTag size={18} className="text-purple-600" />
                    <h3 className="font-medium text-gray-800">Course Tags</h3>
                    <span className="text-xs text-gray-400">Optional</span>
                  </div>
                  {isEditable && (
                    <button
                      onClick={handleRefreshTags}
                      disabled={refreshingTags}
                      className="flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-2.5 py-1 rounded-lg transition disabled:opacity-50"
                      type="button"
                    >
                      <HiRefresh size={14} className={`${refreshingTags ? 'animate-spin' : ''}`} />
                      {refreshingTags ? 'Refreshing...' : 'Refresh Tags'}
                    </button>
                  )}
                </div>
                {tagsLoaded ? (
                  <TagSelector
                    selectedTags={selectedTagObjects}
                    onTagsChange={handleTagsChange}
                    isEditable={isEditable}
                  />
                ) : (
                  <div className="flex items-center justify-center py-4">
                    <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                    <span className="ml-2 text-sm text-gray-400">Loading tags...</span>
                  </div>
                )}
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-gray-400">
                    Add relevant tags to help students discover your course
                  </p>
                  {availableTags.length > 0 && (
                    <p className="text-xs text-gray-400">
                      {availableTags.length} tags available
                    </p>
                  )}
                </div>
                {selectedTagObjects.length > 0 && (
                  <div className="mt-2 p-2 bg-purple-50 rounded-lg border border-purple-100">
                    <p className="text-xs text-purple-600">
                      {selectedTagObjects.length} tag(s) selected
                    </p>
                  </div>
                )}
              </div>

              {/* Subtitle Section */}
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-800">Course Subtitle</h3>
                    <span className="text-xs text-gray-400">Optional</span>
                  </div>
                  {isEditable && !editMode.subtitle && (
                    <button
                      onClick={() => startEdit('subtitle', data.subtitle)}
                      className="text-gray-400 hover:text-purple-600 transition"
                      type="button"
                    >
                      <HiPencil size={16} />
                    </button>
                  )}
                </div>

                {editMode.subtitle ? (
                  <div className="space-y-3">
                    <textarea
                      value={editValue.subtitle}
                      onChange={(e) => setEditValue({ ...editValue, subtitle: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none"
                      placeholder="e.g., Master modern web development from scratch with React, Node.js, and MongoDB"
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => cancelEdit('subtitle')}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        type="button"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveEdit('subtitle')}
                        className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                        type="button"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-white rounded-lg border border-gray-200 min-h-[80px] break-words">
                    {data.subtitle ? (
                      <p className="text-gray-700 break-words whitespace-pre-wrap">{data.subtitle}</p>
                    ) : (
                      <p className="text-gray-400 italic">No subtitle added yet. Add a compelling subtitle to attract students.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Description Section */}
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-800">Course Description</h3>
                    <span className="text-xs text-red-500">*Required</span>
                    {descriptionLength > 0 && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${isDescriptionValid ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {descriptionLength}/50 chars
                      </span>
                    )}
                  </div>
                  {isEditable && !editMode.description && (
                    <button
                      onClick={() => startEdit('description', data.description)}
                      className="text-gray-400 hover:text-purple-600 transition"
                      type="button"
                    >
                      <HiPencil size={16} />
                    </button>
                  )}
                </div>

                {editMode.description ? (
                  <div className="space-y-3">
                    <textarea
                      value={editValue.description}
                      onChange={(e) => setEditValue({ ...editValue, description: e.target.value })}
                      rows={8}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-y"
                      placeholder="Write a detailed description of your course...

Example structure:
• What will students learn?
• What are the requirements?
• Who is this course for?
• What makes your course unique?"
                      autoFocus
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-500">
                          {editValue.description.length} characters
                        </p>
                        {editValue.description.length < 50 && editValue.description.length > 0 && (
                          <span className="text-xs text-orange-500 flex items-center gap-1">
                            <HiExclamationCircle size={12} />
                            Need {50 - editValue.description.length} more characters
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => cancelEdit('description')}
                          className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
                          type="button"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => saveEdit('description')}
                          className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                          type="button"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-white rounded-lg border border-gray-200 max-h-[300px] overflow-y-auto break-words">
                    {data.description ? (
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-700 whitespace-pre-wrap break-words">{data.description}</p>
                      </div>
                    ) : (
                      <p className="text-gray-400 italic">No description added yet. Add a detailed description to help students understand your course.</p>
                    )}
                  </div>
                )}

                {/* Validation warning */}
                {data.description && data.description.length < 50 && (
                  <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-xs text-orange-700 flex items-center gap-2">
                      <HiExclamationCircle size={14} />
                      Description must be at least 50 characters. Currently {data.description.length} characters.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseLandingPageSection;