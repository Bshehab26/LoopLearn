// src/features/instructor/components/EditCourseSidebar.jsx

import React from 'react';
import { motion } from 'framer-motion';
import {
  HiClipboardList,
  HiBookOpen,
  HiCurrencyDollar,
  HiPhotograph,
  HiPencil,
  HiTag,
  HiCheckCircle,
  HiExclamationCircle,
  HiSave,
  HiPaperAirplane,
  HiArrowLeft,
  HiEye,
  HiChevronRight,
} from 'react-icons/hi';
import CourseStatusBadge from './CourseStatusBadge';

const SECTIONS = [
  {
    id: 'title-category',
    label: 'Title & Category',
    icon: HiPencil,
    description: 'Course name and category',
    required: true,
  },
  {
    id: 'plan',
    label: 'Plan Course',
    icon: HiClipboardList,
    description: 'Learning outcomes & requirements',
    required: true,
  },
  {
    id: 'landing',
    label: 'Landing Page',
    icon: HiPhotograph,
    description: 'Thumbnail, description & tags',
    required: true,
  },
  {
    id: 'structure',
    label: 'Course Structure',
    icon: HiBookOpen,
    description: 'Sections, lessons & quizzes',
    required: true,
  },
  {
    id: 'pricing',
    label: 'Pricing',
    icon: HiCurrencyDollar,
    description: 'Course price settings',
    required: true,
  },
];

const EditCourseSidebar = ({
  course,
  activeSection,
  onSectionChange,
  onSave,
  onSubmitReview,
  onNavigateBack,
  saving,
  saveStatus,
  hasUnsaved,
  isEditable,
  getSectionStatus,
}) => {
  const isPublished = course?.status === 'published';
  const isPending = course?.status === 'pending';

  const completedCount = SECTIONS.filter(s => getSectionStatus(s.id, course) === 'complete').length;

  // Find first uncompleted section for highlighting
  const firstUncompleted = SECTIONS.find(s => getSectionStatus(s.id, course) === 'incomplete')?.id;

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex-shrink-0">
        <button
          onClick={onNavigateBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 text-sm transition group"
        >
          <HiArrowLeft size={16} className="group-hover:-translate-x-0.5 transition" />
          <span>Back to courses</span>
        </button>

        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-lg font-bold text-gray-800 line-clamp-2 leading-tight">
            {course?.title || 'Untitled Course'}
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <CourseStatusBadge status={course?.status} showDescription={false} size="sm" />
          {hasUnsaved && (
            <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              <HiExclamationCircle size={12} />
              Unsaved
            </span>
          )}
        </div>

        {isPublished && (
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <HiEye size={12} />
            Live and visible to students
          </p>
        )}
      </div>

      {/* Progress */}
      <div className="px-5 py-4 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-500 font-medium">Completion</span>
          <span className="text-purple-600 font-bold">{completedCount}/{SECTIONS.length}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / SECTIONS.length) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          Complete all sections to submit for review
        </p>
      </div>

      {/* Navigation - Scrollable */}
      <nav className="flex-1 overflow-y-auto py-2 min-h-0">
        {SECTIONS.map((section) => {
          const status = getSectionStatus(section.id, course);
          const isActive = activeSection === section.id;
          const isFirstUncompleted = section.id === firstUncompleted && status === 'incomplete';
          const Icon = section.icon;

          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`
                w-full flex items-start gap-3 px-5 py-3.5 text-left transition-all relative
                ${isActive 
                  ? 'bg-purple-50 text-purple-700' 
                  : 'hover:bg-gray-50 text-gray-600'
                }
              `}
            >
              {/* Active indicator bar */}
              {isActive && (
                <motion.div
                  layoutId="activeSection"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-purple-600 rounded-r"
                />
              )}

              {/* Step number / Status */}
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                ${status === 'complete' 
                  ? 'bg-green-100 text-green-600' 
                  : isActive 
                    ? 'bg-purple-100 text-purple-600' 
                    : isFirstUncompleted
                      ? 'bg-amber-100 text-amber-600 ring-2 ring-amber-300 ring-offset-1'
                      : 'bg-gray-100 text-gray-400'
                }
              `}>
                {status === 'complete' ? (
                  <HiCheckCircle size={18} />
                ) : (
                  <Icon size={18} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-medium text-sm ${isActive ? 'text-purple-800' : 'text-gray-700'}`}>
                    {section.label}
                  </span>
                  {isFirstUncompleted && !isActive && (
                    <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-full font-medium animate-pulse">
                      Next
                    </span>
                  )}
                </div>
                <p className={`text-xs mt-0.5 ${isActive ? 'text-purple-500' : 'text-gray-400'}`}>
                  {section.description}
                </p>
              </div>

              <HiChevronRight
                size={16}
                className={`flex-shrink-0 mt-1.5 ${isActive ? 'text-purple-400' : 'text-gray-300'}`}
              />
            </button>
          );
        })}
      </nav>

      {/* Footer Actions - Fixed at bottom */}
      <div className="p-5 border-t border-gray-100 space-y-3 flex-shrink-0 bg-white">
        {isEditable && (
          <button
            onClick={onSubmitReview}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-500 text-white rounded-xl font-medium hover:bg-yellow-600 transition shadow-sm"
          >
            <HiPaperAirplane size={16} />
            Submit for Review
          </button>
        )}

        <button
          onClick={onSave}
          disabled={saving || !isEditable}
          className={`
            w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition shadow-sm
            ${saving 
              ? 'bg-gray-100 text-gray-400 cursor-wait' 
              : saveStatus === 'saved'
                ? 'bg-green-600 text-white hover:bg-green-700'
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
              Saved!
            </>
          ) : (
            <>
              <HiSave size={16} />
              Save All Changes
            </>
          )}
        </button>

        {saveStatus === 'error' && (
          <p className="text-xs text-red-500 text-center">Failed to save. Try again.</p>
        )}
      </div>
    </div>
  );
};

export default EditCourseSidebar;