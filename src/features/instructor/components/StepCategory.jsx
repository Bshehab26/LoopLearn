/**
 * StepCategory.jsx
 * Step 2: Category selection with card-style options and search
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineTag, HiSearch } from 'react-icons/hi';

const CATEGORIES = [
  { id: 'web-dev', value: 'Web Development', label: 'Web Development', icon: '💻', color: 'blue', description: 'HTML, CSS, JavaScript, React, Angular, Vue, Node.js' },
  { id: 'mobile', value: 'Mobile Apps', label: 'Mobile Apps', icon: '📱', color: 'green', description: 'iOS, Android, Flutter, React Native, Swift, Kotlin' },
  { id: 'data-science', value: 'Data Science', label: 'Data Science', icon: '📊', color: 'purple', description: 'Python, SQL, Machine Learning, AI, Analytics, Pandas' },
  { id: 'design', value: 'UI/UX Design', label: 'UI/UX Design', icon: '🎨', color: 'pink', description: 'Figma, Adobe XD, User Research, Prototyping, Wireframing' },
  { id: 'security', value: 'Cybersecurity', label: 'Cybersecurity', icon: '🔒', color: 'red', description: 'Network Security, Ethical Hacking, Cryptography, Kali Linux' },
  { id: 'devops', value: 'DevOps', label: 'DevOps', icon: '⚙️', color: 'gray', description: 'Docker, Kubernetes, CI/CD, AWS, Cloud, Terraform' },
  { id: 'ai-ml', value: 'AI & ML', label: 'AI & ML', icon: '🤖', color: 'indigo', description: 'Neural Networks, Deep Learning, TensorFlow, PyTorch, ChatGPT' },
  { id: 'business', value: 'Business', label: 'Business', icon: '💼', color: 'amber', description: 'Marketing, Finance, Entrepreneurship, Management, Sales' },
  { id: 'photography', value: 'Photography', label: 'Photography', icon: '📷', color: 'teal', description: 'Digital Photography, Editing, Lighting, Composition' },
  { id: 'music', value: 'Music', label: 'Music', icon: '🎵', color: 'rose', description: 'Production, Guitar, Piano, Music Theory, Composition' },
];

const colorClasses = {
  blue: 'border-blue-200 bg-blue-50 group-hover:border-blue-400',
  green: 'border-green-200 bg-green-50 group-hover:border-green-400',
  purple: 'border-purple-200 bg-purple-50 group-hover:border-purple-400',
  pink: 'border-pink-200 bg-pink-50 group-hover:border-pink-400',
  red: 'border-red-200 bg-red-50 group-hover:border-red-400',
  gray: 'border-gray-200 bg-gray-50 group-hover:border-gray-400',
  indigo: 'border-indigo-200 bg-indigo-50 group-hover:border-indigo-400',
  amber: 'border-amber-200 bg-amber-50 group-hover:border-amber-400',
  teal: 'border-teal-200 bg-teal-50 group-hover:border-teal-400',
  rose: 'border-rose-200 bg-rose-50 group-hover:border-rose-400',
};

const StepCategory = ({ selectedCategory, onCategoryChange, error }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return CATEGORIES;
    const term = searchTerm.toLowerCase();
    return CATEGORIES.filter(cat => 
      cat.label.toLowerCase().includes(term) ||
      cat.description.toLowerCase().includes(term)
    );
  }, [searchTerm]);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
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
          const isSelected = selectedCategory === category.value;
          const colorClass = colorClasses[category.color];
          
          return (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCategoryChange(category.value)}
              className={`
                relative p-4 rounded-xl border-2 text-left transition-all group
                ${isSelected ? 'border-purple-500 bg-purple-50 shadow-md' : colorClass}
              `}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{category.icon}</span>
                <div className="flex-1">
                  <h3 className={`font-semibold ${isSelected ? 'text-purple-700' : 'text-gray-800'}`}>
                    {category.label}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{category.description}</p>
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
      
      {filteredCategories.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No categories found matching "{searchTerm}"</p>
        </div>
      )}
      
      {error && (
        <p className="text-red-500 text-sm text-center mt-4">{error}</p>
      )}
    </motion.div>
  );
};

export default StepCategory;