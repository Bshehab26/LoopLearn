// src/features/admin/components/courses/CourseTable.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CourseStatusBadge from './CourseStatusBadge';
import CourseActionsMenu from './CourseActionsMenu';
import Avatar from '../common/Avatar';
import TableSkeleton from '../common/TableSkeleton';
import EmptyState from '../common/EmptyState';
import ErrorState from '../common/ErrorState';
import Pagination from '../../../../shared/components/Pagination';
import { HiOutlineBookOpen, HiOutlineChevronDown } from 'react-icons/hi';

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '—';
  return `$${Number(amount).toFixed(2)}`;
};

// Mobile card view for small screens
const CourseMobileCard = ({ course, onViewDetails, onApprove, onReject, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 mb-3 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
              {course.thumbnailUrl ? (
                <img src={course.thumbnailUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <HiOutlineBookOpen size={16} className="text-gray-400" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-gray-800 text-sm truncate">{course.title}</p>
              <p className="text-xs text-gray-400 truncate">{course.subtitle || 'No subtitle'}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          <CourseStatusBadge status={course.status} />
          <CourseActionsMenu
            course={course}
            onViewDetails={onViewDetails}
            onApprove={onApprove}
            onReject={onReject}
            onDelete={onDelete}
          />
          <button 
            onClick={() => setExpanded(!expanded)}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <HiOutlineChevronDown 
              size={16} 
              className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>
      
      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-400">Instructor</span>
              <p className="text-gray-700 font-medium">{course.instructorName}</p>
              <p className="text-gray-400 text-[10px]">{course.instructorEmail}</p>
            </div>
            <div>
              <span className="text-gray-400">Category</span>
              <p className="text-gray-700">{course.category || '—'}</p>
            </div>
            <div>
              <span className="text-gray-400">Price</span>
              <p className="text-gray-700 font-semibold">
                {course.isFree ? 'Free' : formatCurrency(course.price)}
              </p>
            </div>
            <div>
              <span className="text-gray-400">Created</span>
              <p className="text-gray-700">{formatDate(course.createdAt)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CourseRow = ({ course, index, onViewDetails, onApprove, onReject, onDelete }) => (
  <motion.tr
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.04, duration: 0.25 }}
    className="border-b border-gray-50 last:border-0 hover:bg-gradient-to-r hover:from-[#EEEDFE]/30 hover:to-transparent transition-colors group"
  >
    <td className="px-3 py-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-9 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
          {course.thumbnailUrl ? (
            <img src={course.thumbnailUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <HiOutlineBookOpen size={14} className="text-gray-400" />
          )}
        </div>
        <div className="min-w-0">
          <p className="font-medium text-gray-800 truncate text-sm max-w-[120px] md:max-w-[200px]">
            {course.title}
          </p>
          {course.subtitle && (
            <p className="text-xs text-gray-400 truncate max-w-[120px] md:max-w-[200px]">
              {course.subtitle}
            </p>
          )}
        </div>
      </div>
    </td>
    <td className="px-3 py-3 hidden sm:table-cell">
      <div className="flex items-center gap-2">
        <Avatar name={course.instructorName} size={28} />
        <div className="min-w-0">
          <p className="text-sm text-gray-700 truncate max-w-[100px]">{course.instructorName}</p>
          {course.instructorEmail && (
            <p className="text-[10px] text-gray-400 truncate max-w-[100px]">{course.instructorEmail}</p>
          )}
        </div>
      </div>
    </td>
    <td className="px-3 py-3 text-sm text-gray-600 hidden md:table-cell">
      {course.category || '—'}
    </td>
    <td className="px-3 py-3 hidden sm:table-cell">
      <span className="text-sm font-semibold text-gray-800">
        {course.isFree ? 'Free' : formatCurrency(course.price)}
      </span>
    </td>
    <td className="px-3 py-3 hidden lg:table-cell">
      <CourseStatusBadge status={course.status} />
    </td>
    <td className="px-3 py-3 text-sm text-gray-500 hidden xl:table-cell">
      {formatDate(course.createdAt)}
    </td>
    <td className="px-3 py-3 text-right sticky right-0 bg-white/95 backdrop-blur-sm shadow-[-8px_0_15px_-10px_rgba(0,0,0,0.05)]">
      <CourseActionsMenu
        course={course}
        onViewDetails={onViewDetails}
        onApprove={onApprove}
        onReject={onReject}
        onDelete={onDelete}
      />
    </td>
  </motion.tr>
);

const CourseTable = ({
  courses,
  loading,
  error,
  onRetry,
  onViewDetails,
  onApprove,
  onReject,
  onDelete,
  pagination,
  onPageChange,
}) => {
  if (loading) return <TableSkeleton rows={6} columns={6} />;

  if (error) return <ErrorState message={error} onRetry={onRetry} />;

  if (!courses.length) {
    return (
      <EmptyState
        icon={HiOutlineBookOpen}
        title="No courses found"
        description="Try adjusting your search or filter to find what you're looking for."
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Mobile View - Cards */}
      <div className="block lg:hidden p-3">
        {courses.map((course, index) => (
          <CourseMobileCard
            key={course.id}
            course={course}
            onViewDetails={onViewDetails}
            onApprove={onApprove}
            onReject={onReject}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden lg:block flex-1 overflow-x-auto">
        <table className="w-full text-sm table-fixed">
          <thead className="sticky top-0 z-10 bg-white shadow-sm">
            <tr className="border-b border-gray-100 text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
              <th className="px-3 py-3 w-[28%]">Course</th>
              <th className="px-3 py-3 w-[20%] hidden sm:table-cell">Instructor</th>
              <th className="px-3 py-3 w-[15%] hidden md:table-cell">Category</th>
              <th className="px-3 py-3 w-[10%] hidden sm:table-cell">Price</th>
              <th className="px-3 py-3 w-[15%] hidden lg:table-cell">Status</th>
              <th className="px-3 py-3 w-[12%] hidden xl:table-cell">Created</th>
              <th className="px-3 py-3 w-[10%] text-right sticky right-0 bg-white shadow-[-8px_0_15px_-10px_rgba(0,0,0,0.05)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {courses.map((course, index) => (
                <CourseRow
                  key={course.id}
                  course={course}
                  index={index}
                  onViewDetails={onViewDetails}
                  onApprove={onApprove}
                  onReject={onReject}
                  onDelete={onDelete}
                />
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50/50 rounded-b-xl flex-shrink-0">
          <p className="text-xs text-gray-400">
            Showing{' '}
            <span className="font-medium text-gray-600">
              {(pagination.page - 1) * pagination.pageSize + 1}
              –
              {Math.min(pagination.page * pagination.pageSize, pagination.totalCount)}
            </span>{' '}
            of <span className="font-medium text-gray-600">{pagination.totalCount}</span> courses
          </p>
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default CourseTable;