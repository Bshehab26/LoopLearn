// src/features/courses/components/EmptyState.jsx

import React from 'react';

const EmptyState = ({ onBrowseCourses }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-purple-100 flex items-center justify-center">
        <span className="text-4xl">📚</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Course not found</h3>
      <p className="text-gray-500 mb-6">The course you're looking for doesn't exist or you haven't enrolled yet.</p>
      <button
        onClick={onBrowseCourses}
        className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
      >
        Browse Courses
      </button>
    </div>
  </div>
);

export default EmptyState;