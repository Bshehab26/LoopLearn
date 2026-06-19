// src/features/admin/pages/AdminCourseDetailPage.jsx

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiOutlineTag,
  HiOutlineBookOpen,
  HiOutlineAcademicCap,
  HiOutlineLightBulb,
  HiOutlineClipboardList,
  HiOutlineUsers,
  HiOutlineEye,
  HiOutlineClock,
  HiOutlineInformationCircle,
} from 'react-icons/hi';

import useAdminCourseDetail from '../hooks/useAdminCourseDetail';
import useAdminCourseActions from '../hooks/useAdminCourseActions';
import useAdminCourseReviewHistory from '../hooks/useAdminCourseReviewHistory';
import CourseStatusBadge from '../components/courses/CourseStatusBadge';
import CourseReviewHistory from '../components/courses/CourseReviewHistory';
import CourseSectionAccordion from '../components/courses/CourseSectionAccordion';
import RejectCourseModal from '../components/courses/RejectCourseModal';
import ErrorState from '../components/common/ErrorState';

const fmt = (amount) =>
  amount == null ? '—' : `$${Number(amount).toFixed(2)}`;

const formatDate = (d) =>
  d && d !== '0001-01-01T00:00:00'
    ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '—';

const Section = ({ title, icon: Icon, children, className = '' }) => (
  <div className={className}>
    <div className="flex items-center gap-2.5 mb-3">
      <div className="w-7 h-7 rounded-lg bg-[#EEEDFE] flex items-center justify-center">
        <Icon size={14} className="text-[#534AB7]" />
      </div>
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
    </div>
    {children}
  </div>
);

const InfoCard = ({ title, children, icon: Icon }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
    <div className="flex items-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
      {Icon && <Icon size={15} className="text-[#534AB7]" />}
      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">{title}</h4>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const MetaRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
    <Icon size={14} className="text-gray-400 flex-shrink-0" />
    <span className="text-xs text-gray-500 w-24 flex-shrink-0 font-medium">{label}</span>
    <span className="text-sm font-medium text-gray-800 min-w-0 truncate">{value || '—'}</span>
  </div>
);

const PageSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-8 bg-gray-100 rounded w-1/3" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 h-40" />
        ))}
      </div>
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 h-48" />
        ))}
      </div>
    </div>
  </div>
);

const AdminCourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { course, loading, error, refetch } = useAdminCourseDetail(id);
  const {
    history,
    loading: historyLoading,
    error: historyError,
    refetch: refetchHistory,
  } = useAdminCourseReviewHistory(id);
  const { approve, reject, loading: actionLoading, error: actionError, clearError } = useAdminCourseActions();

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);

  const isPending = course?.status === 'PendingReview';

  const handleApprove = async () => {
    const result = await approve(id);
    if (result.ok) {
      setActionSuccess('Course approved and published successfully.');
      refetch();
      refetchHistory();
    }
  };

  const handleRejectSubmit = async (courseId, reason) => {
    const result = await reject(courseId, reason);
    if (result.ok) {
      setActionSuccess('Course rejected. The instructor has been notified.');
      refetch();
      refetchHistory();
      return true;
    }
    return false;
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <PageSkeleton />
    </div>
  );

  if (error || !course) return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl border border-gray-200">
        <ErrorState message={error || 'Course not found.'} onRetry={refetch} />
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 py-6 space-y-5"
    >
      {/* Back + title */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => navigate(-1)}
          className="mt-0.5 p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-[#534AB7] transition-colors"
        >
          <HiOutlineArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
            <CourseStatusBadge status={course.status} />
          </div>
          {course.subtitle && (
            <p className="text-sm text-gray-500 mt-1">{course.subtitle}</p>
          )}
        </div>
      </div>

      {/* Action success banner */}
      <AnimatePresence>
        {actionSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl px-4 py-3.5"
          >
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <HiOutlineCheckCircle size={18} className="text-green-600" />
            </div>
            <p className="text-sm text-green-700 font-medium flex-1">{actionSuccess}</p>
            <button
              onClick={() => setActionSuccess(null)}
              className="text-green-500 hover:text-green-700 text-xs font-medium"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── LEFT COLUMN: Course content ─────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Thumbnail + description */}
          <InfoCard title="Overview" icon={HiOutlineInformationCircle}>
            <div className="space-y-4">
              {course.thumbnailUrl ? (
                <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-[#EEEDFE] to-purple-50 rounded-xl flex items-center justify-center">
                  <HiOutlineBookOpen size={56} className="text-purple-200" />
                </div>
              )}
              {course.description ? (
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {course.description}
                </p>
              ) : (
                <p className="text-xs text-gray-400 italic">No description provided.</p>
              )}
            </div>
          </InfoCard>

          {/* Learning outcomes */}
          {course.learningOutcomes?.length > 0 && (
            <InfoCard title="Learning Outcomes" icon={HiOutlineLightBulb}>
              <ul className="space-y-2">
                {course.learningOutcomes.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#534AB7] flex-shrink-0" />
                    {typeof item === 'string' ? item : item.description || item.outcome || JSON.stringify(item)}
                  </li>
                ))}
              </ul>
            </InfoCard>
          )}

          {/* Requirements */}
          {course.requirements?.length > 0 && (
            <InfoCard title="Requirements" icon={HiOutlineAcademicCap}>
              <ul className="space-y-2">
                {course.requirements.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    {typeof item === 'string' ? item : item.description || JSON.stringify(item)}
                  </li>
                ))}
              </ul>
            </InfoCard>
          )}

          {/* Tags */}
          {course.tags?.length > 0 && (
            <InfoCard title="Tags" icon={HiOutlineTag}>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gradient-to-r from-[#EEEDFE] to-purple-50 text-[#534AB7] rounded-full text-xs font-medium"
                  >
                    {typeof tag === 'string' ? tag : tag.name}
                  </span>
                ))}
              </div>
            </InfoCard>
          )}

          {/* Course content (sections / lessons / quizzes) */}
          <InfoCard title="Course Content" icon={HiOutlineBookOpen}>
            <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <HiOutlineBookOpen size={12} /> {course.sections?.length ?? 0} sections
              </span>
              <span className="flex items-center gap-1">
                <HiOutlineClipboardList size={12} />
                {course.sections?.reduce((acc, s) => acc + (s.lessons?.length ?? 0), 0) ?? 0} lessons
              </span>
              <span className="flex items-center gap-1">
                <HiOutlineClipboardList size={12} />
                {course.sections?.reduce((acc, s) => acc + (s.quizzes?.length ?? 0), 0) ?? 0} quizzes
              </span>
            </div>
            <CourseSectionAccordion sections={course.sections} />
          </InfoCard>
        </div>

        {/* ── RIGHT COLUMN: Meta + actions + history ──────────────────────── */}
        <div className="space-y-6">

          {/* Action card — only shown for PendingReview */}
          {isPending && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-[#534AB7]/5 to-purple-50 rounded-xl border-2 border-[#534AB7]/20 p-5 space-y-3"
            >
              <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <HiOutlineCheckCircle size={16} className="text-[#534AB7]" />
                Review Decision
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Review all content on the left before making a decision. Rejected courses
                can be fixed and resubmitted by the instructor.
              </p>

              {actionError && (
                <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
                  <span className="flex-1">{actionError}</span>
                  <button onClick={clearError} className="text-red-400 hover:text-red-600">✕</button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                >
                  <HiOutlineCheckCircle size={16} />
                  {actionLoading ? 'Processing…' : 'Approve'}
                </button>
                <button
                  onClick={() => { clearError(); setRejectModalOpen(true); }}
                  disabled={actionLoading}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                >
                  <HiOutlineXCircle size={16} />
                  Reject
                </button>
              </div>
            </motion.div>
          )}

          {/* Course metadata */}
          <InfoCard title="Course Information" icon={HiOutlineInformationCircle}>
            <div>
              <MetaRow icon={HiOutlineCurrencyDollar} label="Price"
                value={course.isFree ? 'Free' : fmt(course.price)} />
              <MetaRow icon={HiOutlineTag} label="Category" value={course.category || '—'} />
              <MetaRow icon={HiOutlineAcademicCap} label="Level" value={course.levelName || course.level || '—'} />
              <MetaRow icon={HiOutlineUsers} label="Students" value={course.enrollmentCount ?? 0} />
              <MetaRow icon={HiOutlineEye} label="Views" value={course.viewCount ?? 0} />
              <MetaRow icon={HiOutlineCalendar} label="Created" value={formatDate(course.createdAt)} />
              {course.submittedForReviewAt && course.submittedForReviewAt !== '0001-01-01T00:00:00' && (
                <MetaRow icon={HiOutlineClock} label="Submitted" value={formatDate(course.submittedForReviewAt)} />
              )}
              {course.publishedAt && course.publishedAt !== '0001-01-01T00:00:00' && (
                <MetaRow icon={HiOutlineCalendar} label="Published" value={formatDate(course.publishedAt)} />
              )}
            </div>
          </InfoCard>

          {/* Instructor info */}
          <InfoCard title="Instructor" icon={HiOutlineUser}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#EEEDFE] to-purple-100 flex items-center justify-center">
                <span className="text-lg font-semibold text-[#534AB7]">
                  {course.instructorName?.charAt(0) || '?'}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{course.instructorName || '—'}</p>
                {course.instructorEmail && (
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <HiOutlineMail size={12} /> {course.instructorEmail}
                  </p>
                )}
              </div>
            </div>
          </InfoCard>

          {/* Review history */}
          <InfoCard title="Review History" icon={HiOutlineClock}>
            <CourseReviewHistory
              history={history}
              loading={historyLoading}
              error={historyError}
            />
          </InfoCard>
        </div>
      </div>

      {/* Reject modal */}
      <RejectCourseModal
        open={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        course={course}
        onSubmit={handleRejectSubmit}
        loading={actionLoading}
        error={actionError}
      />
    </motion.div>
  );
};

export default AdminCourseDetailPage;