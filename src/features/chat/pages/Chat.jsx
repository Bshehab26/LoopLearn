// src/features/chat/pages/Chat.jsx
import React, { useState, useEffect } from 'react';
import ChatButton from '../components/ChatButton';
import ChatWindow from '../components/ChatWindow';
import { AnimatePresence } from 'framer-motion';

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState(() => {
    const stored = localStorage.getItem('chatSessionId');
    return stored || crypto.randomUUID();
  });

  useEffect(() => {
    localStorage.setItem('chatSessionId', sessionId);
  }, [sessionId]);

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <>
      <ChatButton onClick={toggleChat} unreadCount={0} />
      
      <AnimatePresence>
        {isOpen && (
          <ChatWindow 
            onClose={toggleChat} 
            sessionId={sessionId}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Chat;