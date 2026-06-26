// src/features/chat/hooks/useChat.js
import { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';

// Use the proxy URL (your frontend dev server)
const API_BASE_URL = import.meta.env.VITE_CHAT_API_URL || 'http://localhost:5173';

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'bot',
    text: "Hi! I'm Loopy, your AI course advisor 🤖 How can I help you explore courses today?",
    timestamp: new Date(),
    sources: [],
    actions: [],
    recommendedCourses: [],
    metadata: null,
  },
];

const createMessage = (sender, text, extra = {}) => ({
  id: Date.now() + Math.random(),
  sender,
  text,
  timestamp: new Date(),
  ...extra,
});

const useChat = ({
  sessionId: providedSessionId,
  userId = null,
  onMessageSent,
  onResponseReceived,
} = {}) => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isServiceAvailable, setIsServiceAvailable] = useState(true); // Assume available initially
  const [sessionId, setSessionId] = useState(() => {
    const stored = localStorage.getItem('chatSessionId');
    return providedSessionId || stored || crypto.randomUUID();
  });
  const isSendingRef = useRef(false);

  // Persist session
  useEffect(() => {
    localStorage.setItem('chatSessionId', sessionId);
  }, [sessionId]);

  // Simple health check
  const checkHealth = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ai/health`, { 
        timeout: 3000,
      });
      const isHealthy = response.data?.status === 'healthy';
      setIsServiceAvailable(isHealthy);
      if (isHealthy) setError(null);
      return isHealthy;
    } catch (err) {
      setIsServiceAvailable(false);
      return false;
    }
  }, []);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text?.trim();
      if (!trimmed || isSendingRef.current) return;

      isSendingRef.current = true;

      // User message
      const userMessage = createMessage('user', trimmed);
      setMessages((prev) => [...prev, userMessage]);
      setError(null);
      if (onMessageSent) onMessageSent(trimmed);

      setLoading(true);

      try {
        const payload = {
          message: trimmed,
          mode: 'platform_assistant',
          conversationId: sessionId,
          userId: userId,
        };

        console.log('[Chat] 📡 Sending to proxy:', `${API_BASE_URL}/ai/chat`);
        console.log('[Chat] 📦 Payload:', payload);

        const response = await axios.post(`${API_BASE_URL}/ai/chat`, payload, {
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });

        console.log('[Chat] ✅ Response:', response.data);

        const {
          answer,
          conversationId: newSessionId,
          sources = [],
          actions = [],
          metadata = null,
          recommendedCourses = [],
        } = response.data;

        if (newSessionId && newSessionId !== sessionId) {
          setSessionId(newSessionId);
          localStorage.setItem('chatSessionId', newSessionId);
        }

        const botMessage = createMessage('bot', answer, {
          sources,
          actions,
          recommendedCourses,
          metadata,
        });

        setMessages((prev) => [...prev, botMessage]);

        if (onResponseReceived) onResponseReceived(answer);
        
        // Service is available since we got a response
        setIsServiceAvailable(true);
        setError(null);

      } catch (err) {
        console.error('[Chat] ❌ Error:', err);
        
        let errorMsg = 'Failed to connect to AI assistant';

        if (err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
          errorMsg = '⚠️ Cannot reach AI service. Make sure it\'s running on port 8000.';
          setIsServiceAvailable(false);
        } else if (err.response?.status === 500) {
          errorMsg = '⚠️ AI service error. Please try again.';
        } else if (err.response?.data?.detail) {
          errorMsg = err.response.data.detail;
        } else if (err.message) {
          errorMsg = err.message;
        }

        setError(errorMsg);

        const errorMessage = createMessage(
          'bot',
          `❌ ${errorMsg}`,
          { isError: true }
        );
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setLoading(false);
        isSendingRef.current = false;
      }
    },
    [sessionId, userId, onMessageSent, onResponseReceived]
  );

  const clearMessages = useCallback(() => {
    setMessages(INITIAL_MESSAGES);
    const newSessionId = crypto.randomUUID();
    setSessionId(newSessionId);
    localStorage.setItem('chatSessionId', newSessionId);
    setError(null);
  }, []);

  return {
    messages,
    loading,
    error,
    sessionId,
    isServiceAvailable,
    sendMessage,
    clearMessages,
    checkHealth,
    hasMessages: messages.length > 1,
    lastMessage: messages[messages.length - 1],
    messageCount: messages.length,
  };
};

export default useChat;