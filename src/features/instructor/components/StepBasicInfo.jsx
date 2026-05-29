/**
 * StepBasicInfo.jsx
 * Step 1: Course title input only
 */

import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineBookOpen, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';

const StepBasicInfo = ({ title, onTitleChange, error }) => {
  const maxLength = 100;
  const minLength = 10;
  const currentLength = title.length;
  
  const getCharacterColor = () => {
    if (currentLength === 0) return 'text-gray-400';
    if (currentLength < minLength) return 'text-orange-500';
    if (currentLength > maxLength) return 'text-red-500';
    return 'text-green-500';
  };
  
  const getProgressColor = () => {
    if (currentLength < minLength) return 'bg-orange-500';
    if (currentLength > maxLength) return 'bg-red-500';
    return 'bg-purple-600';
  };
  
  const progress = Math.min((currentLength / maxLength) * 100, 100);
  const isValid = currentLength >= minLength && currentLength <= maxLength;
  
  const getPreviewTitle = () => {
    if (!title) return 'Your Course Title Will Appear Here';
    if (title.length > 60) return title.substring(0, 60) + '...';
    return title;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
          <HiOutlineBookOpen size={32} className="text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">What's the title of your course?</h2>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          A great title helps students find your course. Be clear and descriptive.
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Course Title <span className="text-red-500">*</span>
          <span className="text-xs text-gray-400 ml-2">(min. {minLength} chars)</span>
        </label>
        
        <textarea
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="e.g., The Complete React Developer Course (w/ Hooks, Redux, and Next.js)"
          rows={3}
          className={`
            w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all resize-none
            ${error ? 'border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100'}
          `}
        />
        
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <span className={getCharacterColor()}>
                {currentLength} / {maxLength} characters
              </span>
              {isValid && currentLength > 0 && (
                <span className="flex items-center gap-1 text-green-600 text-xs">
                  <HiCheckCircle size={14} />
                  Good length
                </span>
              )}
              {currentLength > maxLength && (
                <span className="flex items-center gap-1 text-red-500 text-xs">
                  <HiExclamationCircle size={14} />
                  Too long
                </span>
              )}
            </div>
            {currentLength < minLength && currentLength > 0 && (
              <span className="text-orange-500 text-xs">
                Need {minLength - currentLength} more characters
              </span>
            )}
          </div>
          
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.3 }}
              className={`h-full rounded-full ${getProgressColor()}`}
            />
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-100">
          <p className="text-xs text-purple-600 font-medium mb-2">📺 Course Title Preview</p>
          <p className="text-lg font-semibold text-gray-800">{getPreviewTitle()}</p>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-700 font-medium mb-2">💡 Tips for a great title:</p>
          <ul className="text-xs text-blue-600 space-y-1">
            <li>• Include keywords students might search for</li>
            <li>• Highlight the main skill or technology</li>
            <li>• Keep it clear and specific (10-100 characters)</li>
            <li>• Avoid all caps and excessive punctuation</li>
            <li>• Make it action-oriented (e.g., "Master...", "Learn...", "Build...")</li>
          </ul>
        </div>
        
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </motion.div>
  );
};

export default StepBasicInfo;