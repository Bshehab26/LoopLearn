// src/features/admin/components/courses/CourseTable.jsx

import React from 'react';
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
        description="Try a different search term or status filter."
      />
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-[11px] uppercase tracking-wide text-gray-400">
              <th className="px-4 py-3 font-medium">Course</th>
              <th className="px-4 py-3 font-medium">Instructor</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-8 rounded bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {course.thumbnailUrl ? (
                        <img src={course.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <HiOutlineBookOpen size={14} className="text-gray-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 truncate">{course.title}</p>
                      <p className="text-xs text-gray-400 truncate">{course.subtitle || 'No subtitle'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar name={course.instructorName} size={24} />
                    <span className="text-sm text-gray-600">{course.instructorName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{course.category}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-700">
                  {course.isFree ? 'Free' : formatCurrency(course.price)}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing{' '}
            <span className="font-medium text-gray-600">
              {(pagination.page - 1) * pagination.pageSize + 1}
              –
              {Math.min(pagination.page * pagination.pageSize, pagination.totalCount)}
            </span>{' '}
            of <span className="font-medium text-gray-600">{pagination.totalCount}</span>
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