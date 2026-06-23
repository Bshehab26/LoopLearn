// src/features/courses/pages/CourseDetails.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth, useUI } from '../../../store/AppProvider';
import useCourseDetails from '../hooks/useCourseDetails';
import useEnrollment from '../../payment/hooks/useEnrollment';
import useCheckout from '../../payment/hooks/useCheckout';
import CourseHero            from '../components/course-details/CourseHero';
import CoursePurchaseCard    from '../components/course-details/CoursePurchaseCard';
import CourseTabs            from '../components/course-details/CourseTabs';
import CourseOverview        from '../components/course-details/CourseOverview';
import CourseCurriculum      from '../components/course-details/CourseCurriculum';
import CourseReviews         from '../components/course-details/CourseReviews';
import InstructorCard        from '../components/course-details/InstructorCard';
import StickyCTABar          from '../components/course-details/StickyCTABar';
import CourseDetailsSkeleton from '../components/course-details/CourseDetailsSkeleton';
import VideoPlayer           from '../components/VideoPlayer';
import {
  HiOutlineClock, HiOutlineBookOpen, HiOutlineUserGroup,
  HiOutlineChartBar, HiOutlineCalendar, HiX,
  HiPlay, HiLockClosed, HiOutlinePlay
} from 'react-icons/hi';

// ── Preview modal — plays a single preview lesson inline on this page ────────
const PreviewModal = ({ lesson, onClose, onEnroll }) => {
  // Close on Escape key
  useEffect(() => {
    if (!lesson) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lesson, onClose]);

  if (!lesson) return null;

  const videoUrl = lesson.videoURL || lesson.videoUrl || null;
  const hasVideo = !!videoUrl;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={(e) => { 
          // Only close if clicking the backdrop itself
          if (e.target === e.currentTarget) onClose(); 
        }}
        // CRITICAL: Stop all events from propagating to the backdrop
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.94, opacity: 0 }}
          transition={{ type: 'tween', duration: 0.18 }}
          className="relative w-full max-w-3xl bg-[#0f0f0f] rounded-2xl overflow-hidden shadow-2xl"
          // Stop all events from bubbling up to the backdrop
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#534AB7] bg-[#EEEDFE] px-2 py-0.5 rounded-full flex-shrink-0">
                Preview
              </span>
              <p className="text-sm font-medium text-white truncate">{lesson.title}</p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 ml-3 p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition"
              aria-label="Close preview"
            >
              <HiX size={18} />
            </button>
          </div>

          {hasVideo ? (
            // Has video URL - show the player with complete event isolation
            <div 
              className="w-full"
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <VideoPlayer
                lecture={{ ...lesson, videoUrl: videoUrl }}
                onComplete={onClose}
                isCompleted={false}
                onNext={onClose}
                onProgress={() => {}}
              />
            </div>
          ) : (
            // No video URL - show fallback UI
            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center p-8">
              <div className="w-20 h-20 bg-purple-600/20 rounded-full flex items-center justify-center mb-4">
                <HiPlay className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Preview Coming Soon
              </h3>
              <p className="text-gray-400 text-center max-w-md mb-6">
                This lesson preview is currently being prepared. 
                Check back later or enroll to get full access to all course content!
              </p>
              <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-6">
                <div className="bg-white/5 rounded-lg p-3 text-center border border-white/10">
                  <span className="text-xs text-gray-400">Duration</span>
                  <p className="font-medium text-white">
                    {lesson.duration || lesson.Duration || 5} min
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center border border-white/10">
                  <span className="text-xs text-gray-400">Status</span>
                  <p className="font-medium text-purple-400 flex items-center justify-center gap-1">
                    <HiLockClosed size={14} />
                    Preview Only
                  </p>
                </div>
              </div>
              <button
                onClick={onEnroll}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-600/30 transition-all hover:scale-105"
              >
                Enroll to Unlock Full Course
              </button>
              <button
                onClick={onClose}
                className="mt-4 text-gray-400 hover:text-white text-sm transition"
              >
                Close Preview
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ── Main Component ──────────────────────────────────────────────────────────

const CourseDetails = () => {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { currency: ctxCurrency } = useUI();
  const currency   = ctxCurrency || import.meta.env.VITE_CURRENCY || '$';
  const { isAuthenticated } = useAuth();

  const {
    course, loading, error,
    isEnrolled, markEnrolled,
    isLessonAccessible,
    refetch,
  } = useCourseDetails(id);

  const { enroll: enrollFreeCourse } = useEnrollment();
  const { startCheckout }            = useCheckout();

  const [activeTab, setActiveTab]             = useState('overview');
  const [isStickyVisible, setIsStickyVisible] = useState(false);
  const [previewLesson, setPreviewLesson]     = useState(null);
  const heroRef = useRef(null);

  // ── Normalise course data ─────────────────────────────────────────────────
  const normalisedCourse = React.useMemo(() => {
    if (!course) return null;
    return {
      ...course,
      levelName:       course.levelName || course.level || 'Beginner',
      lastUpdated:     course.lastUpdated || course.updatedAt || course.createdAt,
      totalLessons:    course.totalLessons
        ?? (course.sections?.reduce((s, sec) => s + (sec.lessons?.length || 0), 0) ?? 0),
      enrollmentCount: course.enrollmentCount ?? 0,
      averageRating:   Number(course.averageRating ?? 0),
      totalRatings:    course.totalRatings ?? course.feedbacks?.length ?? 0,
      instructorId: course.instructorId,
      instructorName: course.instructorName,
      instructorBio: course.instructorBio,
      instructorProfileImageUrl: course.instructorProfileImageUrl,
    };
  }, [course]);

  // ── Stats strip ───────────────────────────────────────────────────────────
  const stats = React.useMemo(() => {
    if (!normalisedCourse) return [];
    const sc = normalisedCourse.sections?.length ?? normalisedCourse.sectionCount ?? 0;
    return [
      { icon: HiOutlineClock,     value: normalisedCourse.totalDuration || '—', label: 'Duration' },
      { icon: HiOutlineBookOpen,  value: `${sc} sections · ${normalisedCourse.totalLessons} lessons`, label: 'Content' },
      { icon: HiOutlineUserGroup, value: normalisedCourse.enrollmentCount?.toLocaleString() || '0', label: 'Students' },
      { icon: HiOutlineChartBar,  value: normalisedCourse.levelName, label: 'Level' },
      {
        icon: HiOutlineCalendar,
        value: normalisedCourse.lastUpdated
          ? new Date(normalisedCourse.lastUpdated).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          : '—',
        label: 'Updated',
      },
    ];
  }, [normalisedCourse]);

  // ── Sticky CTA visibility ─────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setIsStickyVisible(rect.bottom < 0 && !isEnrolled);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [isEnrolled]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleAuthRequired = () =>
    navigate('/signin', { state: { from: `/course/${id}` } });

  const handleQuickEnroll = async () => {
    if (!isAuthenticated) {
      handleAuthRequired();
      return;
    }
    if (normalisedCourse.isFree) {
      const result = await enrollFreeCourse(normalisedCourse.id);
      if (result.ok) markEnrolled();
    } else {
      await startCheckout(normalisedCourse.id);
    }
  };

  const handlePlayLesson = useCallback((lesson) => {
    if (isEnrolled) {
      navigate(`/watch/${normalisedCourse.id}?lesson=${lesson.id}`);
      return;
    }

    if (lesson.isPreview) {
      setPreviewLesson(lesson);
      return;
    }

    document.querySelector('[data-purchase-card]')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [isEnrolled, normalisedCourse, navigate]);

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) return <CourseDetailsSkeleton />;

  if (error || !normalisedCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">😕</p>
          <p className="text-gray-500 mb-4">{error || 'Course not found'}</p>
          <button
            onClick={() => navigate('/courses')}
            className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  const instructorData = {
    instructorName: normalisedCourse.instructorName,
    instructorBio: normalisedCourse.instructorBio,
    instructorProfileImageUrl: normalisedCourse.instructorProfileImageUrl,
    instructorId: normalisedCourse.instructorId,
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_24rem] gap-6 lg:gap-8">

          {/* col-1 row-1: Hero + stats */}
          <div
            ref={heroRef}
            className="order-1 lg:order-none lg:col-start-1 lg:row-start-1
              bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6"
          >
            <CourseHero course={normalisedCourse} />
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-6">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100"
                >
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <stat.icon size={14} className="text-purple-600" />
                    <span className="text-xs font-medium text-gray-700">{stat.value}</span>
                  </div>
                  <div className="text-[10px] text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* col-2 row-1+2: Purchase card — sticky sidebar */}
          <div
            data-purchase-card
            className="order-2 lg:order-none lg:col-start-2 lg:row-start-1 lg:row-span-2"
          >
            <div className="lg:sticky lg:top-24">
              <CoursePurchaseCard
                course={normalisedCourse}
                currency={currency}
                isEnrolled={isEnrolled}
                isAuthenticated={isAuthenticated}
                onAuthRequired={handleAuthRequired}
                onSuccess={() => markEnrolled()}
                onShare={() => {}}
              />
            </div>
          </div>

          {/* col-1 row-2: Tabs + content */}
          <div
            className="order-3 lg:order-none lg:col-start-1 lg:row-start-2
              bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6"
          >
            <CourseTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="mt-6">
              {activeTab === 'overview' && (
                <CourseOverview course={normalisedCourse} />
              )}
              {activeTab === 'curriculum' && (
                <CourseCurriculum
                  course={normalisedCourse}
                  isEnrolled={isEnrolled}
                  isLessonAccessible={isLessonAccessible}
                  onPlayLesson={handlePlayLesson}
                />
              )}
              {activeTab === 'reviews' && (
                <CourseReviews
                  courseId={normalisedCourse.id}
                  readOnly={true}
                />
              )}
              {activeTab === 'instructor' && (
                <InstructorCard instructor={instructorData} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <StickyCTABar
        course={normalisedCourse}
        currency={currency}
        isVisible={isStickyVisible && !isEnrolled}
        isEnrolled={isEnrolled}
        isAuthenticated={isAuthenticated}
        onAuthRequired={handleAuthRequired}
        onSuccess={() => markEnrolled()}
      />

      {/* Inline preview player */}
      <PreviewModal
        lesson={previewLesson}
        onClose={() => setPreviewLesson(null)}
        onEnroll={handleQuickEnroll}
      />
    </div>
  );
};

export default CourseDetails;