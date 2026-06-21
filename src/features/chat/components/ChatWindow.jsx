// src/features/chat/components/ChatWindow.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { HiX, HiRefresh, HiChat } from 'react-icons/hi';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import BotAvatar from './BotAvatar';
import useChat from '../hooks/useChat';
import { chatService } from '../api/chatService';

const ChatWindow = ({ onClose, sessionId: initialSessionId }) => {
  const { 
    messages, 
    loading, 
    error, 
    sessionId, 
    sendMessage, 
    clearMessages,
    fetchHistory 
  } = useChat({ sessionId: initialSessionId });

  const [showBackendStatus, setShowBackendStatus] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  // Check backend health on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        await chatService.checkHealth();
        setShowBackendStatus('online');
        if (initialSessionId) {
          await fetchHistory();
        }
      } catch {
        setShowBackendStatus('offline');
      }
    };
    checkBackend();
  }, []);

  const handleSend = async (text) => {
    await sendMessage(text);
  };

  const handleClear = async () => {
    if (messages.length > 1 && window.confirm('Start a new conversation?')) {
      await clearMessages();
    }
  };

  // Minimize/Expand icon
  const MinMaxIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d={isMinimized ? "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" : "M20 12H4"} 
      />
    </svg>
  );

  return (
    <motion.div
      initial={{ y: 50, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 50, opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={`fixed bottom-24 right-6 w-[92%] sm:w-96 bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200/50 backdrop-blur-sm ${
        isMinimized ? 'h-14' : 'h-[580px]'
      }`}
    >
      {/* Header */}
      <div className='flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white flex-shrink-0'>
        <div className='flex items-center gap-3'>
          <div className='relative'>
            <BotAvatar />
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
              showBackendStatus === 'online' ? 'bg-green-400' : 
              showBackendStatus === 'offline' ? 'bg-red-400' : 'bg-yellow-400'
            }`} />
          </div>
          <div>
            <span className='font-semibold text-sm'>Loopy AI</span>
            <div className='flex items-center gap-1.5 mt-0.5'>
              <span className='text-[10px] opacity-80'>
                {showBackendStatus === 'online' ? '🟢 Online' : 
                 showBackendStatus === 'offline' ? '🔴 Offline' : '🟡 Connecting...'}
              </span>
            </div>
          </div>
        </div>
        
        <div className='flex gap-0.5'>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className='text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-1.5 transition-all duration-200'
            aria-label={isMinimized ? 'Expand' : 'Minimize'}
          >
            <MinMaxIcon />
          </button>
          <button
            onClick={handleClear}
            className='text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-1.5 transition-all duration-200'
            aria-label='New conversation'
            title='New conversation'
          >
            <HiRefresh size={16} />
          </button>
          <button
            onClick={onClose}
            className='text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-1.5 transition-all duration-200'
            aria-label='Close chat'
          >
            <HiX size={18} />
          </button>
        </div>
      </div>

      {/* Chat body - Hidden when minimized */}
      {!isMinimized && (
        <>
          {/* Error display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className='bg-red-50 border-l-4 border-red-500 p-3 text-sm text-red-700 flex items-center gap-2 flex-shrink-0'
              >
                <span>⚠️</span>
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <div className='flex-1 p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-gray-50 to-white min-h-[300px] max-h-[400px]'>
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            
            {loading && (
              <div className='flex justify-start'>
                <div className='bg-white border border-gray-200 text-gray-800 max-w-xs p-3 rounded-2xl rounded-bl-none shadow-sm'>
                  <div className='flex gap-1.5'>
                    <span className='w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce' />
                    <span className='w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce' style={{ animationDelay: '0.1s' }} />
                    <span className='w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce' style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <ChatInput onSend={handleSend} loading={loading} />
        </>
      )}
    </motion.div>
  );
};

export default ChatWindow;