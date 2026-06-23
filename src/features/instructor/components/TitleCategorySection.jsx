// src/features/instructor/components/TitleCategorySection.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiPencil, HiTag, HiCheckCircle, HiExclamationCircle, HiSave, HiRefresh } from 'react-icons/hi';
import SearchableDropdown from '../../../shared/components/SearchableDropdown';
import { getCategories } from '../api/instructor.api';
import { updateCourseTitleCategory } from '../api/instructor.api';

const TitleCategorySection = ({ data, onUpdate, isEditable }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [localTitle, setLocalTitle] = useState('');
  const [localCategory, setLocalCategory] = useState('');
  const [errors, setErrors] = useState({});
  const [lastSaved, setLastSaved] = useState({ title: '', category: '' });

  // Sync local state with parent course data whenever it changes
 useEffect(() => {
  if (data) {
    const title = data.title || '';
    const category = data.categoryName || data.category || '';
    setLocalTitle(title);
    setLocalCategory(category);
    setLastSaved({ title, category });
  }
}, [data?.title, data?.categoryName, data?.category]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories(1, 100);
        if (response.success) {
          setCategories(response.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const categoryOptions = categories.map(cat => ({
    value: cat.name,
    label: cat.name,
    searchText: cat.name + ' ' + (cat.description || ''),
    description: cat.description,
    icon: getCategoryIcon(cat.name),
  }));

  const validate = () => {
    const newErrors = {};
    if (!localTitle.trim()) {
      newErrors.title = 'Course title is required';
    } else if (localTitle.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters';
    } else if (localTitle.trim().length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }
    if (!localCategory) {
      newErrors.category = 'Please select a category';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSave = async () => {
  if (!validate()) return;
  if (!isEditable) return;

  const newTitle = localTitle.trim();
  const newCategory = localCategory.trim();

  // If nothing changed, do nothing
  if (newTitle === lastSaved.title && newCategory === lastSaved.category) {
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus(null), 1500);
    return;
  }

  // Always send both fields (server may require both)
  const payload = {
    title: newTitle,
    category: newCategory,
  };

  setSaving(true);
  setSaveStatus('saving');

  try {
    const response = await updateCourseTitleCategory(data.id, payload);
    if (response.success) {
      setSaveStatus('saved');
      setLastSaved({ title: newTitle, category: newCategory });
      onUpdate({ title: newTitle, category: newCategory });
    } else {
      setSaveStatus('error');
      setErrors({ submit: response.message || 'Failed to update' });
    }
  } catch (err) {
    setSaveStatus('error');
    setErrors({ submit: 'Network error. Please try again.' });
  } finally {
    setSaving(false);
    setTimeout(() => setSaveStatus(null), 2000);
  }
};
  const handleReset = () => {
    setLocalTitle(data?.title || '');
    setLocalCategory(data?.category || '');
    setErrors({});
  };

  // Check if current values differ from saved data
  const hasChanges = 
    localTitle.trim() !== (data?.title || '').trim() || 
    localCategory !== (data?.category || '');

  const renderOption = (option) => (
    <div className="flex items-center gap-3">
      <span className="text-xl flex-shrink-0">{option.icon}</span>
      <div className="min-w-0">
        <p className="font-medium text-sm">{option.label}</p>
        {option.description && (
          <p className="text-xs text-gray-400 truncate">{option.description}</p>
        )}
      </div>
    </div>
  );

  const renderValue = (option) => (
    <div className="flex items-center gap-2">
      <span className="text-lg">{option.icon}</span>
      <span className="font-medium">{option.label}</span>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <HiPencil size={20} className="text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Title & Category</h3>
            <p className="text-xs text-gray-500">Edit your course name and category</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={localTitle}
              onChange={(e) => {
                setLocalTitle(e.target.value);
                if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
              }}
              placeholder="e.g., The Complete React Developer Course"
              disabled={!isEditable}
              maxLength={100}
              className={`
                w-full px-4 py-3 rounded-xl border-2 text-sm transition-all
                ${errors.title ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' : 'border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100'}
                disabled:bg-gray-50 disabled:text-gray-500
              `}
            />
            <div className="flex items-center justify-between mt-1.5">
              {errors.title ? (
                <p className="text-xs text-red-500">{errors.title}</p>
              ) : (
                <p className="text-xs text-gray-400">
                  {localTitle.length}/100 characters
                </p>
              )}
              {localTitle.length >= 2 && localTitle.length <= 100 && (
                <span className="flex items-center gap-1 text-xs text-green-600">
                  <HiCheckCircle size={12} />
                  Good
                </span>
              )}
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <SearchableDropdown
              options={categoryOptions}
              value={localCategory}
              onChange={(value) => {
                setLocalCategory(value);
                if (errors.category) setErrors(prev => ({ ...prev, category: '' }));
              }}
              placeholder="Select a category..."
              searchPlaceholder="Search categories..."
              label="Course Category"
              error={errors.category}
              loading={loading}
              emptyMessage="No categories found"
              optionRenderer={renderOption}
              valueRenderer={renderValue}
              icon={HiTag}
              disabled={!isEditable}
            />
          </div>

          {/* Current Course Info Card */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Current Course Info</p>
              {hasChanges && (
                <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
                  Modified
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-white rounded-lg border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Current Title</p>
                <p className="text-sm font-medium text-gray-800">{data?.title || 'Not set'}</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Current Category</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getCategoryIcon(data?.category)}</span>
                  <p className="text-sm font-medium text-gray-800">{data?.category || 'Not set'}</p>
                </div>
              </div>
            </div>
            {data?.category && (
              <p className="text-xs text-gray-400 mt-2">
                Category ID: {categories.find(c => c.name === data.category)?.id || 'N/A'}
              </p>
            )}
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200 flex items-center gap-2">
              <HiExclamationCircle size={16} className="text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          {isEditable && (
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className={`
                  flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition
                  ${saving
                    ? 'bg-gray-100 text-gray-400 cursor-wait'
                    : saveStatus === 'saved'
                      ? 'bg-green-600 text-white'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }
                  disabled:opacity-50
                `}
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : saveStatus === 'saved' ? (
                  <>
                    <HiCheckCircle size={16} />
                    Saved Successfully!
                  </>
                ) : (
                  <>
                    <HiSave size={16} />
                    Save Title & Category
                  </>
                )}
              </button>

              {hasChanges && (
                <button
                  onClick={handleReset}
                  className="px-4 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition flex items-center gap-2"
                  title="Reset to original values"
                >
                  <HiRefresh size={16} />
                  Reset
                </button>
              )}
            </div>
          )}

          {!isEditable && (
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-center gap-2">
              <HiExclamationCircle size={16} className="text-amber-500 flex-shrink-0" />
              <p className="text-sm text-amber-700">
                This course is <strong>{data?.status}</strong>. Title and category cannot be edited.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const getCategoryIcon = (name) => {
  const icons = {
    'Web Development': '💻',
    'Mobile Development': '📱',
    'Data Science': '📊',
    'UI/UX Design': '🎨',
    'Cybersecurity': '🔒',
    'DevOps': '⚙️',
    'Cloud Computing': '☁️',
    'Game Development': '🎮',
    'Business': '💼',
    'Marketing': '📢',
    'Artificial Intelligence': '🤖',
    'Machine Learning': '🧠',
    'Blockchain': '⛓️',
    'Database': '🗄️',
    'Networking': '🌐',
    'Programming Languages': '💻',
    'Software Engineering': '🏗️',
    'Project Management': '📋',
    'Finance': '💰',
    'Photography': '📷',
    'Music': '🎵',
    'Health & Fitness': '💪',
    'Personal Development': '🌱',
    'Language Learning': '🗣️',
  };
  return icons[name] || '📚';
};

export default TitleCategorySection;