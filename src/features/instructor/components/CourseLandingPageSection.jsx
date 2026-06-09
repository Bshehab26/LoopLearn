// src/features/instructor/components/CourseLandingPageSection.jsx (UPDATED)
import React, { useState, useEffect } from 'react';
import { HiChevronDown, HiChevronUp, HiPencil, HiCheck } from 'react-icons/hi';
import { ThumbnailUploader } from './ThumbnailUploader';
import { TagSelector } from './TagSelector';
import { getTags } from '../../../shared/api/preLoadData.api';

// src/features/instructor/components/CourseLandingPageSection.jsx - Fix subtitle editing

const CourseLandingPageSection = ({ data, onUpdate, isEditable, isExpanded, onToggle }) => {
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [availableTags, setAvailableTags] = useState([]);
  const [tagsLoading, setTagsLoading] = useState(false);

  // Load tags
  useEffect(() => {
    const loadTags = async () => {
      setTagsLoading(true);
      try {
        const response = await getTags();
        if (response.success && response.data) {
          setAvailableTags(response.data);
        }
      } catch (error) {
        console.error('Failed to load tags:', error);
      } finally {
        setTagsLoading(false);
      }
    };
    loadTags();
  }, []);

  const handleFieldEdit = (field, value) => {
    console.log(`[Edit] Editing ${field}:`, value);
    setEditingField(field);
    setEditValue(value || '');
  };

  const handleFieldSave = (field) => {
    console.log(`[Save] Saving ${field}:`, editValue);
    onUpdate({ [field]: editValue });
    setEditingField(null);
  };

  const handleTagsChange = (newTags) => {
    const tagIds = newTags.map(t => t.id);
    console.log('[Tags] Updating tags:', { newTags, tagIds });
    onUpdate({ tagIds });
  };

  const getSelectedTagObjects = () => {
    if (!data.tagIds || !availableTags.length) return [];
    return availableTags.filter(tag => data.tagIds.includes(tag.id));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <span className="text-purple-600 font-semibold">2</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Course Landing Page</h2>
          <span className="text-xs text-gray-400">Thumbnail, Title, Tags & Description</span>
        </div>
        {isExpanded ? <HiChevronUp size={20} /> : <HiChevronDown size={20} />}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-5 border-t border-gray-100 space-y-6">
          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Thumbnail <span className="text-red-500">*</span>
            </label>
            <ThumbnailUploader
              thumbnailUrl={data.thumbnailUrl}
              onThumbnailChange={(url) => onUpdate({ thumbnailUrl: url })}
              isEditable={isEditable}
            />
          </div>

          {/* Subtitle - FIXED */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Subtitle
            </label>
            {isEditable && editingField === 'subtitle' ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                  autoFocus
                  placeholder="e.g., Master modern web development from scratch..."
                />
                <button
                  onClick={() => handleFieldSave('subtitle')}
                  className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <HiCheck size={18} />
                </button>
                <button
                  onClick={() => setEditingField(null)}
                  className="px-3 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-600 flex-1">
                  {data.subtitle || <span className="text-gray-400 italic">No subtitle added yet</span>}
                </p>
                {isEditable && (
                  <button
                    onClick={() => handleFieldEdit('subtitle', data.subtitle)}
                    className="text-gray-400 hover:text-purple-600 transition"
                  >
                    <HiPencil size={16} />
                  </button>
                )}
              </div>
            )}
            <p className="text-xs text-gray-400 mt-1">
              A good subtitle helps students understand what makes your course unique
            </p>
          </div>

          {/* Tags Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Tags
            </label>
            <TagSelector
              selectedTags={getSelectedTagObjects()}
              onTagsChange={handleTagsChange}
              isEditable={isEditable}
              availableTags={availableTags}
              loading={tagsLoading}
            />
            <p className="text-xs text-gray-400 mt-1">
              Add relevant tags to help students discover your course
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Description <span className="text-red-500">*</span>
            </label>
            {isEditable && editingField === 'description' ? (
              <div className="space-y-2">
                <textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                  placeholder="Describe what students will learn in this course..."
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingField(null)}
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleFieldSave('description')}
                    className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative group">
                <div className="prose max-w-none p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {data.description || <span className="text-gray-400 italic">No description added yet</span>}
                  </p>
                </div>
                {isEditable && (
                  <button
                    onClick={() => handleFieldEdit('description', data.description)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-purple-600 opacity-0 group-hover:opacity-100 transition"
                  >
                    <HiPencil size={16} />
                  </button>
                )}
              </div>
            )}
            {data.description && data.description.length < 50 && (
              <p className="text-xs text-orange-500 mt-1">
                ⚠️ Description is too short (minimum 50 characters recommended)
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseLandingPageSection;