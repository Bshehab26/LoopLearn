// src/features/courses/components/course-details/CourseTabs.jsx

import React from 'react';

const CourseTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview',    label: 'Overview' },
    { id: 'curriculum',  label: 'Curriculum' },
    { id: 'reviews',     label: 'Reviews' },
    { id: 'instructor',  label: 'Instructor' },
  ];

  return (
    <div className="flex gap-0 border-b border-gray-200 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2.5 text-[13px] font-medium transition-all whitespace-nowrap border-b-2 ${
            activeTab === tab.id
              ? 'text-[#534AB7] border-[#534AB7]'
              : 'text-gray-400 border-transparent hover:text-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default CourseTabs;