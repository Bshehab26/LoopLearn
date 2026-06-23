// src/features/admin/components/courses/CourseManagementPanel.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAdminCourses from '../../hooks/useAdminCourses';
import useAdminCourseActions from '../../hooks/useAdminCourseActions';
import CourseFilters from './CourseFilters';
import CourseTable from './CourseTable';
import CourseDetailDrawer from './CourseDetailDrawer';
import RejectCourseModal from './RejectCourseModal';
import { HiOutlineCheckCircle } from 'react-icons/hi';

const CourseManagementPanel = () => {
  const navigate = useNavigate();

  const {
    courses, loading, error,
    status, setStatus,
    search, setSearch,
    statusCounts,
    pagination, setPage,
    refetch,
  } = useAdminCourses();

  const { approve, reject, loading: actionLoading, error: actionError, clearError } = useAdminCourseActions();

  const [drawerCourseId, setDrawerCourseId] = useState(null);
  const [rejectModalCourse, setRejectModalCourse] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const handleApprove = async (course) => {
    const result = await approve(course.id);
    if (result.ok) {
      setToastMessage(`"${course.title}" approved successfully`);
      setTimeout(() => setToastMessage(null), 3000);
      refetch();
    }
  };

  const handleRejectSubmit = async (courseId, reason) => {
    const result = await reject(courseId, reason);
    if (result.ok) {
      refetch();
      return true;
    }
    return false;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toast notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-white rounded-xl shadow-lg border border-green-200 px-4 py-3"
          >
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <HiOutlineCheckCircle size={18} className="text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-800">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
        <CourseFilters
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          statusCounts={statusCounts}
        />
        <div className="flex-1 min-h-0 overflow-y-auto">
          <CourseTable
            courses={courses}
            loading={loading}
            error={error}
            onRetry={refetch}
            onViewDetails={(course) => navigate(`/admin/courses/${course.id}`)}
            onApprove={handleApprove}
            onReject={(course) => { clearError(); setRejectModalCourse(course); }}
            onDelete={() => {}}
            pagination={pagination}
            onPageChange={setPage}
          />
        </div>
      </div>

      <CourseDetailDrawer
        courseId={drawerCourseId}
        open={!!drawerCourseId}
        onClose={() => setDrawerCourseId(null)}
      />

      <RejectCourseModal
        open={!!rejectModalCourse}
        onClose={() => setRejectModalCourse(null)}
        course={rejectModalCourse}
        onSubmit={handleRejectSubmit}
        loading={actionLoading}
        error={actionError}
      />
    </div>
  );
};

export default CourseManagementPanel;