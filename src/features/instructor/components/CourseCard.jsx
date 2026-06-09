// src/features/instructor/components/CourseCard.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { HiPencil, HiTrash, HiEye, HiPaperAirplane, HiUsers, HiStar } from 'react-icons/hi';

const STATUS_STYLES = {
  draft: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Draft' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending Review' },
  published: { bg: 'bg-green-100', text: 'text-green-700', label: 'Published' },
  rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
};

const CourseCard = ({ course, onEdit, onDelete, onSubmit, onView, isSubmitting = false }) => {
  const statusStyle = STATUS_STYLES[course.status] || STATUS_STYLES.draft;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
    >
      {/* Thumbnail */}
      <div className="relative h-40 bg-gray-100">
        {course.thumbnailUrl ? (
          <img 
            src={course.thumbnailUrl} 
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}
        
        {/* Status Badge */}
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
          {statusStyle.label}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{course.title}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{course.subtitle || 'No description'}</p>
        
        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <HiUsers size={14} />
            <span>{course.enrollmentCount || 0} students</span>
          </div>
          <div className="flex items-center gap-1">
            <HiStar size={14} className="text-yellow-400" />
            <span>{course.averageRating || 0}/5</span>
          </div>
          <div className="font-medium text-purple-600">
            {course.isFree ? 'Free' : `$${course.price}`}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <button
              onClick={onView}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition"
              title="View Course"
            >
              <HiEye size={16} />
            </button>
            <button
              onClick={onEdit}
              className="p-2 rounded-lg hover:bg-gray-100 text-blue-600 transition"
              title="Edit Course"
            >
              <HiPencil size={16} />
            </button>
            {course.status === 'draft' && (
              <button
                onClick={onSubmit}
                disabled={isSubmitting}
                className="p-2 rounded-lg hover:bg-gray-100 text-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                title="Submit for Review"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <HiPaperAirplane size={16} />
                )}
              </button>
            )}
          </div>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition"
            title="Delete Course"
          >
            <HiTrash size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;