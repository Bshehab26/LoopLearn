// src/features/admin/pages/AdminCourseDetailPage.jsx

import React, { useState, useEffect } from 'react';
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
  HiOutlineClock,
  HiOutlineInformationCircle,
  HiOutlinePlay,
  HiOutlineQuestionMarkCircle,
  HiOutlineExclamationCircle,
} from 'react-icons/hi';

import { getAdminCourseById } from '../api/admin.api';
import useAdminCourseActions from '../hooks/useAdminCourseActions';
import useAdminCourseReviewHistory from '../hooks/useAdminCourseReviewHistory';
import CourseStatusBadge from '../components/courses/CourseStatusBadge';
import CourseReviewHistory from '../components/courses/CourseReviewHistory';
import RejectCourseModal from '../components/courses/RejectCourseModal';
import ErrorState from '../components/common/ErrorState';
import Avatar from '../components/common/Avatar';

const fmt = (amount) =>
  amount == null ? '—' : `$${Number(amount).toFixed(2)}`;

const formatDate = (d) => {
  if (!d) return '—';
  try {
    const date = new Date(d);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  } catch (e) {
    return '—';
  }
};

const InfoCard = ({ title, children, icon: Icon, className = '' }) => (
  <div className={`bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden ${className}`}>
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

// Process items from the backend structure
const processSectionItems = (items) => {
  const lessons = [];
  const quizzes = [];

  if (!items || !Array.isArray(items)) {
    return { lessons, quizzes };
  }

  items.forEach(item => {
    if (item.type === 'Lesson' && item.lesson) {
      lessons.push(item.lesson);
    } else if (item.type === 'Quiz' && item.quiz) {
      quizzes.push(item.quiz);
    }
  });

  return { lessons, quizzes };
};

// Section Accordion Component
const SectionAccordion = ({ sections }) => {
  const [expandedSections, setExpandedSections] = useState({});

  // Auto-expand sections that have content
  useEffect(() => {
    if (sections) {
      const initialExpanded = {};
      sections.forEach((section, index) => {
        const { lessons, quizzes } = processSectionItems(section.items);
        const hasContent = lessons.length > 0 || quizzes.length > 0;
        if (hasContent && !Object.values(expandedSections).some(v => v)) {
          initialExpanded[section.id] = true;
        }
      });
      if (sections.length > 0 && !Object.keys(initialExpanded).length) {
        initialExpanded[sections[0].id] = true;
      }
      setExpandedSections(initialExpanded);
    }
  }, [sections]);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  if (!sections || sections.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
          <HiOutlineBookOpen size={24} className="text-gray-300" />
        </div>
        <p className="text-sm text-gray-400">No sections added yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sections.map((section, index) => {
        const isExpanded = expandedSections[section.id] || false;
        const { lessons, quizzes } = processSectionItems(section.items);
        const lessonCount = lessons.length;
        const quizCount = quizzes.length;
        const totalItems = lessonCount + quizCount;
        const hasContent = totalItems > 0;

        return (
          <div key={section.id} className={`border rounded-xl overflow-hidden ${hasContent ? 'border-gray-300' : 'border-gray-200'}`}>
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.id)}
              className={`w-full flex items-center justify-between px-4 py-3 transition-colors ${
                hasContent ? 'bg-gray-50 hover:bg-gray-100' : 'bg-gray-50/50 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#534AB7] bg-[#EEEDFE] px-2 py-1 rounded">
                  {index + 1}
                </span>
                <div className="text-left">
                  <h5 className="text-sm font-semibold text-gray-800">{section.title}</h5>
                  <p className="text-xs text-gray-400">
                    {lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'} · {quizCount} {quizCount === 1 ? 'quiz' : 'quizzes'}
                    {!hasContent && (
                      <span className="ml-2 text-amber-500">(empty)</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{totalItems} items</span>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Section Content */}
            {isExpanded && (
              <div className="p-4 space-y-3 bg-white">
                {!hasContent ? (
                  <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-4 py-3 rounded-lg">
                    <HiOutlineExclamationCircle size={18} />
                    <span>This section has no lessons or quizzes yet.</span>
                  </div>
                ) : (
                  <>
                    {/* Lessons */}
                    {lessonCount > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                          <HiOutlinePlay size={12} />
                          Lessons ({lessonCount})
                        </p>
                        {lessons.map((lesson, idx) => (
                          <div key={lesson.id} className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                            <HiOutlinePlay size={14} className="text-[#534AB7]" />
                            <span className="text-sm text-gray-700 flex-1">{idx + 1}. {lesson.title}</span>
                            {lesson.duration && (
                              <span className="text-xs text-gray-400">{lesson.duration}</span>
                            )}
                            {lesson.isPreview && (
                              <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">Preview</span>
                            )}
                            {lesson.videoUrl && (
                              <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Has Video</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quizzes */}
                    {quizCount > 0 && (
                      <div className="space-y-1 mt-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                          <HiOutlineQuestionMarkCircle size={12} />
                          Quizzes ({quizCount})
                        </p>
                        {quizzes.map((quiz, idx) => (
                          <div key={quiz.id} className="flex items-center gap-3 px-3 py-2 bg-amber-50 rounded-lg hover:bg-amber-100 transition">
                            <HiOutlineQuestionMarkCircle size={14} className="text-amber-600" />
                            <span className="text-sm text-gray-700 flex-1">{idx + 1}. {quiz.title}</span>
                            <span className="text-xs text-gray-400">{quiz.questions?.length || 0} questions</span>
                            {quiz.passingScore && (
                              <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Pass: {quiz.passingScore}%</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

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

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [instructor, setInstructor] = useState(null);
  
  const {
    history,
    loading: historyLoading,
    error: historyError,
    refetch: refetchHistory,
  } = useAdminCourseReviewHistory(id);
  const { approve, reject, loading: actionLoading, error: actionError, clearError } = useAdminCourseActions();

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminCourseById(id);
      
      console.log('[AdminCourseDetailPage] Raw API response:', res);
      
      if (res.success && res.data) {
        let courseData = null;
        let instructorData = null;
        
        // Handle different response structures
        if (res.data.courseDetails) {
          courseData = res.data.courseDetails;
          instructorData = res.data.instructorDetails || null;
        } else if (res.data.CourseDetails) {
          courseData = res.data.CourseDetails;
          instructorData = res.data.InstructorDetails || null;
        } else {
          courseData = res.data;
        }
        
        console.log('[AdminCourseDetailPage] Course Data:', courseData);
        console.log('[AdminCourseDetailPage] Sections:', courseData?.sections);
        
        setCourse(courseData);
        setInstructor(instructorData);
      } else {
        setError(res.message || 'Failed to load course details.');
      }
    } catch (err) {
      console.error('[AdminCourseDetailPage] Error:', err);
      setError(err.message || 'Failed to load course details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCourseData();
    }
  }, [id]);

  const isPending = course?.status === 'PendingReview';

  const handleApprove = async () => {
    const result = await approve(id);
    if (result.ok) {
      setActionSuccess('Course approved and published successfully.');
      await fetchCourseData();
      refetchHistory();
    }
  };

  const handleRejectSubmit = async (courseId, reason) => {
    const result = await reject(courseId, reason);
    if (result.ok) {
      setActionSuccess('Course rejected. The instructor has been notified.');
      await fetchCourseData();
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
        <ErrorState message={error || 'Course not found.'} onRetry={fetchCourseData} />
      </div>
    </div>
  );

  const instructorName = instructor?.fullName || instructor?.FullName || course?.instructorName || 'Unknown';
  const instructorEmail = instructor?.email || instructor?.Email;
  const instructorUsername = instructor?.userName || instructor?.UserName;
  const instructorAvatar = instructor?.profileImageUrl || instructor?.ProfileImageUrl;

  // Calculate totals from the items structure
  const sections = course.sections || [];
  let totalLessons = 0;
  let totalQuizzes = 0;
  
  sections.forEach(section => {
    if (section.items && Array.isArray(section.items)) {
      section.items.forEach(item => {
        if (item.type === 'Lesson') totalLessons++;
        else if (item.type === 'Quiz') totalQuizzes++;
      });
    }
  });

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

          {/* Overview */}
          <InfoCard title="Overview" icon={HiOutlineInformationCircle}>
            <div className="space-y-4">
              {course.thumbnailUrl ? (
                <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-[#EEEDFE] to-purple-50 rounded-xl flex items-center justify-center">
                  <HiOutlineBookOpen size={56} className="text-purple-200" />
                </div>
              )}
              {course.description && (
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {course.description}
                </p>
              )}
            </div>
          </InfoCard>

          {/* Learning Outcomes */}
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

          {/* Course Content */}
          <InfoCard title="Course Content" icon={HiOutlineBookOpen}>
            <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <HiOutlineClipboardList size={12} /> {sections.length} sections
              </span>
              <span className="flex items-center gap-1">
                <HiOutlinePlay size={12} /> {totalLessons} lessons
              </span>
              <span className="flex items-center gap-1">
                <HiOutlineQuestionMarkCircle size={12} /> {totalQuizzes} quizzes
              </span>
            </div>
            <SectionAccordion sections={sections} />
          </InfoCard>
        </div>

        {/* ── RIGHT COLUMN: Meta + actions + history ──────────────────────── */}
        <div className="space-y-6">

          {/* Action card */}
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
                Review all content above before making a decision. Rejected courses
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

          {/* Course Information */}
          <InfoCard title="Course Information" icon={HiOutlineInformationCircle}>
            <div>
              <MetaRow icon={HiOutlineCurrencyDollar} label="Price"
                value={course.isFree ? 'Free' : fmt(course.price)} />
              <MetaRow icon={HiOutlineTag} label="Category" value={course.category || '—'} />
              <MetaRow icon={HiOutlineAcademicCap} label="Level" value={course.level || '—'} />
              <MetaRow icon={HiOutlineCalendar} label="Created" value={formatDate(course.createdAt)} />
              {course.submittedForReviewAt && course.submittedForReviewAt !== '0001-01-01T00:00:00' && (
                <MetaRow icon={HiOutlineClock} label="Submitted" value={formatDate(course.submittedForReviewAt)} />
              )}
              {course.publishedAt && course.publishedAt !== '0001-01-01T00:00:00' && (
                <MetaRow icon={HiOutlineCalendar} label="Published" value={formatDate(course.publishedAt)} />
              )}
            </div>
          </InfoCard>

          {/* Instructor */}
          <InfoCard title="Instructor" icon={HiOutlineUser}>
            <div className="flex items-center gap-3">
              <Avatar 
                name={instructorName} 
                imageUrl={instructorAvatar}
                size={48}
              />
              <div>
                <p className="text-sm font-semibold text-gray-800">{instructorName}</p>
                {instructorEmail && (
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <HiOutlineMail size={12} /> {instructorEmail}
                  </p>
                )}
                {instructorUsername && (
                  <p className="text-xs text-gray-400">@{instructorUsername}</p>
                )}
              </div>
            </div>
          </InfoCard>

          {/* Review History */}
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