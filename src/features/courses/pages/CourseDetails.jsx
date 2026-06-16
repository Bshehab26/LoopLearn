// src/features/courses/pages/CourseDetails.jsx
//
// CHANGED:
//   • handleEnroll removed — CoursePurchaseCard now uses EnrollButton internally
//   • CoursePurchaseCard now receives onAuthRequired + onSuccess instead of onEnroll
//   • StickyCTABar still receives onEnroll (it has its own simple button)
//   • All other logic unchanged

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth, useUI } from '../../../store/AppProvider';
import useCourseDetails from '../hooks/useCourseDetails';
import CourseHero       from '../components/course-details/CourseHero';
import CoursePurchaseCard from '../components/course-details/CoursePurchaseCard';
import CourseTabs       from '../components/course-details/CourseTabs';
import CourseOverview   from '../components/course-details/CourseOverview';
import CourseCurriculum from '../components/course-details/CourseCurriculum';
import CourseReviews    from '../components/course-details/CourseReviews';
import InstructorCard   from '../components/course-details/InstructorCard';
import StickyCTABar     from '../components/course-details/StickyCTABar';
import Loading          from '../../../shared/components/Loading';
import {
  HiOutlineClock, HiOutlineBookOpen, HiOutlineUserGroup,
  HiOutlineChartBar, HiOutlineCalendar,
} from 'react-icons/hi';

const CourseDetails = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { currency: ctxCurrency } = useUI();
  const currency     = ctxCurrency || import.meta.env.VITE_CURRENCY || '$';
  const { isAuthenticated } = useAuth();

  const {
    course, loading, error,
    isEnrolled, isSaved,
    enrollInCourse,   // kept for StickyCTABar fallback
    toggleSave,
    isLessonAccessible,
    refetch,
  } = useCourseDetails(id);

  const [activeTab, setActiveTab]           = useState('overview');
  const [isStickyVisible, setIsStickyVisible] = useState(false);
  const heroRef = useRef(null);

  // ── Normalise course data ───────────────────────────────────────────────────
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
    };
  }, [course]);

  // ── Stats strip ─────────────────────────────────────────────────────────────
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

  // ── Sticky CTA ──────────────────────────────────────────────────────────────
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

  // ── Handlers ────────────────────────────────────────────────────────────────

  // Used by StickyCTABar (simple button, not EnrollButton)
  const handleStickyEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/signin', { state: { from: `/course/${id}` } });
      return;
    }
    const r = await enrollInCourse();
    if (r?.success) refetch();
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate('/signin', { state: { from: `/course/${id}` } });
      return;
    }
    await toggleSave();
    refetch();
  };

  const handlePlayLesson = (lesson) => {
    if (!isEnrolled && !lesson.isPreview) {
      alert('Please enroll to access this lesson');
      return;
    }
    navigate(`/watch/${normalisedCourse.id}/lesson/${lesson.id}`);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  if (loading) return <Loading />;

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

  return (
    <>
      {/* ── Hero Section ─────────────────────────────────────────────────────── */}
      <div ref={heroRef} className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Left — hero content + stats */}
            <div className="flex-1 min-w-0">
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

            {/* Right — purchase card (sticky) */}
            <div className="lg:w-96 flex-shrink-0">
              <div className="sticky top-24">
                <CoursePurchaseCard
                  course={normalisedCourse}
                  currency={currency}
                  isEnrolled={isEnrolled}
                  isSaved={isSaved}
                  isAuthenticated={isAuthenticated}
                  // ── NEW: EnrollButton props ──────────────────────────────
                  onAuthRequired={() =>
                    navigate('/signin', { state: { from: `/course/${id}` } })
                  }
                  onSuccess={() => refetch()}
                  // ── Legacy: save / share ─────────────────────────────────
                  onSave={handleSave}
                  onShare={() => {}}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs Section ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              isEnrolled={isEnrolled}
              onEnroll={handleStickyEnroll}
              isAuthenticated={isAuthenticated}
            />
          )}
          {activeTab === 'instructor' && (
            <InstructorCard
              instructorName={normalisedCourse.instructorName}
              instructorBio={normalisedCourse.instructorBio}
              instructorRating={normalisedCourse.instructorRating}
              instructorStudents={normalisedCourse.instructorStudents}
              instructorCourses={normalisedCourse.instructorCourses}
            />
          )}
        </div>
      </div>

      {/* ── Sticky Mobile CTA ────────────────────────────────────────────────── */}
      <StickyCTABar
        course={normalisedCourse}
        currency={currency}
        isVisible={isStickyVisible && !isEnrolled}
        isEnrolled={isEnrolled}
        onEnroll={handleStickyEnroll}
      />
    </>
  );
};

export default CourseDetails;