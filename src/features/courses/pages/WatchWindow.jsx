/**
 * WatchWindow.jsx
 * Video player page for watching course lectures with progress tracking.
 * Features chapter navigation, lecture completion tracking, and video player.
 * 
 * @module features/courses/pages/WatchWindow
 */

import humanizeDuration from 'humanize-duration';
import React, { useEffect, useState, useContext, useCallback, useMemo } from 'react';
import { assets } from '../../../assets/assets';
import { AppContext } from '../../../store/AppContext';
import { useParams } from 'react-router-dom';
import YouTube from 'react-youtube';
import Comments from '../components/Comments';

// ============================================================================
// Constants
// ============================================================================

/** YouTube URL regex patterns */
const YOUTUBE_REGEX = /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/)([^"&?\/\s]{11})/;

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
 * Formats duration in minutes to human readable string
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration
 */
const formatDuration = (minutes) => {
  return humanizeDuration(minutes * 60 * 1000, { units: ['h', 'm'] });
};

/**
 * Calculates total lectures count from course content
 * @param {Array} courseContent - Course chapters content
 * @returns {number} Total lecture count
 */
const getTotalLectures = (courseContent) => {
  return courseContent?.reduce((sum, chapter) => sum + (chapter.chapterContent?.length || 0), 0) || 0;
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
  <div className='p-4 sm:p-10 grid md:grid-cols-2 gap-10 md:px-36'>
    <style>{`@keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }`}</style>
    
    {/* Left side skeleton - Course content list */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Shimmer style={{ height: 24, width: 180, marginBottom: 8 }} />
      {[...Array(4)].map((_, i) => (
        <div key={i} style={{ border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 10, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flex: 1 }}>
            <Shimmer style={{ width: 16, height: 16, borderRadius: 4, flexShrink: 0 }} />
            <Shimmer style={{ height: 14, flex: 1, maxWidth: 200 }} />
          </div>
          <Shimmer style={{ height: 13, width: 100 }} />
        </div>
      ))}
    </div>
    
    {/* Right side skeleton - Video player */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 10 }}>
      <Shimmer style={{ width: '100%', aspectRatio: '16/9', borderRadius: 12 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Shimmer style={{ height: 16, width: '55%' }} />
        <Shimmer style={{ height: 14, width: 120 }} />
      </div>
    </div>
  </div>
);

// ============================================================================
// Subcomponents
// ============================================================================

/**
 * Progress bar component
 */
const ProgressBar = ({ courseTitle, completed, totalLectures }) => {
  const progressPercent = Math.round((completed.size / totalLectures) * 100);
  
  return (
    <div className='sticky top-16 z-40 px-6 md:px-10 py-3 flex items-center gap-4' style={{ background: 'white', borderBottom: '0.5px solid rgba(0,0,0,0.07)' }}>
      <p className='text-sm font-medium text-gray-700 truncate flex-1'>{courseTitle}</p>
      <div className='flex items-center gap-3 flex-shrink-0'>
        <div className='w-32 h-1.5 rounded-full overflow-hidden' style={{ background: '#EEEDFE' }}>
          <div 
            className='h-full rounded-full transition-all duration-500' 
            style={{ width: `${progressPercent}%`, background: '#534AB7' }} 
          />
        </div>
        <span className='text-xs font-medium' style={{ color: '#534AB7' }}>
          {completed.size}/{totalLectures}
        </span>
      </div>
    </div>
  );
};

/**
 * Video player component
 */
const VideoPlayer = ({ watchCourse, onMarkComplete, isCompleted }) => {
  const videoId = getYouTubeId(watchCourse?.lectureUrl);
  
  return (
    <>
      <div className='rounded-2xl overflow-hidden mb-5' style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
        {watchCourse && videoId ? (
          <YouTube 
            videoId={videoId} 
            iframeClassName='w-full aspect-video' 
            opts={{ playerVars: { autoplay: 1 } }} 
          />
        ) : (
          <div className='w-full aspect-video flex items-center justify-center' style={{ background: '#1a1a2e' }}>
            <p className='text-white/50 text-sm'>Select a lecture to start</p>
          </div>
        )}
      </div>
      
      {watchCourse && (
        <div className='flex items-start justify-between gap-4 mb-8 p-4 rounded-xl' style={{ background: '#FAFAFA', border: '0.5px solid rgba(0,0,0,0.07)' }}>
          <div>
            <p className='font-semibold text-gray-800 mb-1'>
              {watchCourse.chapter}.{watchCourse.lecture} {watchCourse.lectureTitle}
            </p>
            <p className='text-xs text-gray-400'>{formatDuration(watchCourse.lectureDuration)}</p>
          </div>
          <button
            onClick={onMarkComplete}
            disabled={isCompleted}
            className='complete-btn flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition'
            style={isCompleted
              ? { background: '#D1FAE5', color: '#065F46', border: '0.5px solid #6EE7B7' }
              : { border: '0.5px solid #534AB7', color: '#534AB7' }
            }
          >
            {isCompleted ? '✓ Completed' : 'Mark as Complete'}
          </button>
        </div>
      )}
    </>
  );
};

/**
 * Chapter section component
 */
const ChapterSection = ({ chapter, index, isOpen, onToggle, onLectureSelect, currentLecture, completedLectures }) => {
  return (
    <div className='mb-1'>
      <div 
        className='chapter-header flex items-center justify-between px-3 py-2.5 rounded-lg select-none hover:bg-gray-50 transition cursor-pointer' 
        onClick={() => onToggle(index)}
      >
        <div className='flex items-center gap-2 flex-1 min-w-0'>
          <img 
            className={`w-3 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            src={assets.down_arrow_icon} 
            alt='' 
          />
          <p className='text-xs font-semibold text-gray-700 truncate'>{chapter.chapterTitle}</p>
        </div>
        <span className='text-xs text-gray-400 flex-shrink-0 ml-2'>{chapter.chapterContent?.length || 0}</span>
      </div>
      
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
        <div className='pl-4 pr-2 pb-2 flex flex-col gap-0.5'>
          {chapter.chapterContent?.map((lecture, i) => {
            const isActive = currentLecture?.lectureTitle === lecture.lectureTitle;
            const isDone = completedLectures.has(lecture.lectureTitle);
            
            return (
              <div
                key={i}
                onClick={() => onLectureSelect({ ...lecture, chapter: index + 1, lecture: i + 1 })}
                className={`lecture-item flex items-start gap-2 px-2 py-2 rounded-lg cursor-pointer transition ${
                  isActive ? 'active bg-purple-50' : 'hover:bg-gray-50'
                }`}
              >
                <div
                  className='w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'
                  style={{ 
                    background: isDone ? '#D1FAE5' : isActive ? '#EEEDFE' : '#F1F0F0', 
                    border: isActive ? '1.5px solid #534AB7' : 'none' 
                  }}
                >
                  <span style={{ color: isDone ? '#065F46' : isActive ? '#534AB7' : '#B4B2A9', fontSize: 7 }}>
                    {isDone ? '✓' : '▶'}
                  </span>
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-xs leading-relaxed' style={{ 
                    color: isActive ? '#534AB7' : isDone ? '#888780' : '#444441', 
                    fontWeight: isActive ? 500 : 400 
                  }}>
                    {lecture.lectureTitle}
                  </p>
                  <p className='text-xs mt-0.5' style={{ color: '#B4B2A9' }}>
                    {formatDuration(lecture.lectureDuration)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/**
 * Course content sidebar component
 */
const CourseContentSidebar = ({ courseContent, openSections, onToggleSection, onLectureSelect, currentLecture, completedLectures }) => {
  return (
    <div className='hidden md:block overflow-y-auto bg-white' style={{ maxHeight: 'calc(100vh - 120px)', position: 'sticky', top: '120px', borderLeft: '0.5px solid rgba(0,0,0,0.07)' }}>
      <div className='p-4'>
        <h3 className='text-sm font-semibold text-gray-800 mb-4 px-2'>Course Content</h3>
        
        {courseContent?.map((chapter, index) => (
          <ChapterSection
            key={index}
            chapter={chapter}
            index={index}
            isOpen={openSections[index]}
            onToggle={onToggleSection}
            onLectureSelect={onLectureSelect}
            currentLecture={currentLecture}
            completedLectures={completedLectures}
          />
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

/**
 * WatchWindow - Course video player page
 * @returns {React.ReactElement} Watch window page
 */
const WatchWindow = () => {
  const { enrolledCourses, enrolledLoading } = useContext(AppContext);
  const { courseId } = useParams();
  
  // State
  const [courseDetails, setCourseDetails] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [currentLecture, setCurrentLecture] = useState(null);
  const [completedLectures, setCompletedLectures] = useState(new Set());
  const [isVisible, setIsVisible] = useState(false);
  
  // Find course from enrolled courses
  useEffect(() => {
    const course = enrolledCourses.find((c) => c._id === courseId);
    setCourseDetails(course || null);
  }, [courseId, enrolledCourses]);
  
  // Initialize first lecture and open first section
  useEffect(() => {
    if (courseDetails?.courseContent?.length > 0) {
      const firstChapter = courseDetails.courseContent[0];
      const firstLecture = firstChapter.chapterContent[0];
      
      if (firstLecture) {
        setCurrentLecture({ ...firstLecture, chapter: 1, lecture: 1 });
        setOpenSections({ 0: true });
        setTimeout(() => setIsVisible(true), 50);
      }
    }
  }, [courseDetails]);
  
  // Memoized values
  const totalLectures = useMemo(() => 
    getTotalLectures(courseDetails?.courseContent), 
    [courseDetails]
  );
  
  // Toggle section open/close
  const toggleSection = useCallback((index) => {
    setOpenSections(prev => ({ ...prev, [index]: !prev[index] }));
  }, []);
  
  // Mark current lecture as complete
  const markComplete = useCallback(() => {
    if (currentLecture) {
      setCompletedLectures(prev => new Set([...prev, currentLecture.lectureTitle]));
    }
  }, [currentLecture]);
  
  // Check if current lecture is completed
  const isCurrentLectureCompleted = useMemo(() => 
    currentLecture ? completedLectures.has(currentLecture.lectureTitle) : false,
    [currentLecture, completedLectures]
  );
  
  // Loading state
  if (enrolledLoading) return <WatchWindowSkeleton />;
  
  // Course not found
  if (!courseDetails) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-6xl mb-4'>📚</p>
          <p className='text-gray-500'>Course not found or not enrolled.</p>
          <button 
            onClick={() => window.history.back()}
            className='mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition'
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <style>{`
        .watch-container { 
          opacity: 0; 
          transition: opacity ${ANIMATION_DURATION.CONTAINER_FADE}ms ease; 
        }
        .watch-container.visible { 
          opacity: 1; 
        }
        .lecture-item { 
          transition: background 0.15s ease, border 0.15s ease; 
        }
        .chapter-header { 
          transition: background 0.15s ease; 
        }
        .complete-btn { 
          transition: all 0.2s ease; 
        }
        .complete-btn:hover:not(:disabled) { 
          background: #534AB7; 
          color: white; 
          transform: translateY(-1px);
        }
      `}</style>
      
      <div className={`watch-container ${isVisible ? 'visible' : ''}`}>
        {/* Progress Bar */}
        <ProgressBar 
          courseTitle={courseDetails.courseTitle}
          completed={completedLectures}
          totalLectures={totalLectures}
        />
        
        {/* Main Layout */}
        <div className='grid md:grid-cols-[1fr_320px]'>
          {/* Left Column - Video Player & Comments */}
          <div className='p-6 md:p-10 border-r' style={{ borderColor: 'rgba(0,0,0,0.07)' }}>
            <VideoPlayer 
              watchCourse={currentLecture}
              onMarkComplete={markComplete}
              isCompleted={isCurrentLectureCompleted}
            />
            <Comments courseId={courseId} />
          </div>
          
          {/* Right Column - Course Content Sidebar */}
          <CourseContentSidebar 
            courseContent={courseDetails.courseContent}
            openSections={openSections}
            onToggleSection={toggleSection}
            onLectureSelect={setCurrentLecture}
            currentLecture={currentLecture}
            completedLectures={completedLectures}
          />
        </div>
      </div>
    </>
  );
};

export default WatchWindow;