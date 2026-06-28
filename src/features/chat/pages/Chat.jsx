// src/features/chat/pages/Chat.jsx
import React, { useState } from 'react';
import ChatButton from '../components/ChatButton';
import ChatWindow from '../components/ChatWindow';

// Optional: get user from context/auth
// import { useAuth } from '../../context/AuthContext';

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  // const { user } = useAuth();

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
    if (!hasOpenedOnce) setHasOpenedOnce(true);
  };

  return (
    <>
      <ChatButton onClick={toggleChat} unreadCount={0} isOpen={isOpen} />

      {/*
        IMPORTANT: ChatWindow stays mounted once it has been opened the first time.
        Unmounting it (e.g. via conditional rendering or AnimatePresence-removal)
        destroys the `useChat` hook's in-memory state — every message in the
        current conversation — even though the conversation id is persisted to
        localStorage. There is no "resume by id" fetch on the backend, so once
        the component unmounts, the messages are gone for good on reopen.

        Instead, we keep it mounted permanently after first open and let
        ChatWindow itself control its own visibility/animation based on `isOpen`.
      */}
      {hasOpenedOnce && (
        <ChatWindow isOpen={isOpen} onClose={toggleChat} />
      )}
    </>
  );
};

export default Chat;