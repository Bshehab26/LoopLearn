// src/features/chat/components/ChatWindow.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  HiX,
  HiRefresh,
  HiChevronDown,
  HiChevronUp,
  HiOutlineChevronDoubleUp,
  HiOutlineChevronDoubleDown,
  HiExclamationCircle,
} from 'react-icons/hi';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import useChat from '../hooks/useChat';
import avatar from '../../../assets/chatAvatar.png';

// `isOpen` controls visibility via animation only — this component stays
// mounted across open/close cycles so the conversation in useChat's state
// is never lost. See Chat.jsx for why.
const ChatWindow = ({ isOpen, onClose, sessionId: initialSessionId, userId = null }) => {
  const {
    messages,
    loading,
    error,
    sessionId,
    sendMessage,
    clearMessages,
    isServiceAvailable,
  } = useChat({
    sessionId: initialSessionId,
    userId: userId,
  });

  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const location = useLocation();
  const previousPathRef = useRef(location.pathname);

  // Auto-minimize on navigation. ChatWindow intentionally stays mounted
  // across route changes (so the conversation survives), but it shouldn't
  // keep floating fully open over every new page the user navigates to —
  // that reads as the widget "following you around" rather than a
  // dismissible assistant. Minimizing (not closing) keeps the unread
  // badge / conversation state intact and lets the user reopen with one
  // click if they still want it.
  useEffect(() => {
    if (location.pathname !== previousPathRef.current) {
      previousPathRef.current = location.pathname;
      if (isOpen && !isMinimized) {
        setIsMinimized(true);
        setIsExpanded(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current && !isMinimized && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isMinimized, isOpen]);

  // Track unread messages when minimized or closed
  useEffect(() => {
    if ((isMinimized || !isOpen) && messages.length > 1) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.sender === 'bot') {
        setUnreadCount((prev) => prev + 1);
      }
    }
  }, [messages, isMinimized, isOpen]);

  // Reset unread when opened and not minimized
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setUnreadCount(0);
    }
  }, [isOpen, isMinimized]);

  // Re-focus the input after a response comes back, so the user can keep
  // typing immediately without re-clicking the field.
  useEffect(() => {
    if (!loading && isOpen && !isMinimized) {
      // small delay lets the new message render / scroll finish first
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [loading, isOpen, isMinimized]);

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

  // Window size + position classes.
  // Non-expanded states anchor from the bottom (grows from the launcher).
  // The default (non-expanded, non-minimized) size now uses a smaller base
  // height AND a max-height capped relative to the viewport — fixed h-[600px]
  // was tall enough to collide with the navbar on common laptop viewport
  // heights (~700-768px), since bottom-24 (96px) + 600px leaves very little
  // room above. Capping against 100vh guarantees breathing room up top
  // regardless of screen size.
  // Expanded state anchors from the TOP instead — anchoring a tall (90vh)
  // box from the bottom (bottom-24 = 96px up) pushes its top edge above
  // y=0 on common viewport heights, which is what was cutting off the
  // header/avatar. Anchoring from the top with a fixed margin guarantees
  // the whole window — including the header — stays on-screen.
  const getWindowClasses = () => {
    if (isMinimized) {
      return 'bottom-24 h-16 w-[92%] sm:w-80 cursor-pointer hover:shadow-xl';
    }
    if (isExpanded) {
      return 'top-6 bottom-6 h-auto w-[95%] sm:w-[650px] lg:w-[750px]';
    }
    return 'bottom-24 h-[520px] max-h-[calc(100vh-160px)] w-[92%] sm:w-[400px]';
  };

  return (
    <motion.div
      initial={false}
      animate={
        isOpen
          ? { y: 0, opacity: 1, scale: 1, pointerEvents: 'auto' }
          : { y: 40, opacity: 0, scale: 0.95, pointerEvents: 'none' }
      }
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      aria-hidden={!isOpen}
      // overflow-hidden restored now that the window can never extend past
      // the viewport — this is what keeps the rounded corners crisp.
      className={`fixed right-3 sm:right-6 bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200/60 backdrop-blur-md transition-[width,height,top,bottom] duration-300 ease-out ${getWindowClasses()}`}
    >
      {/* Header */}
      <div
        className='relative flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white flex-shrink-0 select-none'
        onClick={isMinimized ? toggleMinimize : undefined}
      >
        <div className='flex items-center gap-3 min-w-0'>
          <div className='relative flex-shrink-0'>
            <img
              src={avatar}
              alt='Loopy AI'
              className='w-9 h-9 rounded-full object-cover border-2 border-white/40 bg-white/20'
            />
            <div
              className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white transition-colors duration-500 ${
                isServiceAvailable ? 'bg-green-400' : 'bg-red-400'
              }`}
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className='font-semibold text-sm truncate'>Loopy AI</span>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className='flex items-center gap-1.5'>
              <span className='text-[10px] opacity-80 flex items-center gap-1'>
                <span
                  className={`inline-block w-1.5 h-1.5 rounded-full ${
                    isServiceAvailable ? 'bg-green-300 animate-pulse' : 'bg-red-300'
                  }`}
                />
                {isServiceAvailable ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        {/*
          Window controls — ordered by convention:
          Refresh (utility, low-stakes) → Minimize (reversible) →
          Expand (reversible, bigger visual jump) → Close (kept furthest
          from the others, isolated, since it's the only destructive-feeling
          action — even though we no longer lose data on close, it should
          still read as visually distinct from the rest).
        */}
        <div className='flex gap-0.5 items-center'>
          {!isMinimized && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handleClear(); }}
                className='text-white/70 hover:text-white hover:bg-white/20 rounded-lg p-1.5 transition-all'
                title="New conversation"
                aria-label="Start a new conversation"
              >
                <HiRefresh size={15} />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); toggleMinimize(); }}
                className='text-white/70 hover:text-white hover:bg-white/20 rounded-lg p-1.5 transition-all'
                title="Minimize"
                aria-label="Minimize chat"
              >
                <HiChevronDown size={18} />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); toggleExpand(); }}
                className='text-white/70 hover:text-white hover:bg-white/20 rounded-lg p-1.5 transition-all'
                title={isExpanded ? 'Collapse' : 'Expand'}
                aria-label={isExpanded ? 'Collapse chat window' : 'Expand chat window'}
              >
                {isExpanded ? <HiOutlineChevronDoubleDown size={16} /> : <HiOutlineChevronDoubleUp size={16} />}
              </button>
            </>
          )}

          {isMinimized && (
            <button
              onClick={(e) => { e.stopPropagation(); toggleMinimize(); }}
              className='text-white/70 hover:text-white hover:bg-white/20 rounded-lg p-1.5 transition-all'
              title="Maximize"
              aria-label="Maximize chat"
            >
              <HiChevronUp size={18} />
            </button>
          )}

          {/* Visual separator before the destructive action */}
          <span className='w-px h-5 bg-white/25 mx-1' />

          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className='text-white/70 hover:text-white hover:bg-white/20 rounded-lg p-1.5 transition-all'
            title="Close chat"
            aria-label="Close chat"
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
          {!isServiceAvailable && (
            <span className="text-[10px] text-red-500 ml-auto flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              offline
            </span>
          )}
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
                  className='mx-3 mt-2 p-3 rounded-lg flex items-start gap-2 text-sm bg-red-50 border-l-4 border-red-500 text-red-700'
                >
                  <HiExclamationCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
                  <div className="flex-1">
                    <p className="font-medium">Error</p>
                    <p className="text-xs opacity-90 mt-0.5">{error}</p>
                  </div>
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
              <ChatInput onSend={handleSend} loading={loading} inputRef={inputRef} autoFocus={isOpen} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatWindow;