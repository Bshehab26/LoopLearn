// src/features/admin/components/courses/PendingCoursesPanel.jsx
//
// Drives PendingCourses.jsx. Uses GET /api/Admin/courses/pending —
// returns a flat list (no pagination) ordered oldest-first so reviews
// happen in submission order.

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPendingCourses, approveCourse, rejectCourse } from '../../api/admin.api';
import useAdminCourseActions from '../../hooks/useAdminCourseActions';
import CourseStatusBadge from './CourseStatusBadge';
import RejectCourseModal from './RejectCourseModal';
import EmptyState from '../common/EmptyState';
import ErrorState from '../common/ErrorState';
import TableSkeleton from '../common/TableSkeleton';
import Avatar from '../common/Avatar';
import {
  HiOutlineClipboardList,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineEye,
  HiOutlineClock,
} from 'react-icons/hi';

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const fmt = (amount) =>
  amount == null ? '—' : `$${Number(amount).toFixed(2)}`;

const PendingCoursesPanel = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejectModalCourse, setRejectModalCourse] = useState(null);

  const { approve, reject, loading: actionLoading, error: actionError, clearError } = useAdminCourseActions();

  const fetchPending = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getPendingCourses();
      if (res.success) setCourses(res.data || []);
      else setError(res.message || 'Failed to load pending courses.');
    } catch (err) {
      if (err.response?.status === 404) {
        setCourses([]);
      } else {
        setError(err.response?.data?.message || 'Failed to load pending courses.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPending(); }, [fetchPending]);

  const handleApprove = async (course) => {
    const result = await approve(course.id);
    if (result.ok) fetchPending();
  };

  const handleRejectSubmit = async (courseId, reason) => {
    const result = await reject(courseId, reason);
    if (result.ok) { fetchPending(); return true; }
    return false;
  };

  if (loading) return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <TableSkeleton rows={5} columns={5} />
    </div>
  );

  if (error) return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <ErrorState message={error} onRetry={fetchPending} />
    </div>
  );

  if (!courses.length) return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <EmptyState
        icon={HiOutlineClipboardList}
        title="No courses awaiting review"
        description="All submitted courses have been reviewed. Check back later."
      />
    </div>
  );

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Queue info */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-amber-50">
          <HiOutlineClock size={15} className="text-amber-600 flex-shrink-0" />
          <p className="text-xs text-amber-700 font-medium">
            {courses.length} course{courses.length !== 1 ? 's' : ''} awaiting review —
            ordered oldest submission first
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-[11px] uppercase tracking-wide text-gray-400">
                <th className="px-4 py-3 font-medium">Course</th>
                <th className="px-4 py-3 font-medium">Instructor</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Submitted</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-8 rounded bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {course.thumbnailUrl
                          ? <img src={course.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                          : <HiOutlineClipboardList size={13} className="text-gray-400" />}
                      </div>
                      <p className="font-medium text-gray-800 truncate max-w-[180px]">{course.title}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={course.instructorName} size={24} />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-700 truncate">{course.instructorName}</p>
                        <p className="text-[11px] text-gray-400 truncate">{course.instructorEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{course.category}</td>
                  <td className="px-4 py-3 text-xs font-medium text-gray-700">
                    {course.isFree ? 'Free' : fmt(course.price)}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{formatDate(course.submittedForReviewAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => navigate(`/admin/courses/${course.id}`)}
                        title="Full review"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#534AB7] hover:bg-[#EEEDFE]"
                      >
                        <HiOutlineEye size={15} />
                      </button>
                      <button
                        onClick={() => handleApprove(course)}
                        disabled={actionLoading}
                        title="Approve"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50
                          disabled:opacity-40"
                      >
                        <HiOutlineCheckCircle size={15} />
                      </button>
                      <button
                        onClick={() => { clearError(); setRejectModalCourse(course); }}
                        disabled={actionLoading}
                        title="Reject"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50
                          disabled:opacity-40"
                      >
                        <HiOutlineXCircle size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <RejectCourseModal
        open={!!rejectModalCourse}
        onClose={() => setRejectModalCourse(null)}
        course={rejectModalCourse}
        onSubmit={handleRejectSubmit}
        loading={actionLoading}
        error={actionError}
      />
    </>
  );
};

export default PendingCoursesPanel;
