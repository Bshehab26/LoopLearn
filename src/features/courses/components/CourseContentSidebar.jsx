// src/features/courses/components/CourseContentSidebar.jsx

import React, { useState } from 'react';
import { HiOutlineChevronDown, HiOutlineChatAlt2 } from 'react-icons/hi';
import Section from './Section';

const CourseContentSidebar = ({
  sections,
  openSections,
  onToggleSection,
  onItemSelect,
  currentItemId,
  completedItems,
  onShowFeedback,
  isFeedbackActive,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!sections?.length) {
    return (
      <div className="bg-white border-l border-gray-100 p-6">
        <p className="text-center text-gray-500 py-12">No course content available</p>
      </div>
    );
  }

  return (
    <div className={`bg-white border-l border-gray-100 transition-all duration-300 ${isCollapsed ? 'w-16' : ''}`}>
      <div className="sticky top-32 flex flex-col h-[calc(100vh-8rem)]">
        {/* Content header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          {!isCollapsed && <h3 className="font-semibold text-gray-800">Course Content</h3>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg hover:bg-gray-100 transition"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <HiOutlineChevronDown
              className={`transform transition-transform ${isCollapsed ? 'rotate-90' : '-rotate-90'}`}
            />
          </button>
        </div>

        {/* Scrollable sections */}
        <div className={`flex-1 overflow-y-auto p-4 space-y-2 ${isCollapsed ? 'hidden' : ''}`}>
          {sections.map((section, idx) => (
            <Section
              key={section.id || idx}
              section={section}
              index={idx}
              isOpen={openSections[idx]}
              onToggle={onToggleSection}
              currentItemId={currentItemId}
              onItemSelect={onItemSelect}
              completedItems={completedItems}
            />
          ))}
        </div>

        {/* Feedback button - always at bottom */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-100 flex-shrink-0">
            <button
              onClick={onShowFeedback}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isFeedbackActive
                  ? 'bg-purple-100 text-purple-700'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <HiOutlineChatAlt2 size={18} />
              <span className="text-sm font-medium">Course Feedback</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseContentSidebar;