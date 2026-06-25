// src/features/chat/components/ChatInput.jsx
import { useState, useRef, useEffect } from 'react';
import { HiPaperAirplane, HiEmojiHappy } from 'react-icons/hi';

const ChatInput = ({ onSend, loading }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }, [text]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    onSend(trimmed);
    setText('');
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='p-3 bg-white border-t border-gray-100 flex items-end gap-2'>
      <button
        type='button'
        className='text-gray-400 hover:text-purple-600 transition p-2 rounded-full hover:bg-purple-50 flex-shrink-0'
        aria-label='Emoji'
      >
        <HiEmojiHappy className='w-5 h-5' />
      </button>
      
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='Ask Loopy about courses...'
        className='flex-1 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm resize-none bg-gray-50/50 focus:bg-white transition-all'
        disabled={loading}
        rows={1}
        style={{ maxHeight: '120px', minHeight: '44px' }}
      />
      
      <button
        type='submit'
        disabled={!text.trim() || loading}
        className={`flex-shrink-0 p-3 rounded-xl transition-all ${
          text.trim() && !loading 
            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:scale-105 active:scale-95' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        <HiPaperAirplane className={`w-5 h-5 ${text.trim() && !loading ? 'rotate-90' : ''}`} />
      </button>
    </form>
  );
};

export default ChatInput;