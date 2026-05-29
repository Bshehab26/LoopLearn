/**
 * StepCategory.jsx
 * Step 2: Category selection with categories from database + custom option
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineTag, HiSearch, HiPlus, HiX } from 'react-icons/hi';
import { getCategories } from '../api/instructor.api';

const StepCategory = ({ selectedCategory, onCategoryChange, error }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response.success) {
          setCategories(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCategory = (categoryName) => {
    onCategoryChange(categoryName);
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

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
      
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="relative">
          <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition"
          />
        </div>
      </div>
      
      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {filteredCategories.map((category) => {
          const isSelected = selectedCategory === category.name;
          
          return (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectCategory(category.name)}
              className={`
                relative p-4 rounded-xl border-2 text-left transition-all group
                ${isSelected 
                  ? 'border-purple-500 bg-purple-50 shadow-md' 
                  : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/30'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">
                  {category.name === 'Web Development' && '💻'}
                  {category.name === 'Mobile Development' && '📱'}
                  {category.name === 'Data Science' && '📊'}
                  {category.name === 'UI/UX Design' && '🎨'}
                  {category.name === 'Cybersecurity' && '🔒'}
                  {category.name === 'DevOps' && '⚙️'}
                  {category.name === 'Cloud Computing' && '☁️'}
                  {category.name === 'Game Development' && '🎮'}
                  {category.name === 'Business' && '💼'}
                  {category.name === 'Marketing' && '📢'}
                  {!['Web Development', 'Mobile Development', 'Data Science', 'UI/UX Design', 'Cybersecurity', 'DevOps', 'Cloud Computing', 'Game Development', 'Business', 'Marketing'].includes(category.name) && '📚'}
                </span>
                <div className="flex-1">
                  <h3 className={`font-semibold ${isSelected ? 'text-purple-700' : 'text-gray-800'}`}>
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{category.description}</p>
                  )}
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Custom Category Option */}
      {!showCustomInput ? (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowCustomInput(true)}
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            <HiPlus size={16} />
            Can't find your category? Add custom
          </button>
        </div>
      ) : (
        <div className="max-w-md mx-auto mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Category Name
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="e.g., Artificial Intelligence"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none"
              autoFocus
            />
            <button
              onClick={handleCustomSubmit}
              disabled={!customCategory.trim()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowCustomInput(false);
                setCustomCategory('');
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <HiX size={16} />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Your custom category will be reviewed by our team
          </p>
        </div>
      )}
      
      {filteredCategories.length === 0 && !showCustomInput && (
        <div className="text-center py-8">
          <p className="text-gray-500">No categories found matching "{searchTerm}"</p>
          <button
            onClick={() => setShowCustomInput(true)}
            className="mt-2 text-purple-600 text-sm hover:underline"
          >
            Add "{searchTerm}" as custom category
          </button>
        </div>
      )}
      
      {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
    </motion.div>
  );
};

export default StepCategory;