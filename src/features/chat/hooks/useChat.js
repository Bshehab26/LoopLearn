// src/features/chat/hooks/useChat.js
// Updated to connect to Python AI Chatbot API

import { useState, useCallback, useRef } from 'react';
import axios from 'axios';

// ============================================================================
// Constants
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_CHAT_API_URL || 'http://localhost:8000';

const INITIAL_MESSAGES = [
  { 
    id: 1, 
    sender: 'bot', 
    text: "Hi! I'm Loopy, your AI course advisor 🤖 How can I help you explore courses today?",
    timestamp: new Date(),
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

const createMessage = (sender, text) => ({
  id: Date.now() + Math.random(),
  sender,
  text,
  timestamp: new Date(),
});

// ============================================================================
// Hook
// ============================================================================

const useChat = ({ 
  sessionId: providedSessionId, 
  onMessageSent, 
  onResponseReceived,
  userId = null,
} = {}) => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(() => {
    const stored = localStorage.getItem('chatSessionId');
    return providedSessionId || stored || crypto.randomUUID();
  });
  const isSendingRef = useRef(false);

  // Persist session ID
  useState(() => {
    localStorage.setItem('chatSessionId', sessionId);
  });

  /**
   * Send a message to the Python AI Chatbot API
   */
  const sendMessage = useCallback(async (text) => {
    const trimmedText = text?.trim();
    if (!trimmedText || isSendingRef.current) return;
    isSendingRef.current = true;

    // Add user message to UI immediately
    const userMessage = createMessage('user', trimmedText);
    setMessages(prev => [...prev, userMessage]);
    setError(null);
    
    if (onMessageSent) onMessageSent(trimmedText);

    setLoading(true);

    try {
      // Call Python AI Chatbot API
      const response = await axios.post(`${API_BASE_URL}/ai/chat`, {
        message: trimmedText,
        mode: 'platform_assistant',
        conversationId: sessionId,
        userId: userId,
      });

      const { 
        answer, 
        conversationId: newSessionId, 
        sources, 
        actions, 
        metadata 
      } = response.data;
      
      // Update session ID if returned by backend
      if (newSessionId && newSessionId !== sessionId) {
        setSessionId(newSessionId);
        localStorage.setItem('chatSessionId', newSessionId);
      }

      // Build bot response
      let botText = answer;
      
      // Append subtle source references
      if (sources && sources.length > 0) {
        const sourceNames = sources.map(s => s.title).join(', ');
        botText += `\n\n📚 *Sources: ${sourceNames}*`;
      }

      const botMessage = createMessage('bot', botText);
      setMessages(prev => [...prev, botMessage]);
      
      // Log for debugging
      console.log('AI Response:', {
        messageId: response.data.messageId,
        latency: metadata?.latencyMs,
        confidence: metadata?.confidence,
        toolsUsed: metadata?.toolsUsed,
        sources: sources?.map(s => s.title),
        actions: actions?.map(a => a.label),
      });
      
      if (onResponseReceived) onResponseReceived(answer);

    } catch (err) {
      const errorMsg = err.response?.data?.detail 
        || err.response?.data?.message 
        || err.message 
        || 'Failed to connect to AI assistant';
      
      setError(errorMsg);
      
      const errorMessage = createMessage(
        'bot', 
        `❌ ${errorMsg}. Please try again later.`
      );
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      isSendingRef.current = false;
    }
  }, [sessionId, userId, onMessageSent, onResponseReceived]);

  /**
   * Clear conversation and start fresh session
   */
  const clearMessages = useCallback(() => {
    setMessages(INITIAL_MESSAGES);
    const newSessionId = crypto.randomUUID();
    setSessionId(newSessionId);
    localStorage.setItem('chatSessionId', newSessionId);
    setError(null);
  }, []);

  /**
   * Fetch conversation history - not implemented yet
   */
  const fetchHistory = useCallback(async () => {
    console.log('History fetch not yet implemented in backend');
    return [];
  }, [sessionId]);

  /**
   * Remove the last message (undo)
   */
  const undoLastMessage = useCallback(() => {
    setMessages(prev => {
      if (prev.length <= 1) return prev;
      return prev.slice(0, -1);
    });
  }, []);

  /**
   * Update a specific message by ID
   */
  const updateMessage = useCallback((id, updates) => {
    setMessages(prev => prev.map(msg =>
      msg.id === id ? { ...msg, ...updates } : msg
    ));
  }, []);

  return {
    messages,
    loading,
    error,
    sessionId,
    sendMessage,
    clearMessages,
    fetchHistory,
    undoLastMessage,
    updateMessage,
    hasMessages: messages.length > 1,
    lastMessage: messages[messages.length - 1],
    messageCount: messages.length,
  };
};

export default useChat;