// src/features/admin/pages/PendingCourses.jsx

import React, { useState, useEffect } from 'react';
import PageHeader from '../components/common/PageHeader';
import CourseTable from '../components/courses/CourseTable';
import CourseDetailDrawer from '../components/courses/CourseDetailDrawer';
import RejectCourseModal from '../components/courses/RejectCourseModal';
import { getPendingCourses } from '../api/admin.api';
import useAdminCourseActions from '../hooks/useAdminCourseActions';

const PendingCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailCourseId, setDetailCourseId] = useState(null);
  const [rejectCourse, setRejectCourse] = useState(null);

  const { approve, reject, loading: actionLoading, error: actionError, clearError } = useAdminCourseActions();

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await getPendingCourses();
      if (res.success) {
        setCourses(res.data || []);
      } else {
        setError(res.message || 'Failed to load pending courses');
      }
    } catch (err) {
      setError(err.message || 'Failed to load pending courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (course) => {
    const result = await approve(course.id);
    if (result.ok) fetchPending();
  };

  const handleReject = async (courseId, reason) => {
    const result = await reject(courseId, reason);
    if (result.ok) {
      setRejectCourse(null);
      fetchPending();
    }
    return result.ok;
  };

  return (
    <div>
      <PageHeader
        title="Pending Reviews"
        subtitle={`${courses.length} course${courses.length !== 1 ? 's' : ''} waiting for approval`}
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <CourseTable
          courses={courses}
          loading={loading}
          error={error}
          onRetry={fetchPending}
          onViewDetails={(course) => setDetailCourseId(course.id)}
          onApprove={handleApprove}
          onReject={(course) => setRejectCourse(course)}
          onDelete={() => {}}
          pagination={{ page: 1, pageSize: 10, totalCount: courses.length, totalPages: 1 }}
          onPageChange={() => {}}
        />
      </div>

      <CourseDetailDrawer
        courseId={detailCourseId}
        open={!!detailCourseId}
        onClose={() => setDetailCourseId(null)}
      />

      <RejectCourseModal
        open={!!rejectCourse}
        onClose={() => { setRejectCourse(null); clearError(); }}
        course={rejectCourse}
        onSubmit={handleReject}
        loading={actionLoading}
        error={actionError}
      />
    </div>
  );
};

export default PendingCourses;