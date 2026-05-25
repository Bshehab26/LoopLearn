// src/features/chat/components/ChatWindow.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { HiX } from 'react-icons/hi';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

// Simple bot avatar component
const BotAvatar = () => (
  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
    L
  </div>
);

const ChatWindow = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: 'bot', 
      text: "Hi! I'm Loopy, your AI assistant 🤖 How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const generateResponse = (userText) => {
    const text = userText.toLowerCase();
    if (text.includes('course') || text.includes('learn')) {
      return "I can help you find the perfect course! What topic are you interested in? (Web Development, Data Science, Design, etc.)";
    }
    if (text.includes('instructor') || text.includes('teach')) {
      return "Would you like to become an instructor? I can guide you through the application process!";
    }
    if (text.includes('help') || text.includes('support')) {
      return "I'm here to help! You can ask me about courses, enrollment, instructors, or anything else.";
    }
    if (text.includes('price') || text.includes('cost')) {
      return "Our courses start from just a few dollars! Most courses range from $29 to $99.";
    }
    if (text.includes('certificate')) {
      return "Yes! You earn a verifiable certificate of completion when you finish a course. 🎓";
    }
    return "That's interesting! How else can I assist you today? You can ask me about courses, instructors, pricing, or certificates.";
  };

  const handleSend = async (text) => {
    // Add user message
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Show typing indicator
    setLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        sender: 'bot',
        text: generateResponse(text),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setLoading(false);
    }, 800);
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 100, opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className='fixed bottom-24 right-6 w-[90%] sm:w-96 bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200'
    >
      {/* Header */}
      <div className='flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white'>
        <div className='flex items-center gap-2'>
          <BotAvatar />
          <div>
            <span className='font-semibold'>Loopy AI Assistant</span>
            <div className='flex items-center gap-1 mt-0.5'>
              <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse' />
              <span className='text-xs opacity-80'>Online</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className='text-white hover:bg-white/20 rounded-full p-1.5 transition-all duration-200'
          aria-label='Close chat'
        >
          <HiX size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className='flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50' style={{ minHeight: '300px', maxHeight: '400px' }}>
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        
        {loading && (
          <div className='flex justify-start'>
            <div className='bg-gray-200 text-gray-800 max-w-xs p-3 rounded-2xl rounded-bl-none'>
              <div className='flex gap-1'>
                <span className='w-2 h-2 bg-gray-500 rounded-full animate-bounce' />
                <span className='w-2 h-2 bg-gray-500 rounded-full animate-bounce' style={{ animationDelay: '0.1s' }} />
                <span className='w-2 h-2 bg-gray-500 rounded-full animate-bounce' style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} loading={loading} />
    </motion.div>
  );
};

export default ChatWindow;