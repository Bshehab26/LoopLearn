// src/features/chat/components/ChatMessage.jsx
import { motion } from 'framer-motion';
import { HiUser } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import avatar from '../../../assets/chatAvatar.png';

const ChatMessage = ({ message }) => {
  const isBot = message.sender === 'bot';
  const navigate = useNavigate();

  // Navigate to course with explicit ID
  const handleCourseClick = useCallback((courseId) => {
    console.log('Navigating to course:', courseId); // Debug
    navigate(`/course/${courseId}`);
  }, [navigate]);

  // Extract course links from text and render
  const renderContent = (text) => {
    if (!text) return null;
    
    // Remove Sources footer
    let cleanText = text
      .replace(/\n\n📚 \*Sources:.*$/s, '')
      .replace(/\n\nSources:.*$/s, '')
      .replace(/\n\n\*Sources:.*$/s, '')
      .trim();

    // Find all course links: [Name](course:ID)
    const courseLinkRegex = /\[([^\]]+)\]\(course:(\d+)\)/g;
    const elements = [];
    let lastIndex = 0;
    let match;

    while ((match = courseLinkRegex.exec(cleanText)) !== null) {
      // Text before link
      if (match.index > lastIndex) {
        const beforeText = cleanText.slice(lastIndex, match.index);
        elements.push(renderTextWithBold(beforeText, `before-${lastIndex}`));
      }

      // Extract course info
      const [, courseName, courseId] = match;
      const cleanId = courseId.trim();
      const cleanName = courseName.replace(/\*\*/g, '').trim();
      
      console.log('Found course link:', { name: courseName, id: courseId }); // Debug

      // Render course button
      elements.push(
        <CourseButton 
          key={`course-${match.index}`}
          name={courseName}
          id={courseId}
          onClick={handleCourseClick}
        />
      );

      lastIndex = match.index + match[0].length;
    }

    // Remaining text
    if (lastIndex < cleanText.length) {
      elements.push(renderTextWithBold(cleanText.slice(lastIndex), `after-${lastIndex}`));
    }

    // If no links found, just render text
    if (elements.length === 0) {
      return renderTextWithBold(cleanText, 'plain');
    }

    return <div className="space-y-1">{elements}</div>;
  };

  // Render text with **bold** support
  const renderTextWithBold = (text, keyPrefix) => {
    if (!text) return null;
    
    const parts = [];
    const regex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<span key={`${keyPrefix}-text-${lastIndex}`}>{text.slice(lastIndex, match.index)}</span>);
      }
      parts.push(
        <strong key={`${keyPrefix}-bold-${match.index}`} className="font-semibold text-purple-700">
          {match[1]}
        </strong>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(<span key={`${keyPrefix}-text-end`}>{text.slice(lastIndex)}</span>);
    }

    if (parts.length === 0) {
      return <span key={keyPrefix}>{text}</span>;
    }

    return <span key={keyPrefix}>{parts}</span>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} gap-2`}
    >
      {/* Bot Avatar */}
      {isBot && (
        <div className='flex-shrink-0 mt-1'>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            L
          </div>
        </div>
      )}
      
      {/* Message bubble */}
      <div
        className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm ${
          isBot
            ? 'bg-white text-gray-800 rounded-bl-md border border-gray-100'
            : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-md shadow-md'
        }`}
      >
        <div className='whitespace-pre-wrap break-words'>
          {isBot ? renderContent(message.text) : message.text}
        </div>
        
        {message.timestamp && (
          <div className={`text-[10px] mt-2 flex items-center gap-1 ${isBot ? 'text-gray-400' : 'text-white/60'}`}>
            <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            {isBot && <span>• Loopy AI</span>}
          </div>
        )}
      </div>
      
      {/* User Avatar */}
      {!isBot && (
        <div className='flex-shrink-0 mt-1'>
          <div className='w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center shadow-sm'>
            <HiUser className='w-4 h-4 text-white' />
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Separate component for course button to avoid closure issues
const CourseButton = ({ name, id, onClick }) => {
  const handleClick = () => {
    console.log('CourseButton clicked:', { name, id }); // Debug
    onClick(id);
  };

  return (
    <div className="my-1.5">
      <button
        onClick={handleClick}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl text-sm font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-95"
      >
        <span className="text-base">📚</span>
        <span>{name}</span>
        <span className="text-white/80 text-xs">View Course →</span>
      </button>
      <span className="ml-2 text-[10px] text-gray-400">(ID: {id})</span>
    </div>
  );
};

export default ChatMessage;