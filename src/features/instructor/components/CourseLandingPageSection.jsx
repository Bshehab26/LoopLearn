// src/features/instructor/components/CourseLandingPageSection.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { HiPhotograph, HiPencil, HiGlobe, HiTag } from 'react-icons/hi';
import ThumbnailUploader from './ThumbnailUploader';
import { TagSelector } from './TagSelector';

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'Arabic' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
];

const LEVELS = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
  { value: 'All Levels', label: 'All Levels' },
];

const CourseLandingPageSection = ({ data, onUpdate, isEditable }) => {
  const handleThumbnailChange = (url) => {
    onUpdate({ thumbnailUrl: url });
  };

  const handleTagsChange = (tags) => {
    console.log('[CourseLandingPageSection] Tags changed:', tags);
    const tagIds = tags.map(t => t.id).filter(Boolean);
    onUpdate({ tags, tagIds });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <HiPhotograph size={20} className="text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Course Landing Page</h3>
            <p className="text-xs text-gray-500">Thumbnail, description, language, level & tags</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Thumbnail
            </label>
            <ThumbnailUploader
              thumbnailUrl={data?.thumbnailUrl}
              onThumbnailChange={handleThumbnailChange}
              isEditable={isEditable}
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              value={data?.subtitle || ''}
              onChange={(e) => onUpdate({ subtitle: e.target.value })}
              placeholder="A short, compelling subtitle for your course"
              disabled={!isEditable}
              maxLength={120}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition text-sm disabled:bg-gray-50"
            />
            <p className="text-xs text-gray-400 mt-1">{(data?.subtitle || '').length}/120 characters</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={data?.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Describe what students will learn in your course..."
              rows={6}
              disabled={!isEditable}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition text-sm resize-none disabled:bg-gray-50"
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-gray-400">
                {(data?.description || '').length} characters (min 50 recommended)
              </p>
              {(data?.description || '').length >= 50 && (
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <HiPencil size={12} /> Good length
                </span>
              )}
            </div>
          </div>

          {/* Language & Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <div className="relative">
                <HiGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select
                  value={data?.language || 'en'}
                  onChange={(e) => onUpdate({ language: e.target.value })}
                  disabled={!isEditable}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition text-sm appearance-none disabled:bg-gray-50"
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level
              </label>
              <select
                value={data?.level || 'Beginner'}
                onChange={(e) => onUpdate({ level: e.target.value })}
                disabled={!isEditable}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition text-sm appearance-none disabled:bg-gray-50"
              >
                {LEVELS.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <HiTag size={16} />
              Tags
            </label>
            <TagSelector
              selectedTags={data?.tags || []}
              onTagsChange={handleTagsChange}
              isEditable={isEditable}
            />
            <p className="text-xs text-gray-400 mt-2">
              Add relevant tags to help students find your course
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseLandingPageSection;