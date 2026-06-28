// src/features/chat/components/ChatInput.jsx
import { useState, useRef, useEffect } from 'react';
import { HiPaperAirplane } from 'react-icons/hi';

const ChatInput = ({ onSend, loading, inputRef: externalRef, autoFocus = false }) => {
  const [text, setText] = useState('');
  const localRef = useRef(null);
  // Allow ChatWindow to imperatively re-focus this field (e.g. after a
  // response finishes loading) while still using our own ref locally for
  // the auto-resize logic.
  const textareaRef = externalRef || localRef;

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }, [text, textareaRef]);

  // Focus when the chat window opens (first open, or reopen from minimized)
  useEffect(() => {
    if (autoFocus && !loading) {
      textareaRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFocus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    onSend(trimmed);
    setText('');
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