// src/features/chat/components/ChatMessage.jsx
import { motion } from 'framer-motion';
import { HiUser, HiOutlineLink } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useCallback, useState } from 'react';

// Sub-component: Course card carousel item
const CourseCard = ({ course, onClick }) => {
  const levelColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
  };
  const levelClass = levelColors[course.level?.toLowerCase()] || 'bg-gray-100 text-gray-700';

  return (
    <button
      onClick={() => onClick(course.courseId)}
      className="flex-shrink-0 w-44 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer overflow-hidden text-left group"
    >
      {/* Thumbnail */}
      <div className="h-24 bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="text-3xl">📚</span>
        )}
      </div>

      <div className="p-2.5">
        <h4 className="font-semibold text-xs text-gray-800 line-clamp-2 leading-snug min-h-[2rem]">
          {course.title}
        </h4>
        {course.instructorName && (
          <p className="text-[11px] text-gray-500 mt-1 truncate">👨‍🏫 {course.instructorName}</p>
        )}
        <div className="flex items-center gap-1.5 mt-2">
          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${levelClass}`}>
            {course.level || 'All levels'}
          </span>
          <span className="text-[9px] text-purple-600 font-medium ml-auto group-hover:underline">
            View →
          </span>
        </div>
      </div>
    </button>
  );
};

// Recommended courses panel — visually distinct "card within a card" so it
// never blends into the plain-text answer above it.
const CoursesPanel = ({ courses, onCourseClick }) => {
  const [showAll, setShowAll] = useState(false);

  if (!courses || courses.length === 0) return null;

  const visible = showAll ? courses : courses.slice(0, 3);
  const hasMore = courses.length > 3;

  return (
    <div className="mt-3 -mx-3.5 mb-[-0.875rem] rounded-b-2xl bg-purple-50/60 border-t border-purple-100 px-3.5 py-3">
      <p className="text-[11px] font-semibold text-purple-700 mb-2 flex items-center gap-1.5">
        <span aria-hidden>🎯</span> Recommended courses
      </p>

      <div className="flex gap-2.5 overflow-x-auto pb-1 snap-x snap-mandatory">
        {visible.map((course) => (
          <div key={course.courseId} className="snap-start">
            <CourseCard course={course} onClick={onCourseClick} />
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-[11px] text-purple-600 font-semibold hover:text-purple-800 transition mt-2 flex items-center gap-1"
        >
          {showAll ? 'Show less ↑' : `Show ${courses.length - 3} more →`}
        </button>
      )}
    </div>
  );
};

// Sources footer — compact, clearly secondary to the answer and the courses
const SourcesStrip = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-start gap-1.5">
      <HiOutlineLink className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
      <div className="flex flex-wrap gap-1.5">
        {sources.slice(0, 4).map((source, idx) => (
          <span
            key={idx}
            className="text-[10px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-150"
          >
            {source.title}
          </span>
        ))}
        {sources.length > 4 && (
          <span className="text-[10px] text-gray-400">+{sources.length - 4} more</span>
        )}
      </div>
    </div>
  );
};

// Main ChatMessage component
const ChatMessage = ({ message }) => {
  const isBot = message.sender === 'bot';
  const navigate = useNavigate();
  // Only show the courses panel when there ARE matched courses AND the
  // user's message actually signaled course-intent (see useChat.js) —
  // otherwise an unrelated reply that happens to carry matches would show
  // the carousel unprompted.
  const hasCourses = isBot && message.showCourses && message.recommendedCourses?.length > 0;

  const handleCourseClick = useCallback(
    (courseId) => {
      console.log('[Chat] Navigating to course:', courseId);
      navigate(`/course/${courseId}`);
    },
    [navigate]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} gap-2`}
    >
      {/* Bot Avatar */}
      {isBot && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            L
          </div>
        </div>
      )}

      {/* Message bubble */}
      <div
        className={`max-w-[88%] rounded-2xl text-sm shadow-sm overflow-hidden ${
          isBot
            ? 'bg-white text-gray-800 rounded-bl-md border border-gray-100'
            : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-md shadow-md'
        }`}
      >
        <div className="p-3.5">
          {/* Text content with bold support — this is always "the answer",
              visually separated below from courses/sources */}
          <div className="whitespace-pre-wrap break-words leading-relaxed">
            {isBot ? renderTextWithBold(message.text, handleCourseClick) : message.text}
          </div>

          {/* Timestamp lives with the text answer, not after the courses
              panel, so it always marks "end of message" consistently */}
          {message.timestamp && !hasCourses && (
            <Timestamp message={message} isBot={isBot} />
          )}
        </div>

        {/* Course recommendations (bot only) — distinct panel, not floating
            inside the same padding as plain text */}
        {hasCourses && (
          <CoursesPanel courses={message.recommendedCourses} onCourseClick={handleCourseClick} />
        )}

        {/* Sources + timestamp footer when there are courses, so the panel
            doesn't end abruptly */}
        {hasCourses && (
          <div className="px-3.5 pb-3 pt-2">
            {isBot && <SourcesStrip sources={message.sources} />}
            {message.timestamp && <Timestamp message={message} isBot={isBot} />}
          </div>
        )}

        {/* Sources when there are no courses */}
        {!hasCourses && isBot && (
          <div className="px-3.5 pb-3.5 -mt-1">
            <SourcesStrip sources={message.sources} />
          </div>
        )}
      </div>

      {/* User Avatar */}
      {!isBot && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center shadow-sm">
            <HiUser className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Timestamp row, extracted so it doesn't get duplicated/misaligned between
// the "has courses" and "no courses" layouts
const Timestamp = ({ message, isBot }) => (
  <div
    className={`text-[10px] mt-2 flex items-center gap-1 ${
      isBot ? 'text-gray-400' : 'text-white/60'
    }`}
  >
    <span>
      {new Date(message.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}
    </span>
    {isBot && <span>• Loopy AI</span>}
    {message.metadata?.confidence && (
      <span className="ml-1 px-1.5 py-0.5 bg-gray-100 rounded-full text-gray-500 text-[9px]">
        {Math.round(message.metadata.confidence * 100)}%
      </span>
    )}
  </div>
);

// Helper: render text with **bold** support, upgrading "**Name** (ID: N)"
// into a clickable course link (and hiding the raw "(ID: N)" text, since
// the link itself now signals "this is a course you can open").
const renderTextWithBold = (text, onCourseClick) => {
  if (!text) return null;

  const parts = [];
  // Bold span optionally followed by " (ID: <id>)" — captures the id when present.
  const regex = /\*\*(.*?)\*\*(?:\s*\(ID:\s*(\d+)\))?/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex, match.index)}</span>);
    }

    const label = match[1];
    const courseId = match[2];

    if (courseId && onCourseClick) {
      parts.push(
        <button
          key={`link-${match.index}`}
          onClick={() => onCourseClick(courseId)}
          className="font-semibold text-purple-700 underline decoration-purple-300 hover:text-purple-900 hover:decoration-purple-600 transition-colors"
        >
          {label}
        </button>
      );
    } else {
      parts.push(
        <strong key={`bold-${match.index}`} className="font-semibold text-purple-700">
          {label}
        </strong>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(<span key="text-end">{text.slice(lastIndex)}</span>);
  }

  return parts.length > 0 ? parts : <span>{text}</span>;
};

export default ChatMessage;