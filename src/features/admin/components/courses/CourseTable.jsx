// src/features/admin/components/courses/CourseTable.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CourseStatusBadge from './CourseStatusBadge';
import CourseActionsMenu from './CourseActionsMenu';
import Avatar from '../common/Avatar';
import TableSkeleton from '../common/TableSkeleton';
import EmptyState from '../common/EmptyState';
import ErrorState from '../common/ErrorState';
import Pagination from '../../../../shared/components/Pagination';
import { HiOutlineBookOpen } from 'react-icons/hi';

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '—';
  return `$${Number(amount).toFixed(2)}`;
};

const CourseRow = ({ course, index, onViewDetails, onApprove, onReject, onDelete }) => (
  <motion.tr
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.04, duration: 0.25 }}
    className="border-b border-gray-50 last:border-0 hover:bg-gradient-to-r hover:from-[#EEEDFE]/30 hover:to-transparent transition-colors group"
  >
    <td className="px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-9 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
          {course.thumbnailUrl ? (
            <img src={course.thumbnailUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <HiOutlineBookOpen size={14} className="text-gray-400" />
          )}
        </div>
        <div className="min-w-0">
          <p className="font-medium text-gray-800 truncate text-sm">{course.title}</p>
          {course.subtitle && (
            <p className="text-xs text-gray-400 truncate">{course.subtitle}</p>
          )}
        </div>
      </div>
    </td>
    <td className="px-4 py-3">
      <div className="flex items-center gap-2">
        <Avatar name={course.instructorName} size={28} />
        <div className="min-w-0">
          <p className="text-sm text-gray-700 truncate">{course.instructorName}</p>
          {course.instructorEmail && (
            <p className="text-[10px] text-gray-400 truncate">{course.instructorEmail}</p>
          )}
        </div>
      </div>
    </td>
    <td className="px-4 py-3 text-sm text-gray-600">{course.category || '—'}</td>
    <td className="px-4 py-3">
      <span className="text-sm font-semibold text-gray-800">
        {course.isFree ? 'Free' : formatCurrency(course.price)}
      </span>
    </td>
    <td className="px-4 py-3">
      <CourseStatusBadge status={course.status} />
    </td>
    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(course.createdAt)}</td>
    <td className="px-4 py-3 text-right">
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
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Instructor</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
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

      {pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
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
    </>
  );
};

export default CourseTable;