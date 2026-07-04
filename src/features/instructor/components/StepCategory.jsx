/**
 * StepCategory.jsx
 * Step 2: Category selection with searchable dropdown
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineTag, HiPlus, HiX } from 'react-icons/hi';
import SearchableDropdown from '../../../shared/components/SearchableDropdown';
import { getCategories } from '../../../shared/api/preLoadData.api';

const StepCategory = ({ selectedCategory, onCategoryChange, error }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
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

  // Convert categories to dropdown options
  const categoryOptions = categories.map(cat => ({
    value: cat.name,
    label: cat.name,
    searchText: cat.name + ' ' + (cat.description || ''),
    description: cat.description,
    icon: getCategoryIcon(cat.name),
  }));

  const handleSelect = (value) => {
    onCategoryChange(value);
    setShowCustomInput(false);
    setCustomCategory('');
  };

  const handleCustomSubmit = () => {
    if (customCategory.trim()) {
      onCategoryChange(customCategory.trim());
      setShowCustomInput(false);
      setCustomCategory('');
    }
  };

  // Custom option renderer with icons
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

  // Custom value renderer
  const renderValue = (option) => (
    <div className="flex items-center gap-2">
      <span className="text-lg">{option.icon}</span>
      <span className="font-medium">{option.label}</span>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
          <HiOutlineTag size={32} className="text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Choose a category</h2>
        <p className="text-gray-500 mt-2">
          Select the category that best describes your course content
        </p>
      </div>

      <div className="max-w-xl mx-auto space-y-6">
        {/* Searchable Dropdown */}
        <SearchableDropdown
          options={categoryOptions}
          value={selectedCategory}
          onChange={handleSelect}
          placeholder="Select a category..."
          searchPlaceholder="Search categories..."
          label="Course Category"
          error={error}
          loading={loading}
          emptyMessage="No categories found"
          optionRenderer={renderOption}
          valueRenderer={renderValue}
          icon={HiOutlineTag}
        />

       

        {/* Selected Category Display */}
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-purple-50 rounded-xl border border-purple-200"
          >
            <p className="text-xs text-purple-600 font-medium mb-2 uppercase tracking-wide">Selected</p>
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {getCategoryIcon(selectedCategory)}
              </span>
              <div>
                <p className="font-semibold text-gray-800">{selectedCategory}</p>
                <p className="text-xs text-gray-500">
                  {categories.find(c => c.name === selectedCategory)?.description || 'Custom category'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Helper: Get emoji icon for category
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

export default StepCategory;