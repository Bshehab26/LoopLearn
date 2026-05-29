/**
 * CourseCard.jsx
 * Course card component for My Courses page
 * Supports: draft, pending, published, rejected states
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  HiPencil, HiTrash, HiEye, HiUpload, HiClock, 
  HiPaperAirplane, HiXCircle, HiCheckCircle 
} from 'react-icons/hi';

const STATUS_CONFIG = {
  draft: {
    label: 'Draft',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
    icon: HiClock,
    actions: ['edit', 'delete', 'submit'],
  },
  pending: {
    label: 'Pending Review',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
    icon: HiPaperAirplane,
    actions: ['view'],
  },
  published: {
    label: 'Published',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    icon: HiCheckCircle,
    actions: ['view', 'edit'],
  },
  rejected: {
    label: 'Rejected',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    icon: HiXCircle,
    actions: ['edit', 'delete', 'submit'],
  },
};

const CourseCard = ({ 
  course, 
  onEdit, 
  onDelete, 
  onSubmit, 
  onView,
  onPublish  // Keep for backward compatibility
}) => {
  const status = course?.status?.toLowerCase() || 'draft';
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  const StatusIcon = config.icon;

  // Duration label helper
  const durationLabel = (hours) => {
    if (!hours) return 'Not set';
    if (hours <= 2) return '0-2 hours';
    if (hours <= 5) return '2-5 hours';
    if (hours <= 10) return '5-10 hours';
    if (hours <= 20) return '10-20 hours';
    return '20+ hours';
  };

  const handleAction = (action) => {
    switch (action) {
      case 'edit':
        onEdit?.(course.id);
        break;
      case 'delete':
        onDelete?.(course.id);
        break;
      case 'submit':
        onSubmit?.(course.id);
        break;
      case 'view':
        onView?.(course.id);
        break;
      case 'publish':
        onPublish?.(course.id);
        break;
      default:
        break;
    }
  };

  // Determine which actions to show
  const showActions = config.actions;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all"
    >
      {/* Thumbnail Placeholder */}
      <div className="relative h-36 bg-gradient-to-r from-purple-100 to-indigo-100 flex items-center justify-center">
        {course.thumbnailUrl || course.avatar ? (
          <img 
            src={course.thumbnailUrl || course.avatar} 
            alt={course.title} 
            className="w-full h-full object-cover" 
          />
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
              {!course.category && '📚'}
            </div>
            <p className="text-xs text-gray-500">No thumbnail</p>
          </div>
        )}
        
        {/* Status Badge */}
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.bgColor} ${config.textColor}`}>
          <StatusIcon size={12} />
          {config.label}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 line-clamp-1">{course.title}</h3>
        
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
          <span>{course.category || 'Uncategorized'}</span>
          <span className="flex items-center gap-1">
            <HiClock size={12} />
            {durationLabel(course.duration)}
          </span>
        </div>
        
        {/* Rejection Reason (if rejected) */}
        {status === 'rejected' && course.rejectionReason && (
          <p className="text-xs text-red-600 mt-2 bg-red-50 p-2 rounded-lg">
            Reason: {course.rejectionReason}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-400">
            Created {new Date(course.createdAt).toLocaleDateString()}
          </div>
          
          <div className="flex gap-2">
            {showActions.includes('submit') && (
              <button
                onClick={() => handleAction('submit')}
                className="p-1.5 rounded-lg text-yellow-600 hover:bg-yellow-50 transition"
                title="Submit for Review"
              >
                <HiPaperAirplane size={16} />
              </button>
            )}
            
            {showActions.includes('edit') && (
              <button
                onClick={() => handleAction('edit')}
                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                title="Edit Course"
              >
                <HiPencil size={16} />
              </button>
            )}
            
            {showActions.includes('view') && (
              <button
                onClick={() => handleAction('view')}
                className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 transition"
                title="View Course"
              >
                <HiEye size={16} />
              </button>
            )}
            
            {showActions.includes('delete') && (
              <button
                onClick={() => handleAction('delete')}
                className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
                title="Delete Course"
              >
                <HiTrash size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;