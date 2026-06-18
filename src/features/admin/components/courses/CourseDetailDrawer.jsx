// src/features/admin/components/courses/CourseDetailDrawer.jsx

import React from 'react';
import Drawer from '../common/Drawer';
import CourseStatusBadge from './CourseStatusBadge';
import useAdminCourseDetail from '../../hooks/useAdminCourseDetail';
import {
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiOutlineTag,
  HiOutlineBookOpen,
} from 'react-icons/hi';

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—';

const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '—';
  return `$${Number(amount).toFixed(2)}`;
};

const CourseDetailDrawer = ({ courseId, open, onClose }) => {
  const { course, loading, error } = useAdminCourseDetail(open ? courseId : null);

  return (
    <Drawer open={open} onClose={onClose} title="Course Details">
      {loading && (
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-100 rounded w-2/3" />
          <div className="h-4 bg-gray-100 rounded w-1/2" />
          <div className="h-32 bg-gray-100 rounded" />
        </div>
      )}

      {error && <p className="text-sm text-red-600 text-center py-6">{error}</p>}

      {course && !loading && (
        <div className="space-y-5">
          {/* Thumbnail */}
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            {course.thumbnailUrl ? (
              <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">📚</div>
            )}
          </div>

          {/* Title & Status */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{course.subtitle || 'No subtitle'}</p>
            <div className="flex items-center gap-2 mt-2">
              <CourseStatusBadge status={course.status} />
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <HiOutlineUser size={15} className="text-gray-400" />
              <span>{course.instructorName || 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <HiOutlineTag size={15} className="text-gray-400" />
              <span>{course.category || 'Uncategorized'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <HiOutlineCurrencyDollar size={15} className="text-gray-400" />
              <span>{course.isFree ? 'Free' : formatCurrency(course.price)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <HiOutlineCalendar size={15} className="text-gray-400" />
              <span>Created {formatDate(course.createdAt)}</span>
            </div>
          </div>

          {/* Description */}
          {course.description && (
            <div className="pt-3 border-t border-gray-100">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{course.description}</p>
            </div>
          )}

          {/* Tags */}
          {course.tags?.length > 0 && (
            <div className="pt-3 border-t border-gray-100">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Tags</h4>
              <div className="flex flex-wrap gap-1.5">
                {course.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-gray-800">{course.enrollmentCount || 0}</p>
              <p className="text-xs text-gray-400">Students</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-gray-800">{course.sectionCount || 0}</p>
              <p className="text-xs text-gray-400">Sections</p>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default CourseDetailDrawer;