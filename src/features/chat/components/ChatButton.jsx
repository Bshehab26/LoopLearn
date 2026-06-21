/**
 * ChatButton.jsx
 * Floating chat button component with animations.
 * Opens chat window when clicked.
 * 
 * @module features/chat/components/ChatButton
 */

import { motion } from 'framer-motion';
import { HiChat } from 'react-icons/hi';

// ============================================================================
// Constants
// ============================================================================

/** Button dimensions */
const BUTTON_SIZE = {
  width: 56,
  height: 56,
};

/** Animation variants */
const BUTTON_ANIMATION = {
  whileHover: { scale: 1.1, boxShadow: '0 8px 30px rgba(83, 74, 183, 0.4)' },
  whileTap: { scale: 0.95 },
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { type: 'spring', stiffness: 260, damping: 20 },
};

/** Pulse animation for attention */
const PULSE_ANIMATION = {
  animate: {
    boxShadow: [
      '0 0 0 0 rgba(83, 74, 183, 0.4)',
      '0 0 0 15px rgba(83, 74, 183, 0)',
      '0 0 0 0 rgba(83, 74, 183, 0)',
    ],
    transition: {
      repeat: Infinity,
      duration: 2.5,
      repeatDelay: 2,
    },
  },
};

/** Wave animation for the icon */
const WAVE_ANIMATION = {
  animate: {
    rotate: [0, -5, 5, -5, 0],
    transition: {
      repeat: Infinity,
      duration: 2,
      repeatDelay: 4,
      ease: 'easeInOut',
    },
  },
};

// ============================================================================
// Main Component
// ============================================================================

/**
 * ChatButton - Floating chat button with animations
 * @param {Object} props
 * @param {Function} props.onClick - Click handler to open chat
 * @param {boolean} props.hasNotifications - Whether to show pulse effect
 * @param {number} props.unreadCount - Number of unread messages
 * @returns {React.ReactElement} Chat button component
 */
const ChatButton = ({ 
  onClick, 
  hasNotifications = false,
  unreadCount = 0 
}) => {
  return (
    <motion.button
      onClick={onClick}
      className='fixed bottom-6 right-6 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xl flex items-center justify-center z-50 cursor-pointer group'
      style={{ width: BUTTON_SIZE.width, height: BUTTON_SIZE.height }}
      {...BUTTON_ANIMATION}
      aria-label='Open chat'
    >
      {/* Pulse ring effect */}
      <motion.div
        className='absolute inset-0 rounded-full'
        {...PULSE_ANIMATION}
      />
      
      {/* Chat icon with wave animation */}
      <motion.div
        {...WAVE_ANIMATION}
        className='relative z-10 text-white'
      >
        <HiChat size={26} />
      </motion.div>
      
      {/* Unread count badge */}
      {unreadCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className='absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center z-20 border-2 border-white'
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </motion.span>
      )}
      
      {/* Tooltip on hover */}
      <span className='absolute right-full mr-3 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none shadow-lg'>
        💬 Chat with Loopy
      </span>
    </motion.button>
  );
};

export default ChatButton;