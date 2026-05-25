/**
 * EmptyState.jsx
 * Empty state component for when there are no courses
 */

import React from 'react';
import { motion } from 'framer-motion';
import { HiPlus } from 'react-icons/hi';

const EmptyState = ({ icon, title, description, buttonText, onButtonClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-purple-50 flex items-center justify-center">
        {icon || <HiPlus size={40} className="text-purple-300" />}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title || 'No items yet'}</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        {description || 'Get started by creating your first item'}
      </p>
      {buttonText && onButtonClick && (
        <button
          onClick={onButtonClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition"
        >
          <HiPlus size={18} />
          {buttonText}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;