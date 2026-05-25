/**
 * ChatButton.jsx
 * Floating chat button component with animations.
 * Opens chat window when clicked.
 * 
 * @module features/chat/components/ChatButton
 */

import { motion } from 'framer-motion';
import avatar from '../../../assets/chatAvatar.png';

// ============================================================================
// Constants
// ============================================================================

/** Button dimensions */
const BUTTON_SIZE = {
  width: 64,
  height: 64,
};

/** Avatar size */
const AVATAR_SIZE = {
  width: 40,
  height: 40,
};

/** Animation variants */
const BUTTON_ANIMATION = {
  whileHover: { scale: 1.1 },
  whileTap: { scale: 0.95 },
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { type: 'spring', stiffness: 260, damping: 20 },
};

/** Pulse animation for attention (optional) */
const PULSE_ANIMATION = {
  animate: {
    boxShadow: [
      '0 0 0 0 rgba(83, 74, 183, 0.4)',
      '0 0 0 10px rgba(83, 74, 183, 0)',
      '0 0 0 0 rgba(83, 74, 183, 0)',
    ],
    transition: {
      repeat: Infinity,
      duration: 2,
      repeatDelay: 3,
    },
  },
};

// ============================================================================
// Subcomponents
// ============================================================================

/**
 * Chat avatar image component
 */
const ChatAvatar = () => (
  <img 
    src={avatar} 
    className='rounded-full object-cover' 
    style={{ width: AVATAR_SIZE.width, height: AVATAR_SIZE.height }}
    alt='Chat assistant' 
  />
);

/**
 * Pulse effect overlay (optional notification indicator)
 */
const PulseEffect = ({ show = false }) => {
  if (!show) return null;
  
  return (
    <motion.div
      className='absolute inset-0 rounded-full'
      {...PULSE_ANIMATION}
    />
  );
};

// ============================================================================
// Main Component
// ============================================================================

/**
 * ChatButton - Floating chat button with animations
 * @param {Object} props
 * @param {Function} props.onClick - Click handler to open chat
 * @param {boolean} props.hasNotifications - Whether to show pulse effect (optional)
 * @returns {React.ReactElement} Chat button component
 */
const ChatButton = ({ onClick, hasNotifications = false }) => {
  return (
    <motion.button
      onClick={onClick}
      className='fixed bottom-6 right-6 rounded-full bg-purple-600 shadow-xl flex items-center justify-center z-50 cursor-pointer group'
      style={{ width: BUTTON_SIZE.width, height: BUTTON_SIZE.height }}
      {...BUTTON_ANIMATION}
      aria-label='Open chat'
    >
      <ChatAvatar />
      <PulseEffect show={hasNotifications} />
      
      {/* Tooltip on hover */}
      <span className='absolute right-full mr-3 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none'>
        Chat with us
      </span>
    </motion.button>
  );
};

export default ChatButton;