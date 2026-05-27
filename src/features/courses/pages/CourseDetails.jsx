/**
 * CourseDetails.jsx
 * Detailed course page showing course information, curriculum, and reviews.
 * Features sticky CTA, tab navigation, lesson accordion, and purchase options.
 * 
 * @module features/courses/pages/CourseDetails
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth, useUI } from '../../../store/AppProvider';
import Loading from '../../../shared/components/Loading';
import Comments from '../components/Comments';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineClock, HiOutlineBookOpen, HiOutlineUserGroup, 
  HiOutlineChartBar, HiOutlineStar, HiOutlineCheckCircle,
  HiOutlineShare, HiOutlineBookmark, HiOutlinePlay,
  HiOutlineChevronDown, HiOutlineChevronUp
} from 'react-icons/hi';
import useCourseDetails from '../hooks/useCourseDetails';

// ============================================================================
// Constants
// ============================================================================

/** Level labels mapping */
const LEVEL_LABELS = { 0: 'Beginner', 1: 'Intermediate', 2: 'Advanced' };

/** Level styling */
const LEVEL_COLORS = {
  Beginner: { bg: '#D1FAE5', color: '#065F46', icon: '🌱' },
  Intermediate: { bg: '#FEF3C7', color: '#92400E', icon: '📈' },
  Advanced: { bg: '#FCE7F3', color: '#9D174D', icon: '🚀' },
};

/** Tab configuration */
const TABS = [
  { id: 'overview', label: 'Overview', icon: HiOutlineBookOpen },
  { id: 'curriculum', label: 'Curriculum', icon: HiOutlinePlay },
  { id: 'reviews', label: 'Reviews', icon: HiOutlineStar },
];

/** Course includes list */
const COURSE_INCLUDES = [
  { icon: '🎬', text: 'On-demand video' },
  { icon: '📝', text: 'Full lifetime access' },
  { icon: '📱', text: 'Access on mobile and TV' },
  { icon: '🎓', text: 'Certificate of completion' },
];

/** Animation variants */
const HERO_ANIMATION = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5 },
};

const CARD_ANIMATION = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, delay: 0.2 },
};

// ============================================================================
// Helper Components
// ============================================================================

/**
 * Shimmer loading component
 */
const Shimmer = ({ style = {} }) => (
  <div style={{ background: '#EEEDFE', borderRadius: 8, overflow: 'hidden', position: 'relative', ...style }}>
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.6) 50%,transparent 100%)', animation: 'shimmer 1.5s infinite' }} />
  </div>
);

/**
 * Course Details Skeleton Loader
 */
const CourseDetailsSkeleton = () => (
  <div className='min-h-screen'>
    <div className='relative w-full px-6 md:px-36 pt-24 md:pt-32 pb-12'>
      <div className='flex md:flex-row flex-col-reverse gap-10 items-start'>
        <div className='flex-1'>
          <Shimmer style={{ height: 24, width: 120, marginBottom: 16 }} />
          <Shimmer style={{ height: 40, width: '80%', marginBottom: 16 }} />
          <Shimmer style={{ height: 60, width: '100%', marginBottom: 20 }} />
          <Shimmer style={{ height: 20, width: 200, marginBottom: 20 }} />
          <div className='flex gap-3 mb-5'>
            <Shimmer style={{ height: 36, width: 36, borderRadius: '50%' }} />
            <Shimmer style={{ height: 36, width: 120 }} />
          </div>
          <div className='flex flex-wrap gap-2'>
            {[1, 2, 3].map((i) => <Shimmer key={i} style={{ height: 32, width: 100, borderRadius: 999 }} />)}
          </div>
        </div>
        <Shimmer style={{ height: 400, width: 320, borderRadius: 16 }} />
      </div>
    </div>
  </div>
);

/**
 * Stars rating component
 */
const Stars = ({ rating, size = 14 }) => (
  <div className='flex gap-0.5'>
    {[1, 2, 3, 4, 5].map((s) => (
      <svg key={s} width={size} height={size} viewBox='0 0 24 24' fill={s <= Math.floor(rating) ? '#F59E0B' : 'none'} stroke='#F59E0B' strokeWidth='2'>
        <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
      </svg>
    ))}
  </div>
);

/**
 * Lesson Item Component with accordion
 */
const LessonItem = ({ lesson, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className='border border-gray-100 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow'
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-full flex items-center justify-between p-4 text-left hover:bg-purple-50/30 transition'
      >
        <div className='flex items-center gap-3 flex-1'>
          <div className='w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-purple-100 text-purple-600'>
            {isOpen ? <HiOutlineChevronUp size={16} /> : <HiOutlineChevronDown size={16} />}
          </div>
          <div className='flex-1'>
            <p className='text-sm font-medium text-gray-800'>{lesson.title || lesson.name}</p>
            {lesson.duration && (
              <p className='text-xs text-gray-400 mt-0.5'>Duration: {typeof lesson.duration === 'number' ? `${lesson.duration} min` : lesson.duration}</p>
            )}
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-xs text-gray-400'>Lesson {lesson.number || index + 1}</span>
            <HiOutlinePlay size={16} className='text-purple-400' />
          </div>
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className='border-t border-gray-100 bg-gray-50/30'
          >
            <div className='p-4 text-sm text-gray-600'>
              {lesson.description || 'No description available for this lesson.'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/**
 * Error State Component
 */
const ErrorState = ({ error, onRetry }) => (
  <div className='min-h-screen flex items-center justify-center'>
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className='text-center'
    >
      <p className='text-6xl mb-4'>😕</p>
      <p className='text-gray-500 mb-4'>{error || 'Course not found'}</p>
      <button
        onClick={onRetry}
        className='px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition'
      >
        Browse Courses
      </button>
    </motion.div>
  </div>
);

/**
 * Breadcrumb Component
 */
const Breadcrumb = ({ courseTitle, navigate }) => (
  <div className='flex items-center gap-2 text-sm text-gray-500 mb-4 flex-wrap'>
    <button onClick={() => navigate('/')} className='hover:text-purple-600 transition'>Home</button>
    <span>/</span>
    <button onClick={() => navigate('/courses')} className='hover:text-purple-600 transition'>Courses</button>
    <span>/</span>
    <span className='text-purple-600'>{courseTitle?.slice(0, 50)}</span>
  </div>
);

/**
 * Badges Component
 */
const Badges = ({ category, levelLabel, levelStyle, featured }) => (
  <div className='flex flex-wrap gap-2 mb-4'>
    <motion.span 
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.1 }}
      className='inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full'
      style={{ background: '#EEEDFE', color: '#534AB7' }}
    >
      {category}
    </motion.span>
    <motion.span 
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.15 }}
      className='inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full'
      style={{ background: levelStyle.bg, color: levelStyle.color }}
    >
      <span>{levelStyle.icon}</span> {levelLabel}
    </motion.span>
    {featured && (
      <motion.span 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className='inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-yellow-100 text-yellow-700'
      >
        ⭐ Featured
      </motion.span>
    )}
  </div>
);

/**
 * Stats Row Component
 */
const StatsRow = ({ stats }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.45 }}
    className='flex flex-wrap gap-3'
  >
    {stats.map((stat, idx) => (
      <div
        key={idx}
        className='flex items-center gap-2 px-3 py-2 rounded-full bg-white shadow-sm border border-gray-100'
        style={stat.customStyle ? { background: stat.customStyle.bg, color: stat.customStyle.color } : {}}
      >
        <stat.icon size={14} />
        <span className='text-sm font-medium'>{stat.value}</span>
      </div>
    ))}
  </motion.div>
);

/**
 * Purchase Card Component
 */
const PurchaseCard = ({ course, currency, isEnrolled, isSaved, onEnroll, onSave, onShare, shareUrl }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  return (
    <div className='rounded-2xl overflow-hidden bg-white shadow-xl border border-gray-100 sticky top-24'>
      {/* Image */}
      <div className='relative w-full aspect-video overflow-hidden bg-gradient-to-br from-purple-100 to-purple-50'>
        {course.thumbnailUrl || course.avatar ? (
          <img src={course.thumbnailUrl || course.avatar} alt={course.title} className='w-full h-full object-cover' />
        ) : (
          <div className='w-full h-full flex items-center justify-center text-6xl'>📚</div>
        )}
        {course.badge && (
          <span className='absolute top-3 left-3 bg-purple-600 text-white text-xs px-2 py-1 rounded-full'>
            {course.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className='p-5'>
        {/* Price */}
        <div className='mb-4'>
          <span className='text-3xl font-bold text-purple-600'>
            {course.isFree ? 'Free' : `${currency}${course.price?.toFixed(2) || '0.00'}`}
          </span>
          {course.originalPrice && course.originalPrice > course.price && (
            <>
              <span className='text-lg text-gray-400 line-through ml-2'>{currency}{course.originalPrice?.toFixed(2)}</span>
              <span className='ml-2 text-sm text-green-600 bg-green-50 px-2 py-0.5 rounded-full'>
                Save {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}%
              </span>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className='space-y-2 mb-4'>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className='w-full py-3 rounded-xl text-white font-semibold text-sm'
            style={{ background: 'linear-gradient(135deg, #534AB7 0%, #3C3489 100%)' }}
            onClick={onEnroll}
          >
            {isEnrolled ? '✓ Already Enrolled' : 'Enroll Now'}
          </motion.button>
          
          <div className='flex gap-2'>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSave}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                isSaved ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <HiOutlineBookmark size={16} />
              Save
            </motion.button>
            
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowShareMenu(!showShareMenu)}
                className='px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition flex items-center gap-2'
              >
                <HiOutlineShare size={16} />
              </motion.button>
              
              <AnimatePresence>
                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className='absolute bottom-full right-0 mb-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden'
                  >
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(shareUrl);
                        setShowShareMenu(false);
                        onShare?.();
                      }}
                      className='w-full px-4 py-2 text-left text-sm hover:bg-purple-50 transition'
                    >
                      Copy Link
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Includes List */}
        <div className='pt-4 border-t border-gray-100'>
          <p className='text-sm font-semibold text-gray-800 mb-3'>This course includes:</p>
          <ul className='space-y-2'>
            {COURSE_INCLUDES.map((item) => (
              <li key={item.text} className='flex items-start gap-2 text-xs text-gray-600'>
                <HiOutlineCheckCircle className='text-purple-500 flex-shrink-0 mt-0.5' size={14} />
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

/**
 * Sticky Mobile CTA Component
 */
const StickyMobileCTA = ({ course, currency, isVisible, onEnroll }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className='fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t border-gray-100 p-4 z-50 lg:hidden'
      >
        <div className='flex items-center justify-between max-w-md mx-auto'>
          <div>
            <span className='text-2xl font-bold text-purple-600'>
              {course.isFree ? 'Free' : `${currency}${course.price?.toFixed(2) || '0.00'}`}
            </span>
            {course.originalPrice && course.originalPrice > course.price && (
              <span className='text-xs text-gray-400 line-through ml-2'>{currency}{course.originalPrice?.toFixed(2)}</span>
            )}
          </div>
          <button
            className='px-6 py-2 bg-purple-600 text-white rounded-full font-medium text-sm'
            onClick={onEnroll}
          >
            Enroll Now
          </button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

/**
 * Tabs Component
 */
const Tabs = ({ activeTab, onTabChange }) => (
  <div className='flex gap-6 border-b border-gray-200 mb-8 overflow-x-auto'>
    {TABS.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className={`pb-3 text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
          activeTab === tab.id 
            ? 'text-purple-600 border-b-2 border-purple-600' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <tab.icon size={16} />
        {tab.label}
      </button>
    ))}
  </div>
);

/**
 * Overview Tab Component
 */
const OverviewTab = ({ course }) => (
  <motion.div
    key='overview'
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className='space-y-8'
  >
    {/* What you'll learn / Learning Outcomes */}
    {(course.learningOutcomes?.length > 0 || course.learningObjectives?.length > 0) && (
      <div>
        <h2 className='text-xl font-semibold text-gray-800 mb-4'>What you'll learn</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          {(course.learningOutcomes || course.learningObjectives || []).map((item, idx) => (
            <div key={idx} className='flex items-start gap-2'>
              <HiOutlineCheckCircle className='text-purple-500 flex-shrink-0 mt-0.5' size={16} />
              <span className='text-sm text-gray-600'>{item}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Description */}
    <div>
      <h2 className='text-xl font-semibold text-gray-800 mb-4'>Description</h2>
      <p className='text-gray-600 leading-relaxed whitespace-pre-wrap'>{course.description}</p>
    </div>

    {/* Requirements */}
    {course.requirements?.length > 0 && (
      <div>
        <h2 className='text-xl font-semibold text-gray-800 mb-4'>Requirements</h2>
        <ul className='list-disc list-inside space-y-1 text-gray-600'>
          {course.requirements.map((req, idx) => (
            <li key={idx} className='text-sm'>{req}</li>
          ))}
        </ul>
      </div>
    )}

    {/* Instructor Bio */}
    <div>
      <h2 className='text-xl font-semibold text-gray-800 mb-4'>Instructor</h2>
      <div className='flex items-start gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100'>
        {course.instructorAvatar ? (
          <img src={course.instructorAvatar} alt='' className='w-16 h-16 rounded-full object-cover' />
        ) : (
          <div className='w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold bg-purple-100 text-purple-600'>
            {course.instructorName?.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div>
          <h3 className='font-semibold text-gray-800 mb-1'>{course.instructorName}</h3>
          <p className='text-sm text-gray-500 leading-relaxed'>
            {course.instructorBio || 'Expert instructor passionate about teaching and helping students succeed.'}
          </p>
        </div>
      </div>
    </div>
  </motion.div>
);

/**
 * Curriculum Tab Component
 */
const CurriculumTab = ({ course }) => {
  const sections = course.sections || [];
  const lessons = course.lessons || [];
  
  // Use sections if available, otherwise use lessons
  const hasSections = sections.length > 0;
  const totalItems = hasSections ? sections.length : lessons.length;
  
  return (
    <motion.div
      key='curriculum'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className='space-y-4'
    >
      <h2 className='text-xl font-semibold text-gray-800 mb-4'>
        Course Curriculum
        <span className='ml-2 text-sm font-normal text-gray-400'>({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
      </h2>
      
      {hasSections ? (
        <div className='space-y-4'>
          {sections.map((section, idx) => (
            <div key={idx} className='border border-gray-100 rounded-xl overflow-hidden'>
              <div className='bg-gray-50 px-4 py-3 border-b border-gray-100'>
                <h3 className='font-medium text-gray-800'>{section.title}</h3>
                <p className='text-xs text-gray-400 mt-1'>{section.lessons?.length || 0} lessons</p>
              </div>
              <div className='divide-y divide-gray-100'>
                {(section.lessons || []).map((lesson, lessonIdx) => (
                  <LessonItem key={lessonIdx} lesson={lesson} index={lessonIdx} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : lessons.length > 0 ? (
        <div className='space-y-3'>
          {lessons.map((lesson, idx) => (
            <LessonItem key={idx} lesson={lesson} index={idx} />
          ))}
        </div>
      ) : (
        <p className='text-center text-gray-500 py-12'>No curriculum available yet.</p>
      )}
    </motion.div>
  );
};

/**
 * Reviews Tab Component
 */
const ReviewsTab = ({ courseId }) => (
  <motion.div
    key='reviews'
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    <Comments courseId={courseId} />
  </motion.div>
);

// ============================================================================
// Main Component
// ============================================================================

/**
 * CourseDetails - Detailed course page
 * @returns {React.ReactElement} Course details page
 */
const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currency } = useUI();  // ✅ Fixed: using useUI instead of AppContext
  const { user, isAuthenticated } = useAuth();  // ✅ Added for enrollment checks
  const { course, loading, error, refetch } = useCourseDetails(id);
  
  // State
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSticky, setIsSticky] = useState(false);
  
  // Refs
  const heroRef = useRef(null);
  
  // Derived values
  const level = course?.level;
  const levelLabel = typeof level === 'number' 
    ? (LEVEL_LABELS[level] ?? 'Unknown') 
    : (typeof level === 'string' ? level : (course?.levelName || 'Beginner'));
  const levelStyle = LEVEL_COLORS[levelLabel] || LEVEL_COLORS['Beginner'] || { bg: '#EEEDFE', color: '#534AB7', icon: '📚' };
  
  // Course stats
  const stats = useMemo(() => {
    const duration = course?.totalDuration || course?.duration;
    const lessonsCount = course?.totalLessons || course?.lessons?.length || 0;
    const sectionsCount = course?.sections?.length || 0;
    
    return [
      { label: 'Duration', value: duration || (course?.duration ? `${Math.floor(course.duration / 60)}h ${course.duration % 60}m` : '—'), icon: HiOutlineClock },
      { label: 'Content', value: sectionsCount > 0 ? `${sectionsCount} sections • ${lessonsCount} lessons` : `${lessonsCount} lessons`, icon: HiOutlineBookOpen },
      { label: 'Students', value: course?.enrollmentCount?.toLocaleString() || course?.students?.toLocaleString() || '0', icon: HiOutlineUserGroup },
      { label: 'Level', value: levelLabel, icon: HiOutlineChartBar, customStyle: levelStyle },
    ];
  }, [course, levelLabel, levelStyle]);
  
  const shareUrl = useMemo(() => window.location.href, []);
  
  // Sticky CTA effect
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        setIsSticky(heroBottom < 0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handlers
  const handleRetry = useCallback(() => {
    navigate('/courses');
  }, [navigate]);
  
  const handleEnroll = useCallback(() => {
    if (!isAuthenticated) {
      navigate('/signin', { state: { from: `/course/${id}` } });
      return;
    }
    setIsEnrolled(true);
    // TODO: Implement enrollment API call when backend is ready
    console.log('[CourseDetails] Enroll in course:', id);
  }, [isAuthenticated, navigate, id]);
  
  const handleSave = useCallback(() => {
    if (!isAuthenticated) {
      navigate('/signin', { state: { from: `/course/${id}` } });
      return;
    }
    setIsSaved(prev => !prev);
    // TODO: Implement save to wishlist API call
    console.log('[CourseDetails] Save course:', id, !isSaved);
  }, [isAuthenticated, navigate, id, isSaved]);
  
  const handleShare = useCallback(() => {
    console.log('[CourseDetails] Course shared:', id);
  }, [id]);
  
  // Loading state
  if (loading) {
    return <CourseDetailsSkeleton />;
  }
  
  // Error state
  if (error || !course) {
    return <ErrorState error={error} onRetry={handleRetry} />;
  }
  
  // Check if user is enrolled (from API or local state)
  const isUserEnrolled = isEnrolled || course.isEnrolled || false;
  
  return (
    <>
      <style>{`
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        .gradient-text { background: linear-gradient(135deg, #534AB7 0%, #3C3489 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .sticky-cta { transition: all 0.3s ease; }
      `}</style>

      {/* Hero Section */}
      <div ref={heroRef} className='relative w-full overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-white opacity-70' />
        <div className='absolute top-20 right-0 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20' />
        <div className='absolute bottom-0 left-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-10' />

        <div className='relative w-full px-6 md:px-36 pt-24 md:pt-32 pb-12'>
          <div className='flex flex-col lg:flex-row gap-10 items-start'>
            
            {/* Left Content */}
            <motion.div {...HERO_ANIMATION} className='flex-1 max-w-3xl'>
              <Breadcrumb courseTitle={course.title} navigate={navigate} />
              <Badges 
                category={course.categoryName || course.category} 
                levelLabel={levelLabel} 
                levelStyle={levelStyle} 
                featured={course.featured} 
              />
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className='text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight mb-4'
              >
                {course.title}
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className='text-base text-gray-600 mb-6 leading-relaxed'
              >
                {course.subtitle || course.description?.slice(0, 200)}
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className='flex items-center gap-3 mb-6 flex-wrap'
              >
                <div className='flex items-center gap-2'>
                  <span className='text-2xl font-bold text-gray-800'>{course.averageRating?.toFixed(1) || '0.0'}</span>
                  <Stars rating={course.averageRating || 0} size={18} />
                </div>
                <span className='text-sm text-purple-600 font-medium'>
                  {course.totalRatings || course.reviews?.length || 0} reviews
                </span>
                <span className='text-gray-300'>|</span>
                <span className='text-sm text-gray-500'>
                  {course.enrollmentCount || course.students || 0} students enrolled
                </span>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className='flex items-center gap-3 mb-6 p-3 rounded-xl bg-white/50 backdrop-blur-sm'
              >
                {course.instructorAvatar ? (
                  <img src={course.instructorAvatar} alt='' className='w-12 h-12 rounded-full object-cover border-2 border-purple-200' />
                ) : (
                  <div className='w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold' style={{ background: '#EEEDFE', color: '#534AB7' }}>
                    {course.instructorName?.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className='text-xs text-gray-400'>Created by</p>
                  <p className='text-base font-semibold text-gray-800'>{course.instructorName}</p>
                </div>
              </motion.div>

              <StatsRow stats={stats} />
            </motion.div>

            {/* Right Card - Purchase */}
            <motion.div {...CARD_ANIMATION} className='w-full lg:w-96 flex-shrink-0'>
              <PurchaseCard 
                course={course}
                currency={currency}
                isEnrolled={isUserEnrolled}
                isSaved={isSaved}
                onEnroll={handleEnroll}
                onSave={handleSave}
                onShare={handleShare}
                shareUrl={shareUrl}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile CTA */}
      <StickyMobileCTA 
        course={course}
        currency={currency}
        isVisible={isSticky && !isUserEnrolled}
        onEnroll={handleEnroll}
      />

      {/* Tabs Section */}
      <div className='px-6 md:px-36 py-12 bg-white'>
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

        <AnimatePresence mode='wait'>
          {activeTab === 'overview' && <OverviewTab course={course} />}
          {activeTab === 'curriculum' && <CurriculumTab course={course} />}
          {activeTab === 'reviews' && <ReviewsTab courseId={course.id} />}
        </AnimatePresence>
      </div>
    </>
  );
};

export default CourseDetails;