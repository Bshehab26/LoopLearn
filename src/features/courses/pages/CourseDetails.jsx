// src/features/courses/pages/CourseDetails.jsx
//
// FIXES IN THIS VERSION:
//   1. Skeleton: replaced <Loading /> with <CourseDetailsSkeleton /> which
//      mirrors the exact 2-column grid (hero+stats | sidebar | tabs).
//   2. Watch route: handlePlayLesson now navigates to
//      /watch/${courseId}  (the WatchWindow page), with the lessonId passed
//      as ?lesson=<id> so WatchWindow can highlight / auto-play it.
//   3. Reviews: CourseReviews now receives readOnly={true} always —
//      students cannot post a review from the course detail page.
//   4. Instructor: Simplified to only show data that comes from backend
//      (name, avatar, bio) - removed rating, students, courses

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth, useUI } from '../../../store/AppProvider';
import useCourseDetails from '../hooks/useCourseDetails';
import useEnrollment from '../../payment/hooks/useEnrollment';
import useCheckout from '../../payment/hooks/useCheckout';
import CourseHero           from '../components/course-details/CourseHero';
import CoursePurchaseCard   from '../components/course-details/CoursePurchaseCard';
import CourseTabs           from '../components/course-details/CourseTabs';
import CourseOverview       from '../components/course-details/CourseOverview';
import CourseCurriculum     from '../components/course-details/CourseCurriculum';
import CourseReviews        from '../components/course-details/CourseReviews';
import InstructorCard       from '../components/course-details/InstructorCard';
import StickyCTABar         from '../components/course-details/StickyCTABar';
import CourseDetailsSkeleton from '../components/course-details/CourseDetailsSkeleton';
import {
  HiOutlineClock, HiOutlineBookOpen, HiOutlineUserGroup,
  HiOutlineChartBar, HiOutlineCalendar,
} from 'react-icons/hi';

const CourseDetails = () => {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { currency: ctxCurrency } = useUI();
  const currency   = ctxCurrency || import.meta.env.VITE_CURRENCY || '$';
  const { isAuthenticated } = useAuth();

  const {
    course, loading, error,
    isEnrolled, isSaved,
    markEnrolled,
    toggleSave,
    isLessonAccessible,
    refetch,
  } = useCourseDetails(id);

  const { enroll: enrollFreeCourse } = useEnrollment();
  const { startCheckout }            = useCheckout();

  const [activeTab, setActiveTab]           = useState('overview');
  const [isStickyVisible, setIsStickyVisible] = useState(false);
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
      // Instructor data - only what comes from backend
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

  const handleSave = async () => {
    if (!isAuthenticated) {
      handleAuthRequired();
      return;
    }
    await toggleSave();
    refetch();
  };

  const handlePlayLesson = (lesson) => {
    if (!isEnrolled && !lesson.isPreview) {
      document.querySelector('[data-purchase-card]')?.scrollIntoView({
        behavior: 'smooth', block: 'center',
      });
      return;
    }
    navigate(`/watch/${normalisedCourse.id}?lesson=${lesson.id}`);
  };

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

  // Prepare instructor data - only what comes from backend
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
                isSaved={isSaved}
                isAuthenticated={isAuthenticated}
                onAuthRequired={handleAuthRequired}
                onSuccess={() => markEnrolled()}
                onSave={handleSave}
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
    </div>
  );
};

export default CourseDetails;