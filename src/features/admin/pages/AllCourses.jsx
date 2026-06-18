// src/features/admin/pages/AllCourses.jsx

import React, { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import CourseFilters from '../components/courses/CourseFilters';
import CourseTable from '../components/courses/CourseTable';
import CourseDetailDrawer from '../components/courses/CourseDetailDrawer';
import RejectCourseModal from '../components/courses/RejectCourseModal';
import useAdminCourses from '../hooks/useAdminCourses';
import useAdminCourseActions from '../hooks/useAdminCourseActions';

const AllCourses = () => {
  const {
    courses,
    loading,
    error,
    status,
    setStatus,
    search,
    setSearch,
    page,
    setPage,
    pagination,
    refetch,
  } = useAdminCourses();

  const { approve, reject, loading: actionLoading, error: actionError, clearError } = useAdminCourseActions();

  const [detailCourseId, setDetailCourseId] = useState(null);
  const [rejectCourse, setRejectCourse] = useState(null);

  const handleApprove = async (course) => {
    const result = await approve(course.id);
    if (result.ok) refetch();
  };

  const handleReject = async (courseId, reason) => {
    const result = await reject(courseId, reason);
    if (result.ok) {
      setRejectCourse(null);
      refetch();
    }
    return result.ok;
  };

  const handleDelete = (course) => {
    // Delete functionality will be implemented when backend endpoint is ready
    if (window.confirm(`Are you sure you want to delete "${course.title}"?`)) {
      console.log('Delete course:', course.id);
      // TODO: Implement delete API call
    }
  };

  return (
    <div>
      <PageHeader
        title="All Courses"
        subtitle="Manage all courses across the platform."
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <CourseFilters
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
        />
        <CourseTable
          courses={courses}
          loading={loading}
          error={error}
          onRetry={refetch}
          onViewDetails={(course) => setDetailCourseId(course.id)}
          onApprove={handleApprove}
          onReject={(course) => setRejectCourse(course)}
          onDelete={handleDelete}
          pagination={pagination}
          onPageChange={setPage}
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

export default AllCourses;