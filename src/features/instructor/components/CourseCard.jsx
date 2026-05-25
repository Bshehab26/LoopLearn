/**
 * CourseCard.jsx
 * Course card component for My Courses page
 */

import React from 'react';
import { motion } from 'framer-motion';
import { HiPencil, HiTrash, HiEye, HiUpload, HiClock } from 'react-icons/hi';

const CourseCard = ({ course, type, onEdit, onDelete, onPublish }) => {
  const isDraft = type === 'draft';
  
  // Get display values
  const durationLabel = (hours) => {
    if (hours <= 2) return '0-2 hours';
    if (hours <= 5) return '2-5 hours';
    if (hours <= 10) return '5-10 hours';
    if (hours <= 20) return '10-20 hours';
    return '20+ hours';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all"
    >
      {/* Thumbnail Placeholder */}
      <div className="relative h-36 bg-gradient-to-r from-purple-100 to-indigo-100 flex items-center justify-center">
        {course.avatar ? (
          <img src={course.avatar} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center">
            <div className="text-4xl mb-1">
              {course.category === 'Web Development' && '💻'}
              {course.category === 'Mobile Apps' && '📱'}
              {course.category === 'Data Science' && '📊'}
              {course.category === 'UI/UX Design' && '🎨'}
              {course.category === 'Cybersecurity' && '🔒'}
              {course.category === 'DevOps' && '⚙️'}
              {course.category === 'AI & ML' && '🤖'}
            </div>
            <p className="text-xs text-gray-500">No thumbnail</p>
          </div>
        )}
        
        {/* Status Badge */}
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
          isDraft ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
        }`}>
          {isDraft ? 'Draft' : 'Published'}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 line-clamp-1">{course.title}</h3>
        
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
          <span>{course.category}</span>
          <span className="flex items-center gap-1">
            <HiClock size={12} />
            {durationLabel(course.duration)}
          </span>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-400">
            Created {new Date(course.createdAt).toLocaleDateString()}
          </div>
          
          <div className="flex gap-2">
            {isDraft && onPublish && (
              <button
                onClick={onPublish}
                className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition"
                title="Publish"
              >
                <HiUpload size={16} />
              </button>
            )}
            <button
              onClick={onEdit}
              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
              title="Edit"
            >
              <HiPencil size={16} />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
              title="Delete"
            >
              <HiTrash size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;