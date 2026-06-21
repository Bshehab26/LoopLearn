// src/features/chat/components/ChatMessage.jsx
import { motion } from 'framer-motion';
import { HiUser, HiChat } from 'react-icons/hi';
import avatar from '../../../assets/chatAvatar.png';

const ChatMessage = ({ message }) => {
  const isBot = message.sender === 'bot';

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
          <img 
            src={avatar} 
            className='w-6 h-6 rounded-full object-cover border border-gray-200'
            alt='Loopy'
          />
        </div>
      )}
      
      {/* Message bubble */}
      <div
        className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
          isBot
            ? 'bg-white text-gray-800 rounded-bl-none border border-gray-200/80'
            : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none shadow-md'
        }`}
      >
        {/* Message text with markdown-like formatting */}
        <div className='whitespace-pre-wrap break-words'>
          {message.text}
        </div>
        
        {/* Timestamp - optional */}
        {message.timestamp && (
          <div className={`text-[9px] mt-1 ${
            isBot ? 'text-gray-400' : 'text-white/70'
          }`}>
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        )}
      </div>
      
      {/* User Avatar */}
      {!isBot && (
        <div className='flex-shrink-0 mt-1'>
          <div className='w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center'>
            <HiUser className='w-3.5 h-3.5 text-white' />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessage;