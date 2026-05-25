/**
 * BotAvatar.jsx
 * Chat bot avatar component with animations and welcome message.
 * Features floating animation, spring entrance, and typing indicator.
 * 
 * @module features/chat/components/BotAvatar
 */

import { motion } from 'framer-motion';
import avatar from '../../../assets/chatAvatar.png';

// ============================================================================
// Constants
// ============================================================================

/** Entrance animation variants */
const ENTRANCE_ANIMATION = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { type: 'spring', stiffness: 120, damping: 10 },
};

/** Floating animation variants */
const FLOATING_ANIMATION = {
  animate: {
    y: [0, -4, 0],
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: 'easeInOut',
    },
  },
};

/** Welcome message config */
const WELCOME_MESSAGE = {
  text: "Hi! I'm loopy, your AI assistant 🤖",
  backgroundColor: '#F3F4F6',
  textColor: '#374151',
};

// ============================================================================
// Subcomponents
// ============================================================================

/**
 * Avatar image component with floating animation
 */
const AnimatedAvatar = () => (
  <motion.img
    src={avatar}
    alt='AI Assistant'
    className='w-12 h-12 rounded-full shadow-lg bg-white object-cover'
    {...FLOATING_ANIMATION}
  />
);

/**
 * Welcome message bubble component
 */
const WelcomeBubble = () => (
  <div
    className='px-4 py-2 rounded-2xl text-sm shadow-sm'
    style={{ 
      background: WELCOME_MESSAGE.backgroundColor, 
      color: WELCOME_MESSAGE.textColor 
    }}
  >
    {WELCOME_MESSAGE.text}
  </div>
);

// ============================================================================
// Main Component
// ============================================================================

/**
 * ChatAvatar - Bot avatar with welcome message and animations
 * @returns {React.ReactElement} Chat avatar component
 */
const ChatAvatar = () => {
  return (
    <motion.div
      {...ENTRANCE_ANIMATION}
      className='flex items-center gap-3'
    >
      <AnimatedAvatar />
      <WelcomeBubble />
    </motion.div>
  );
};

export default ChatAvatar;