// src/features/chat/components/ChatMessage.jsx
import { motion } from 'framer-motion';
import { HiUser } from 'react-icons/hi';
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
      className="flex-shrink-0 w-48 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden text-left group"
    >
      {/* Thumbnail */}
      <div className="h-28 bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="text-4xl">📚</span>
        )}
      </div>

      <div className="p-3">
        <h4 className="font-semibold text-sm text-gray-800 line-clamp-2 leading-snug">
          {course.title}
        </h4>
        {course.instructorName && (
          <p className="text-xs text-gray-500 mt-1 truncate">👨‍🏫 {course.instructorName}</p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${levelClass}`}>
            {course.level || 'All levels'}
          </span>
          <span className="text-[10px] text-purple-600 font-medium ml-auto group-hover:underline">
            View →
          </span>
        </div>
      </div>
    </button>
  );
};

// Sources chip strip
const SourcesStrip = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-3 pt-2 border-t border-gray-100/60">
      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-1.5">
        📚 Sources
      </p>
      <div className="flex flex-wrap gap-1.5">
        {sources.slice(0, 4).map((source, idx) => (
          <span
            key={idx}
            className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-100"
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
  const [showAllCourses, setShowAllCourses] = useState(false);

  const handleCourseClick = useCallback(
    (courseId) => {
      console.log('[Chat] Navigating to course:', courseId);
      navigate(`/course/${courseId}`);
    },
    [navigate]
  );

  // Show max 3 courses initially, expand to all if "show all" clicked
  const courses = message.recommendedCourses || [];
  const visibleCourses = showAllCourses ? courses : courses.slice(0, 3);
  const hasMore = courses.length > 3;

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
        className={`max-w-[88%] p-3.5 rounded-2xl text-sm shadow-sm ${
          isBot
            ? 'bg-white text-gray-800 rounded-bl-md border border-gray-100'
            : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-md shadow-md'
        }`}
      >
        {/* Text content with bold support */}
        <div className="whitespace-pre-wrap break-words">
          {isBot ? renderTextWithBold(message.text) : message.text}
        </div>

        {/* Course recommendations (bot only) */}
        {isBot && courses.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-medium text-purple-600 mb-2 flex items-center gap-1.5">
              <span>🎯</span> Recommended for you
            </p>

            <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300">
              {visibleCourses.map((course) => (
                <div key={course.courseId} className="snap-start">
                  <CourseCard course={course} onClick={handleCourseClick} />
                </div>
              ))}
            </div>

            {hasMore && (
              <button
                onClick={() => setShowAllCourses(!showAllCourses)}
                className="text-xs text-purple-600 font-medium hover:text-purple-800 transition mt-1.5 flex items-center gap-1"
              >
                {showAllCourses ? 'Show less ↑' : `Show ${courses.length - 3} more courses →`}
              </button>
            )}
          </div>
        )}

        {/* Sources (bot only) */}
        {isBot && <SourcesStrip sources={message.sources} />}

        {/* Timestamp */}
        {message.timestamp && (
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

// Helper: render text with **bold** support
const renderTextWithBold = (text) => {
  if (!text) return null;

  const parts = [];
  const regex = /\*\*(.*?)\*\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex, match.index)}</span>);
    }
    parts.push(
      <strong key={`bold-${match.index}`} className="font-semibold text-purple-700">
        {match[1]}
      </strong>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(<span key="text-end">{text.slice(lastIndex)}</span>);
  }

  return parts.length > 0 ? parts : <span>{text}</span>;
};

export default ChatMessage;