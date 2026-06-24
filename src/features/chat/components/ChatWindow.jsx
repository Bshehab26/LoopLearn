// src/features/chat/components/ChatWindow.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  HiX, 
  HiRefresh, 
  HiChevronDown, 
  HiChevronUp, 
  HiChatAlt2,
  HiOutlineChevronDoubleUp,
  HiOutlineChevronDoubleDown
} from 'react-icons/hi';
import axios from 'axios';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import useChat from '../hooks/useChat';

const API_BASE_URL = import.meta.env.VITE_CHAT_API_URL || 'http://localhost:8000';

const ChatWindow = ({ onClose, sessionId: initialSessionId }) => {
  const { 
    messages, 
    loading, 
    error, 
    sessionId, 
    sendMessage, 
    clearMessages,
  } = useChat({ sessionId: initialSessionId });

  const [showBackendStatus, setShowBackendStatus] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current && !isMinimized) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isMinimized]);

  // Track unread messages when minimized
  useEffect(() => {
    if (isMinimized && messages.length > 1) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.sender === 'bot') {
        setUnreadCount(prev => prev + 1);
      }
    }
  }, [messages, isMinimized]);

  // Reset unread when opened
  useEffect(() => {
    if (!isMinimized) {
      setUnreadCount(0);
    }
  }, [isMinimized]);

  // Check Python AI Chatbot health
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/ai/health`, { timeout: 5000 });
        setShowBackendStatus(response.data?.status === 'healthy' ? 'online' : 'offline');
      } catch {
        setShowBackendStatus('offline');
      }
    };
    checkBackend();
    const interval = setInterval(checkBackend, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async (text) => {
    await sendMessage(text);
  };

  const handleClear = () => {
    if (messages.length > 1 && window.confirm('Start a new conversation?')) {
      clearMessages();
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    setIsExpanded(false);
  };

  const toggleExpand = () => {
    if (isMinimized) {
      setIsMinimized(false);
      setIsExpanded(true);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  // Window size classes
  const getWindowClasses = () => {
    if (isMinimized) {
      return 'h-16 w-[92%] sm:w-80 cursor-pointer hover:shadow-xl';
    }
    if (isExpanded) {
      return 'h-[90vh] w-[95%] sm:w-[650px] lg:w-[750px]';
    }
    return 'h-[600px] w-[92%] sm:w-[420px]';
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0, scale: 0.9 }}
      animate={{ 
        y: 0, 
        opacity: 1, 
        scale: 1,
        transition: { type: 'spring', damping: 25, stiffness: 300 }
      }}
      exit={{ y: 100, opacity: 0, scale: 0.9 }}
      className={`fixed bottom-24 right-3 sm:right-6 bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200/60 backdrop-blur-md transition-all duration-300 ease-out ${getWindowClasses()}`}
    >
      {/* Header */}
      <div 
        className='flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white flex-shrink-0 select-none'
        onClick={isMinimized ? toggleMinimize : undefined}
      >
        <div className='flex items-center gap-3 min-w-0'>
          {/* Avatar with status */}
          <div className='relative flex-shrink-0'>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/40">
              <HiChatAlt2 className="w-5 h-5 text-white" />
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
              showBackendStatus === 'online' ? 'bg-green-400' : 
              showBackendStatus === 'offline' ? 'bg-red-400' : 'bg-yellow-400'
            }`} />
          </div>
          
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className='font-semibold text-sm truncate'>Loopy AI</span>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className='flex items-center gap-1.5'>
              <span className='text-[10px] opacity-80'>
                {showBackendStatus === 'online' ? '🟢 Online' : 
                 showBackendStatus === 'offline' ? '🔴 Offline' : '🟡 Connecting...'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Window controls */}
        <div className='flex gap-0.5 items-center'>
          {!isMinimized && (
            <>
              {/* Expand/Collapse */}
              <button
                onClick={(e) => { e.stopPropagation(); toggleExpand(); }}
                className='text-white/70 hover:text-white hover:bg-white/20 rounded-lg p-1.5 transition-all'
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? <HiOutlineChevronDoubleDown size={16} /> : <HiOutlineChevronDoubleUp size={16} />}
              </button>
              
              {/* New Chat */}
              <button
                onClick={(e) => { e.stopPropagation(); handleClear(); }}
                className='text-white/70 hover:text-white hover:bg-white/20 rounded-lg p-1.5 transition-all'
                title="New conversation"
              >
                <HiRefresh size={15} />
              </button>
            </>
          )}
          
          {/* Minimize/Maximize */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleMinimize(); }}
            className='text-white/70 hover:text-white hover:bg-white/20 rounded-lg p-1.5 transition-all'
            title={isMinimized ? 'Maximize' : 'Minimize'}
          >
            {isMinimized ? <HiChevronUp size={18} /> : <HiChevronDown size={18} />}
          </button>
          
          {/* Close */}
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className='text-white/70 hover:text-white hover:bg-white/20 rounded-lg p-1.5 transition-all'
            title="Close chat"
          >
            <HiX size={18} />
          </button>
        </div>
      </div>

      {/* Minimized preview bar */}
      {isMinimized && (
        <div className="px-4 py-2.5 bg-purple-50/80 text-purple-700 text-xs flex items-center gap-2">
          <span className="text-base">💬</span>
          <span className="truncate">
            {messages.length > 1 
              ? messages[messages.length - 1].text.slice(0, 45) + '...'
              : 'Click to chat with Loopy AI'}
          </span>
        </div>
      )}

      {/* Chat body */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col flex-1 overflow-hidden"
          >
            {/* Error display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className='bg-red-50 border-l-4 border-red-500 p-3 text-sm text-red-700 flex items-center gap-2 flex-shrink-0 mx-3 mt-2 rounded-r-lg'
                >
                  <span>⚠️</span>
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className='flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-gray-50/50 to-white'>
              {messages.length === 1 && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🎓</div>
                  <h3 className="text-gray-700 font-semibold mb-1">Welcome to LoopLearn!</h3>
                  <p className="text-gray-500 text-sm">Ask me about courses, recommendations, or anything!</p>
                </div>
              )}
              
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              
              {loading && (
                <div className='flex justify-start'>
                  <div className='bg-white border border-gray-100 text-gray-800 max-w-[200px] p-4 rounded-2xl rounded-bl-md shadow-sm'>
                    <div className='flex gap-2 items-center'>
                      <span className='w-2 h-2 bg-purple-500 rounded-full animate-bounce' />
                      <span className='w-2 h-2 bg-purple-500 rounded-full animate-bounce' style={{ animationDelay: '0.15s' }} />
                      <span className='w-2 h-2 bg-purple-500 rounded-full animate-bounce' style={{ animationDelay: '0.3s' }} />
                      <span className="text-xs text-gray-400 ml-1">Loopy is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex-shrink-0">
              <ChatInput onSend={handleSend} loading={loading} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatWindow;