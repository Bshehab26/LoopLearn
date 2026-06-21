// src/features/chat/components/ChatInput.jsx
import { useState } from 'react';
import { HiPaperAirplane, HiEmojiHappy } from 'react-icons/hi';

const ChatInput = ({ onSend, loading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    onSend(trimmed);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='p-3 bg-white border-t flex items-end gap-2 rounded-b-2xl'>
      <button
        type='button'
        className='text-gray-400 hover:text-purple-600 transition p-1.5 rounded-full hover:bg-purple-50'
        aria-label='Emoji'
      >
        <HiEmojiHappy className='w-5 h-5' />
      </button>
      
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='Ask Loopy anything...'
        className='flex-1 p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm resize-none'
        disabled={loading}
        rows={1}
        style={{ maxHeight: '80px' }}
      />
      
      <button
        type='submit'
        disabled={!text.trim() || loading}
        className={`bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-2.5 rounded-xl transition-all ${
          text.trim() && !loading 
            ? 'hover:shadow-lg hover:scale-105' 
            : 'opacity-50 cursor-not-allowed'
        }`}
      >
        <HiPaperAirplane className='w-5 h-5' />
      </button>
    </form>
  );
};

export default ChatInput;