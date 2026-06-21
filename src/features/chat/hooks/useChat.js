// hooks/useChat.js - Complete corrected version

import { useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { chatService } from '../api/chatService';

// ============================================================================
// Constants
// ============================================================================

const API_BASE_URL = 'http://localhost:8000';

const INITIAL_MESSAGES = [
  { 
    id: 1, 
    sender: 'bot', 
    text: "Hi! I'm Loopy, your AI assistant 🤖 How can I help you today?",
    timestamp: new Date(),
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Creates a new message object with unique ID
 */
const createMessage = (sender, text) => ({
  id: Date.now() + Math.random(), // Ensure uniqueness
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
  onResponseReceived 
} = {}) => {
  // State
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(providedSessionId || crypto.randomUUID());
  const isSendingRef = useRef(false);

  // --------------------------------------------------------------------------
  // Main Methods
  // --------------------------------------------------------------------------

  /**
   * Send a message to the EduBot API
   */
  const sendMessage = useCallback(async (text) => {
    const trimmedText = text?.trim();
    if (!trimmedText || isSendingRef.current) return;
    isSendingRef.current = true;

    // Add user message
    const userMessage = createMessage('user', trimmedText);
    setMessages(prev => [...prev, userMessage]);
    setError(null);
    
    if (onMessageSent) onMessageSent(trimmedText);

    setLoading(true);

    try {
      // Call EduBot API
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        message: trimmedText,
        session_id: sessionId,
      });

      const { reply, session_id: newSessionId, input_tokens, output_tokens } = response.data;
      
      // Update session ID if returned
      if (newSessionId && newSessionId !== sessionId) {
        setSessionId(newSessionId);
        // Optionally persist to localStorage
        localStorage.setItem('chatSessionId', newSessionId);
      }

      // Add bot response
      const botMessage = createMessage('bot', reply);
      setMessages(prev => [...prev, botMessage]);
      
      if (onResponseReceived) onResponseReceived(reply);

      // Optional: Track token usage
      console.log(`Tokens used: ${input_tokens} input, ${output_tokens} output`);

    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to send message';
      setError(errorMsg);
      
      // Add error message to chat
      const errorMessage = createMessage('bot', `❌ ${errorMsg}`);
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      isSendingRef.current = false;
    }
  }, [sessionId, onMessageSent, onResponseReceived]);

  /**
   * Clear all messages and reset session
   */
  const clearMessages = useCallback(async () => {
    try {
      // Clear session on backend
      await axios.delete(`${API_BASE_URL}/chat/${sessionId}`);
      setMessages(INITIAL_MESSAGES);
      // Remove from localStorage
      localStorage.removeItem('chatSessionId');
    } catch (err) {
      console.error('Failed to clear session:', err);
      // Still reset locally
      setMessages(INITIAL_MESSAGES);
    }
  }, [sessionId]);

  /**
   * Fetch conversation history from backend
   */
  const fetchHistory = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chat/${sessionId}`);
      if (response.data.messages?.length > 0) {
        // Convert API messages to your format
        const historyMessages = response.data.messages.map((msg, index) => ({
          id: Date.now() + index,
          sender: msg.role === 'user' ? 'user' : 'bot',
          text: msg.content,
          timestamp: new Date(),
        }));
        // Keep welcome message + history
        setMessages([INITIAL_MESSAGES[0], ...historyMessages]);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  }, [sessionId]);

  /**
   * Search for courses and add results to chat
   */
  const searchCourses = useCallback(async (query) => {
    if (!query?.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const results = await chatService.searchCourses(query);
      
      if (results.results?.length === 0) {
        const botMessage = createMessage('bot', `No courses found for "${query}". Try a different search term!`);
        setMessages(prev => [...prev, botMessage]);
        return { results: [], total: 0 };
      }
      
      // Format results for display
      const courseList = results.results.map((course, i) => 
        `${i + 1}. **${course.title}** (${course.level})\n   ${course.description?.substring(0, 80)}...\n   ⏱ ${course.duration_hours}h | 💰 $${course.price_usd} | ⭐ ${course.rating}`
      ).join('\n\n');
      
      const botMessage = createMessage('bot', 
        `🔍 Found **${results.total}** courses matching "${query}":\n\n${courseList}\n\nType a course ID (e.g., ${results.results[0]?.id}) for more details!`
      );
      setMessages(prev => [...prev, botMessage]);
      
      return results;
    } catch (err) {
      const errorMsg = err.message || 'Failed to search courses';
      setError(errorMsg);
      const errorMessage = createMessage('bot', `❌ Error searching courses: ${errorMsg}`);
      setMessages(prev => [...prev, errorMessage]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get course details by ID
   */
  const getCourseDetails = useCallback(async (courseId) => {
    if (!courseId?.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const course = await chatService.getCourse(courseId);
      
      const details = `📚 **${course.title}**\n` +
        `👨‍🏫 Instructor: ${course.instructor}\n` +
        `📂 Category: ${course.category}\n` +
        `📊 Level: ${course.level}\n` +
        `⏱ Duration: ${course.duration_hours} hours\n` +
        `💰 Price: $${course.price_usd}\n` +
        `⭐ Rating: ${course.rating}/5\n\n` +
        `📝 **Description:**\n${course.description}\n\n` +
        `${course.prerequisites?.length ? `📋 **Prerequisites:** ${course.prerequisites.join(', ')}` : '✅ No prerequisites required'}`;
      
      const botMessage = createMessage('bot', details);
      setMessages(prev => [...prev, botMessage]);
      
      return course;
    } catch (err) {
      const errorMsg = err.message || 'Failed to get course details';
      setError(errorMsg);
      const errorMessage = createMessage('bot', `❌ ${errorMsg}`);
      setMessages(prev => [...prev, errorMessage]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

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

  // --------------------------------------------------------------------------
  // Return Value
  // --------------------------------------------------------------------------

  return {
    // Data
    messages,
    loading,
    error,
    sessionId,
    
    // Actions
    sendMessage,
    clearMessages,
    fetchHistory,
    searchCourses,
    getCourseDetails,
    undoLastMessage,
    updateMessage,
    
    // Derived state
    hasMessages: messages.length > 1,
    lastMessage: messages[messages.length - 1],
    messageCount: messages.length,
  };
};

export default useChat;