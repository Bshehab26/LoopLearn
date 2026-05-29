/**
 * WatchWindow.jsx
 * Video player page for watching course lectures with progress tracking.
 * Features chapter navigation, lecture completion tracking, and video player.
 * 
 * @module features/courses/pages/WatchWindow
 */

import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth, useUI } from '../../../store/AppProvider';
import { getCourseById } from '../api/course.api';
import YouTube from 'react-youtube';
import Comments from '../components/Comments';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineCheckCircle, HiOutlinePlay, HiOutlineClock, 
  HiOutlineChevronDown, HiOutlineChevronUp, HiOutlineFlag,
  HiOutlineBookOpen, HiOutlineUserGroup, HiOutlineChartBar
} from 'react-icons/hi';

// ============================================================================
// Constants
// ============================================================================

/** YouTube URL regex patterns */
const YOUTUBE_REGEX = /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/)([^"&?\/\s]{11})/;

/** Mock course data for development (remove when backend is ready) */
const MOCK_COURSE_DATA = {
  id: 1,
  title: 'React Masterclass: From Zero to Hero',
  description: 'Learn React.js from scratch with hands-on projects and real-world examples.',
  instructorName: 'Jane Smith',
  instructorAvatar: null,
  sections: [
    {
      id: 1,
      title: 'Getting Started with React',
      order: 1,
      lessons: [
        { id: 1, title: 'Introduction to React', duration: '12:30', isPreview: true, videoUrl: 'https://youtu.be/dQw4w9WgXcQ', description: 'Welcome to the course! In this lesson, we\'ll cover what React is and why you should learn it.' },
        { id: 2, title: 'Setting Up Development Environment', duration: '15:45', isPreview: true, videoUrl: 'https://youtu.be/dQw4w9WgXcQ', description: 'Learn how to set up Node.js, npm, and your favorite code editor.' },
        { id: 3, title: 'Your First React Component', duration: '18:20', isPreview: false, videoUrl: 'https://youtu.be/dQw4w9WgXcQ', description: 'Create your first React component and understand the basics.' },
      ]
    },
    {
      id: 2,
      title: 'React Fundamentals',
      order: 2,
      lessons: [
        { id: 4, title: 'JSX Deep Dive', duration: '22:15', isPreview: false, videoUrl: 'https://youtu.be/dQw4w9WgXcQ', description: 'Understand JSX syntax and how it works behind the scenes.' },
        { id: 5, title: 'Components & Props', duration: '25:30', isPreview: false, videoUrl: 'https://youtu.be/dQw4w9WgXcQ', description: 'Learn about component composition and passing data with props.' },
        { id: 6, title: 'State Management', duration: '30:00', isPreview: false, videoUrl: 'https://youtu.be/dQw4w9WgXcQ', description: 'Master useState hook and manage component state.' },
      ]
    },
    {
      id: 3,
      title: 'Advanced Concepts',
      order: 3,
      lessons: [
        { id: 7, title: 'useEffect Hook', duration: '28:45', isPreview: false, videoUrl: 'https://youtu.be/dQw4w9WgXcQ', description: 'Handle side effects with the useEffect hook.' },
        { id: 8, title: 'Context API', duration: '35:20', isPreview: false, videoUrl: 'https://youtu.be/dQw4w9WgXcQ', description: 'Manage global state with Context API.' },
        { id: 9, title: 'React Router', duration: '42:10', isPreview: false, videoUrl: 'https://youtu.be/dQw4w9WgXcQ', description: 'Implement navigation with React Router.' },
      ]
    }
  ]
};

/** Animation durations */
const ANIMATION_DURATION = {
  PROGRESS_BAR: 500,
  SECTION_TOGGLE: 300,
  CONTAINER_FADE: 400,
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Extracts YouTube video ID from URL
 * @param {string} url - YouTube video URL
 * @returns {string|null} YouTube video ID or null
 */
const getYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(YOUTUBE_REGEX);
  return match ? match[1] : null;
};

/**
 * Formats duration in seconds or minutes to human readable string
 * @param {string|number} duration - Duration value
 * @returns {string} Formatted duration
 */
const formatDuration = (duration) => {
  if (!duration) return '—';
  
  // If it's a string like "12:30" (MM:SS)
  if (typeof duration === 'string' && duration.includes(':')) {
    return duration;
  }
  
  // If it's minutes
  if (typeof duration === 'number' && duration < 120) {
    return `${duration} min`;
  }
  
  // If it's minutes > 120 (convert to hours)
  if (typeof duration === 'number' && duration >= 120) {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  
  return duration;
};

/**
 * Calculates total progress percentage
 * @param {Set} completedLectures - Set of completed lecture IDs
 * @param {Array} sections - Course sections
 * @returns {number} Progress percentage
 */
const calculateProgress = (completedLectures, sections) => {
  if (!sections?.length) return 0;
  
  let totalLessons = 0;
  sections.forEach(section => {
    totalLessons += section.lessons?.length || 0;
  });
  
  if (totalLessons === 0) return 0;
  return Math.round((completedLectures.size / totalLessons) * 100);
};

// ============================================================================
// Shimmer Components
// ============================================================================

const Shimmer = ({ style = {} }) => (
  <div style={{ background: '#EEEDFE', borderRadius: 8, overflow: 'hidden', position: 'relative', ...style }}>
    <div style={{ 
      position: 'absolute', 
      inset: 0, 
      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)', 
      animation: 'shimmer 1.5s infinite' 
    }} />
  </div>
);

const WatchWindowSkeleton = () => (
  <div className='min-h-screen bg-gray-50'>
    <style>{`@keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }`}</style>
    
    {/* Progress Bar Skeleton */}
    <div className='sticky top-16 z-40 bg-white border-b border-gray-100 px-6 md:px-10 py-3'>
      <div className='flex items-center justify-between'>
        <Shimmer style={{ height: 20, width: 200 }} />
        <Shimmer style={{ height: 16, width: 100 }} />
      </div>
    </div>
    
    <div className='grid lg:grid-cols-[1fr_380px]'>
      {/* Left side skeleton - Video player */}
      <div className='p-6 md:p-10'>
        <Shimmer style={{ width: '100%', aspectRatio: '16/9', borderRadius: 16 }} />
        <div className='mt-6'>
          <Shimmer style={{ height: 24, width: '70%', marginBottom: 12 }} />
          <Shimmer style={{ height: 16, width: '40%', marginBottom: 20 }} />
          <Shimmer style={{ height: 80, width: '100%' }} />
        </div>
      </div>
      
      {/* Right side skeleton - Course content */}
      <div className='bg-white border-l border-gray-100 p-6'>
        <Shimmer style={{ height: 24, width: 150, marginBottom: 20 }} />
        {[...Array(3)].map((_, i) => (
          <div key={i} className='mb-4'>
            <Shimmer style={{ height: 48, width: '100%', borderRadius: 12, marginBottom: 8 }} />
            <div className='pl-6 space-y-2'>
              <Shimmer style={{ height: 40, width: '90%', borderRadius: 8 }} />
              <Shimmer style={{ height: 40, width: '90%', borderRadius: 8 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ============================================================================
// Subcomponents
// ============================================================================

/**
 * Progress Bar Component
 */
const ProgressBar = ({ courseTitle, progress, completedCount, totalCount }) => (
  <div className='sticky top-16 z-40 bg-white border-b border-gray-100 px-6 md:px-10 py-3'>
    <div className='flex items-center justify-between gap-4 flex-wrap'>
      <p className='text-sm font-medium text-gray-700 truncate flex-1'>{courseTitle}</p>
      <div className='flex items-center gap-3 flex-shrink-0'>
        <div className='w-48 h-1.5 rounded-full overflow-hidden bg-gray-100'>
          <div 
            className='h-full rounded-full transition-all duration-500' 
            style={{ width: `${progress}%`, background: '#534AB7' }} 
          />
        </div>
        <span className='text-xs font-medium text-purple-600'>
          {completedCount}/{totalCount} • {progress}%
        </span>
      </div>
    </div>
  </div>
);

/**
 * Video Player Component
 */
const VideoPlayer = ({ lecture, onComplete, isCompleted, onNext }) => {
  const [player, setPlayer] = useState(null);
  const [showNext, setShowNext] = useState(false);
  
  const videoId = lecture?.videoUrl ? getYouTubeId(lecture.videoUrl) : null;
  
  const handleReady = (event) => {
    setPlayer(event.target);
  };
  
  const handleStateChange = (event) => {
    // Video ended
    if (event.data === 0 && !isCompleted) {
      setShowNext(true);
    }
  };
  
  const handleMarkComplete = () => {
    onComplete();
    setShowNext(false);
  };
  
  if (!lecture) {
    return (
      <div className='rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 mb-6'>
        <div className='w-full aspect-video flex items-center justify-center'>
          <div className='text-center'>
            <HiOutlinePlay size={48} className='text-gray-600 mx-auto mb-4' />
            <p className='text-gray-400 text-sm'>Select a lecture to start learning</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!videoId) {
    return (
      <div className='rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 mb-6'>
        <div className='w-full aspect-video flex items-center justify-center'>
          <div className='text-center'>
            <HiOutlineFlag size={48} className='text-gray-600 mx-auto mb-4' />
            <p className='text-gray-400 text-sm'>Video content coming soon</p>
            <p className='text-gray-500 text-xs mt-2'>{lecture.title}</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className='rounded-2xl overflow-hidden shadow-xl mb-6'>
        <YouTube 
          videoId={videoId}
          iframeClassName='w-full aspect-video'
          opts={{
            playerVars: {
              autoplay: 1,
              modestbranding: 1,
              rel: 0,
              controls: 1,
            }
          }}
          onReady={handleReady}
          onStateChange={handleStateChange}
        />
      </div>
      
      {/* Lecture Info & Actions */}
      <div className='mb-8'>
        <h2 className='text-xl font-semibold text-gray-800 mb-2'>{lecture.title}</h2>
        {lecture.duration && (
          <div className='flex items-center gap-2 text-sm text-gray-500 mb-4'>
            <HiOutlineClock size={16} />
            <span>{formatDuration(lecture.duration)}</span>
          </div>
        )}
        {lecture.description && (
          <p className='text-gray-600 leading-relaxed'>{lecture.description}</p>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className='flex items-center gap-3'>
        {!isCompleted && (
          <button
            onClick={handleMarkComplete}
            className='flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90'
            style={{ background: 'linear-gradient(135deg, #534AB7 0%, #3C3489 100%)' }}
          >
            <HiOutlineCheckCircle size={16} />
            Mark as Complete
          </button>
        )}
        
        {isCompleted && (
          <span className='flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-green-50 text-green-700'>
            <HiOutlineCheckCircle size={16} />
            Completed ✓
          </span>
        )}
        
        {showNext && onNext && (
          <button
            onClick={onNext}
            className='flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-purple-600 text-purple-600 hover:bg-purple-50 transition'
          >
            Next Lecture →
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Section Component
 */
const Section = ({ section, index, isOpen, onToggle, lectures, currentLectureId, onLectureSelect, completedLectures }) => {
  const lessons = section.lessons || lectures || [];
  const completedInSection = lessons.filter(l => completedLectures.has(l.id)).length;
  const sectionProgress = lessons.length > 0 ? (completedInSection / lessons.length) * 100 : 0;
  
  return (
    <div className='mb-2 border border-gray-100 rounded-xl overflow-hidden bg-white'>
      <button
        onClick={() => onToggle(index)}
        className='w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition'
      >
        <div className='flex items-center gap-3 flex-1'>
          <div className='w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-purple-100 text-purple-600'>
            {isOpen ? <HiOutlineChevronUp size={16} /> : <HiOutlineChevronDown size={16} />}
          </div>
          <div className='flex-1'>
            <p className='text-sm font-semibold text-gray-800'>{section.title}</p>
            <p className='text-xs text-gray-400 mt-0.5'>{lessons.length} lessons • {completedInSection} completed</p>
          </div>
          <div className='flex items-center gap-2'>
            {sectionProgress > 0 && (
              <div className='w-16 h-1 rounded-full bg-gray-100 overflow-hidden'>
                <div className='h-full bg-purple-500 rounded-full' style={{ width: `${sectionProgress}%` }} />
              </div>
            )}
          </div>
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className='border-t border-gray-100'
          >
            <div className='py-2'>
              {lessons.map((lesson, idx) => {
                const isActive = currentLectureId === lesson.id;
                const isCompleted = completedLectures.has(lesson.id);
                
                return (
                  <button
                    key={lesson.id}
                    onClick={() => onLectureSelect(lesson, index, idx)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition ${
                      isActive 
                        ? 'bg-purple-50' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCompleted 
                        ? 'bg-green-100 text-green-600' 
                        : isActive 
                          ? 'bg-purple-100 text-purple-600' 
                          : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <HiOutlineCheckCircle size={12} />
                      ) : (
                        <span className='text-xs'>{idx + 1}</span>
                      )}
                    </div>
                    <div className='flex-1'>
                      <p className={`text-sm ${isActive ? 'text-purple-600 font-medium' : 'text-gray-700'}`}>
                        {lesson.title}
                      </p>
                      {lesson.duration && (
                        <p className='text-xs text-gray-400 mt-0.5'>{formatDuration(lesson.duration)}</p>
                      )}
                    </div>
                    {lesson.isPreview && (
                      <span className='text-xs text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full'>Preview</span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Course Content Sidebar Component
 */
const CourseContentSidebar = ({ 
  sections, 
  openSections, 
  onToggleSection, 
  onLectureSelect, 
  currentLectureId, 
  completedLectures 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  if (!sections?.length) {
    return (
      <div className='bg-white border-l border-gray-100 p-6'>
        <p className='text-center text-gray-500 py-12'>No course content available</p>
      </div>
    );
  }
  
  return (
    <div className={`bg-white border-l border-gray-100 transition-all duration-300 ${isCollapsed ? 'w-16' : ''}`}>
      <div className='sticky top-32'>
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b border-gray-100'>
          {!isCollapsed && (
            <h3 className='font-semibold text-gray-800'>Course Content</h3>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className='p-1 rounded-lg hover:bg-gray-100 transition'
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <HiOutlineChevronDown className={`transform transition-transform ${isCollapsed ? 'rotate-90' : '-rotate-90'}`} />
          </button>
        </div>
        
        {/* Content */}
        <div className={`p-4 space-y-2 ${isCollapsed ? 'hidden' : ''}`}>
          {sections.map((section, idx) => (
            <Section
              key={section.id || idx}
              section={section}
              index={idx}
              isOpen={openSections[idx]}
              onToggle={onToggleSection}
              currentLectureId={currentLectureId}
              onLectureSelect={onLectureSelect}
              completedLectures={completedLectures}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Empty State Component
 */
const EmptyState = ({ onBrowseCourses }) => (
  <div className='min-h-screen flex items-center justify-center'>
    <div className='text-center'>
      <div className='w-24 h-24 mx-auto mb-6 rounded-full bg-purple-100 flex items-center justify-center'>
        <span className='text-4xl'>📚</span>
      </div>
      <h3 className='text-xl font-semibold text-gray-800 mb-2'>Course not found</h3>
      <p className='text-gray-500 mb-6'>The course you're looking for doesn't exist or you haven't enrolled yet.</p>
      <button
        onClick={onBrowseCourses}
        className='px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition'
      >
        Browse Courses
      </button>
    </div>
  </div>
);

// ============================================================================
// Main Component
// ============================================================================

/**
 * WatchWindow - Course video player page
 * @returns {React.ReactElement} Watch window page
 */
const WatchWindow = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  // State
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [currentLecture, setCurrentLecture] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLectures, setCompletedLectures] = useState(new Set());
  const [isVisible, setIsVisible] = useState(false);
  
  // Use mock data flag (set to false when backend is ready)
// When backend is ready, change this line (around line 245)
const USE_MOCK_DATA = false;  // ✅ Change to false when backend ready  
  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) {
        setError('Invalid course ID');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        let courseData;
        
        if (USE_MOCK_DATA) {
          // Use mock data for development
          await new Promise(resolve => setTimeout(resolve, 800));
          courseData = { ...MOCK_COURSE_DATA, id: parseInt(courseId) || 1 };
        } else {
          // Real API call when backend is ready
          const response = await getCourseById(courseId);
          if (response.success) {
            courseData = response.data;
          } else {
            throw new Error(response.message);
          }
        }
        
        setCourse(courseData);
        
        // Initialize first lecture
        if (courseData.sections?.length > 0) {
          const firstSection = courseData.sections[0];
          if (firstSection.lessons?.length > 0) {
            setCurrentLecture(firstSection.lessons[0]);
            setCurrentSectionIndex(0);
            setCurrentLessonIndex(0);
            setOpenSections({ 0: true });
          }
        }
        
        // Load completed lectures from localStorage (mock persistence)
        const savedProgress = localStorage.getItem(`course_progress_${courseId}`);
        if (savedProgress) {
          const completedIds = new Set(JSON.parse(savedProgress));
          setCompletedLectures(completedIds);
        }
        
        setTimeout(() => setIsVisible(true), 100);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError(err.message || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [courseId]);
  
  // Save progress to localStorage when completed lectures change
  useEffect(() => {
    if (courseId && completedLectures.size > 0) {
      localStorage.setItem(`course_progress_${courseId}`, JSON.stringify([...completedLectures]));
    }
  }, [completedLectures, courseId]);
  
  // Calculate progress
  const totalLessons = useMemo(() => {
    if (!course?.sections) return 0;
    return course.sections.reduce((total, section) => total + (section.lessons?.length || 0), 0);
  }, [course]);
  
  const progress = useMemo(() => 
    calculateProgress(completedLectures, course?.sections), 
    [completedLectures, course]
  );
  
  // Toggle section open/close
  const toggleSection = useCallback((index) => {
    setOpenSections(prev => ({ ...prev, [index]: !prev[index] }));
  }, []);
  
  // Select lecture
  const selectLecture = useCallback((lecture, sectionIdx, lessonIdx) => {
    setCurrentLecture(lecture);
    setCurrentSectionIndex(sectionIdx);
    setCurrentLessonIndex(lessonIdx);
    
    // Auto-expand the section containing the selected lecture
    if (!openSections[sectionIdx]) {
      setOpenSections(prev => ({ ...prev, [sectionIdx]: true }));
    }
    
    // Scroll to top on mobile
    if (window.innerWidth < 1024) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [openSections]);
  
  // Mark current lecture as complete
  const markComplete = useCallback(() => {
    if (!currentLecture) return;
    
    setCompletedLectures(prev => {
      const newSet = new Set(prev);
      newSet.add(currentLecture.id);
      return newSet;
    });
  }, [currentLecture]);
  
  // Go to next lecture
  const goToNextLecture = useCallback(() => {
    if (!course?.sections) return;
    
    const sections = course.sections;
    const currentSection = sections[currentSectionIndex];
    const nextLessonIndex = currentLessonIndex + 1;
    
    // Next lesson in same section
    if (nextLessonIndex < currentSection.lessons.length) {
      const nextLecture = currentSection.lessons[nextLessonIndex];
      setCurrentLecture(nextLecture);
      setCurrentLessonIndex(nextLessonIndex);
    } else {
      // Move to next section
      const nextSectionIndex = currentSectionIndex + 1;
      if (nextSectionIndex < sections.length) {
        const nextSection = sections[nextSectionIndex];
        if (nextSection.lessons?.length > 0) {
          setCurrentLecture(nextSection.lessons[0]);
          setCurrentSectionIndex(nextSectionIndex);
          setCurrentLessonIndex(0);
          setOpenSections(prev => ({ ...prev, [nextSectionIndex]: true }));
        }
      }
    }
  }, [course, currentSectionIndex, currentLessonIndex]);
  
  // Check if current lecture is completed
  const isCurrentLectureCompleted = useMemo(() => 
    currentLecture ? completedLectures.has(currentLecture.id) : false,
    [currentLecture, completedLectures]
  );
  
  // Handle mark complete with auto-next
  const handleMarkComplete = useCallback(() => {
    markComplete();
    // Auto-advance to next lecture after marking complete (optional)
    setTimeout(() => {
      goToNextLecture();
    }, 500);
  }, [markComplete, goToNextLecture]);
  
  // Browse courses handler
  const handleBrowseCourses = useCallback(() => {
    navigate('/courses');
  }, [navigate]);
  
  // Loading state
  if (loading) {
    return <WatchWindowSkeleton />;
  }
  
  // Error or no course state
  if (error || !course) {
    return <EmptyState onBrowseCourses={handleBrowseCourses} />;
  }
  
  // Check enrollment (for real implementation, check API)
  const isEnrolled = true; // TODO: Check enrollment from API
  
  if (!isEnrolled && !USE_MOCK_DATA) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-24 h-24 mx-auto mb-6 rounded-full bg-yellow-100 flex items-center justify-center'>
            <span className='text-4xl'>🔒</span>
          </div>
          <h3 className='text-xl font-semibold text-gray-800 mb-2'>Access Restricted</h3>
          <p className='text-gray-500 mb-6'>Please enroll in this course to access the content.</p>
          <button
            onClick={() => navigate(`/course/${courseId}`)}
            className='px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition'
          >
            View Course Details
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <style>{`
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        .watch-container { opacity: 0; transition: opacity ${ANIMATION_DURATION.CONTAINER_FADE}ms ease; }
        .watch-container.visible { opacity: 1; }
      `}</style>
      
      <div className={`watch-container ${isVisible ? 'visible' : ''} min-h-screen bg-gray-50`}>
        {/* Progress Bar */}
        <ProgressBar 
          courseTitle={course.title}
          progress={progress}
          completedCount={completedLectures.size}
          totalCount={totalLessons}
        />
        
        {/* Main Layout */}
        <div className='grid lg:grid-cols-[1fr_420px]'>
          {/* Left Column - Video Player & Comments */}
          <div className='p-6 md:p-10'>
            <VideoPlayer 
              lecture={currentLecture}
              onComplete={handleMarkComplete}
              isCompleted={isCurrentLectureCompleted}
              onNext={goToNextLecture}
            />
            
            {/* Comments Section */}
            <div className='mt-10 pt-6 border-t border-gray-200'>
              <Comments courseId={course.id} />
            </div>
          </div>
          
          {/* Right Column - Course Content Sidebar */}
          <CourseContentSidebar 
            sections={course.sections || []}
            openSections={openSections}
            onToggleSection={toggleSection}
            onLectureSelect={selectLecture}
            currentLectureId={currentLecture?.id}
            completedLectures={completedLectures}
          />
        </div>
      </div>
    </>
  );
};

export default WatchWindow;