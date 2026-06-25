// src/features/chat/components/ChatMessage.jsx

import { motion } from 'framer-motion';
import { HiUser } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const ChatMessage = ({ message }) => {
  const isBot = message.sender === 'bot';
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        damping: 20,
        stiffness: 300,
      }}
      className={`flex ${
        isBot ? 'justify-start' : 'justify-end'
      } gap-2`}
    >
      {/* Bot Avatar */}
      {isBot && (
        <div className="flex-shrink-0 mt-1">
          <div
            className="
              w-8 h-8
              rounded-full
              bg-gradient-to-br
              from-purple-500
              to-indigo-600
              flex
              items-center
              justify-center
              text-white
              text-sm
              font-bold
              shadow-sm
            "
          >
            L
          </div>
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm ${
          isBot
            ? 'bg-white text-gray-800 rounded-bl-md border border-gray-100'
            : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-md shadow-md'
        }`}
      >
        {/* Message Text */}
        <div className="whitespace-pre-wrap break-words">
          {message.text}
        </div>

        {/* Recommended Courses */}
        {isBot &&
          message.recommendedCourses &&
          message.recommendedCourses.length > 0 && (
            <div className="mt-4 flex flex-col gap-3">
              {message.recommendedCourses.map((course) => (
                <div
                  key={course.courseId}
                  onClick={() =>
                    navigate(`/course/${course.courseId}`)
                  }
                  className="
                    cursor-pointer
                    rounded-xl
                    border
                    border-gray-200
                    overflow-hidden
                    hover:shadow-lg
                    transition-all
                    bg-white
                    hover:border-purple-300
                  "
                >
                  {course.thumbnailUrl && (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-32 object-cover"
                    />
                  )}

                  <div className="p-3">
                    <h4 className="font-semibold text-gray-800">
                      {course.title}
                    </h4>

                    <p className="text-sm text-gray-500 mt-1">
                      {course.instructorName}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <span
                        className="
                          text-xs
                          bg-purple-100
                          text-purple-700
                          px-2
                          py-1
                          rounded-full
                        "
                      >
                        {course.level}
                      </span>

                      <span className="text-xs text-purple-600 font-medium">
                        View Course →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        {/* Timestamp */}
        {message.timestamp && (
          <div
            className={`text-[10px] mt-2 flex items-center gap-1 ${
              isBot
                ? 'text-gray-400'
                : 'text-white/60'
            }`}
          >
            <span>
              {new Date(
                message.timestamp
              ).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>

            {isBot && <span>• Loopy AI</span>}
          </div>
        )}
      </div>

      {/* User Avatar */}
      {!isBot && (
        <div className="flex-shrink-0 mt-1">
          <div
            className="
              w-8 h-8
              rounded-full
              bg-gradient-to-r
              from-purple-600
              to-indigo-600
              flex
              items-center
              justify-center
              shadow-sm
            "
          >
            <HiUser className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessage;

