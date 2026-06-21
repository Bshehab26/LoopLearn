// src/features/instructor/components/CourseCard.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { HiPencil, HiTrash, HiEye, HiPaperAirplane, HiUsers, HiStar, HiClock } from 'react-icons/hi';

const STATUS_STYLES = {
  draft: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Draft', icon: '📝' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending Review', icon: '⏳' },
  published: { bg: 'bg-green-100', text: 'text-green-700', label: 'Published', icon: '✅' },
  rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected', icon: '❌' },
};

const CourseCard = ({ course, onEdit, onDelete, onSubmit, onView, isSubmitting = false }) => {
  const statusStyle = STATUS_STYLES[course.status] || STATUS_STYLES.draft;

  // Determine which actions are available based on status
  const canEdit = course.status === 'draft' || course.status === 'rejected';
  const canSubmit = course.status === 'draft' || course.status === 'rejected';
  const canDelete = course.status !== 'pending';
  const canView = course.status === 'published'; // Only published courses can be viewed

  // For pending courses, show NO actions at all
  const isPending = course.status === 'pending';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      {/* Thumbnail with overlay - No actions for pending */}
      <div className="relative h-44 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {course.thumbnailUrl ? (
          <img 
            src={course.thumbnailUrl} 
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-xs">No thumbnail</span>
          </div>
        )}
        
        {/* Status Badge */}
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-medium ${statusStyle.bg} ${statusStyle.text} shadow-sm`}>
          <span className="mr-1">{statusStyle.icon}</span>
          {statusStyle.label}
        </div>

        {/* Quick Actions Overlay - Only show for non-pending courses */}
        {!isPending && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
            {/* View - Only for Draft & Published */}
            {canView && (
              <button
                onClick={onView}
                className="p-2.5 bg-white rounded-lg text-gray-700 hover:bg-gray-100 transition transform hover:scale-105 shadow-md"
                title="View Course"
              >
                <HiEye size={20} />
              </button>
            )}

            {/* Edit - Draft & Rejected only */}
            {canEdit && (
              <button
                onClick={onEdit}
                className="p-2.5 bg-white rounded-lg text-blue-600 hover:bg-gray-100 transition transform hover:scale-105 shadow-md"
                title="Edit Course"
              >
                <HiPencil size={20} />
              </button>
            )}

            {/* Submit for Review - Draft & Rejected only */}
            {canSubmit && (
              <button
                onClick={onSubmit}
                disabled={isSubmitting}
                className="p-2.5 bg-white rounded-lg text-green-600 hover:bg-gray-100 transition transform hover:scale-105 disabled:opacity-50 shadow-md"
                title="Submit for Review"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <HiPaperAirplane size={20} />
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{course.title}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{course.subtitle || 'No description'}</p>
        
        {/* Stats Row */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-1">
            <HiUsers size={14} className="text-gray-400" />
            <span>{course.enrollmentCount || 0} students</span>
          </div>
          <div className="flex items-center gap-1">
            <HiStar size={14} className="text-yellow-400" />
            <span>{course.averageRating || 0}</span>
          </div>
          <div className="font-semibold text-purple-600">
            {course.isFree ? 'Free' : `EGP ${course.price}`}
          </div>
        </div>

        {/* Footer Actions - No actions for pending */}
        {!isPending && (
          <div className="flex justify-end">
            {canDelete && (
              <button
                onClick={onDelete}
                className="text-gray-400 hover:text-red-500 transition text-sm flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-red-50"
              >
                <HiTrash size={15} />
                Delete
              </button>
            )}
          </div>
        )}

        {/* Status Messages */}
        {course.status === 'pending' && (
          <div className="mt-2 flex justify-center">
            <span className="text-sm text-yellow-600 bg-yellow-50 px-4 py-2 rounded-full font-medium">
              ⏳ This course is under review by the admin team
            </span>
          </div>
        )}

        {course.status === 'rejected' && (
          <div className="mt-2 flex justify-center">
            <span className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-full font-medium">
              ❌ Rejected - Edit and resubmit for review
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CourseCard;