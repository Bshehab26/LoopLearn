// src/features/chat/components/ChatButton.jsx
import { motion } from 'framer-motion';
import { HiChatAlt2 } from 'react-icons/hi';

const ChatButton = ({ onClick, unreadCount = 0 }) => {
  return (
    <motion.button
      onClick={onClick}
      className='fixed bottom-6 right-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xl shadow-purple-500/30 flex items-center justify-center z-50 cursor-pointer group hover:shadow-2xl hover:shadow-purple-500/40 transition-shadow'
      style={{ width: 60, height: 60 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      aria-label='Open chat'
    >
      {/* Pulse ring */}
      <motion.div
        className='absolute inset-0 rounded-2xl bg-purple-500'
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: 'easeInOut',
        }}
      />
      
      {/* Icon */}
      <div className='relative z-10 text-white'>
        <HiChatAlt2 size={28} />
      </div>
      
      {/* Unread badge */}
      {unreadCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className='absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center z-20 border-2 border-white px-1'
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </motion.span>
      )}
      
      {/* Tooltip */}
      <span className='absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none shadow-xl'>
        💬 Chat with Loopy
      </span>
    </motion.button>
  );
};

export default ChatButton;