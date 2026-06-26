// src/features/chat/pages/Chat.jsx
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import ChatButton from '../components/ChatButton';
import ChatWindow from '../components/ChatWindow';

// Optional: get user from context/auth
// import { useAuth } from '../../context/AuthContext';

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  // const { user } = useAuth();

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <>
      <ChatButton onClick={toggleChat} unreadCount={0} />
      <AnimatePresence>
        {isOpen && <ChatWindow onClose={toggleChat} />}
      </AnimatePresence>
    </>
  );
};

export default Chat;