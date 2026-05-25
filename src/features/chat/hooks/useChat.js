/**
 * useChat.js
 * Custom hook for managing chat state and message handling.
 * Manages messages, loading states, and AI response generation.
 * 
 * @module features/chat/hooks/useChat
 * 
 * @example
 * const { messages, loading, sendMessage, clearMessages } = useChat();
 * 
 * // Send a message
 * await sendMessage("Hello, I need help with a course");
 * 
 * // Clear all messages
 * clearMessages();
 */

import { useState, useCallback, useRef } from 'react';

// ============================================================================
// Constants
// ============================================================================

/** Initial welcome message */
const INITIAL_MESSAGES = [
  { 
    id: 1, 
    sender: 'bot', 
    text: "Hi! I'm Loopy, your AI assistant 🤖 How can I help you today?",
    timestamp: new Date(),
  },
];

/** Response delay in milliseconds (simulates AI thinking) */
const RESPONSE_DELAY = 800;

/** Message ID counter start */
const STARTING_ID = 2;

// ============================================================================
// AI Response Configuration
// ============================================================================

/**
 * Keyword-response mapping for the AI assistant
 * Add more keywords and responses here to expand functionality
 */
const RESPONSE_RULES = [
  {
    keywords: ['course', 'learn', 'study', 'skill'],
    response: "I can help you find the perfect course! What topic are you interested in? (Web Development, Data Science, Design, etc.)",
  },
  {
    keywords: ['instructor', 'teach', 'become instructor', 'teaching'],
    response: "Would you like to become an instructor? I can guide you through the application process! Check our instructor dashboard to get started.",
  },
  {
    keywords: ['help', 'support', 'issue', 'problem', 'trouble'],
    response: "I'm here to help! You can ask me about courses, enrollment, instructors, or anything else. Our support team is also available 24/7.",
  },
  {
    keywords: ['price', 'cost', 'pricing', 'expensive', 'cheap', 'affordable'],
    response: "Our courses start from just a few dollars! Most courses range from $29 to $99. Would you like to see some options?",
  },
  {
    keywords: ['certificate', 'certification', 'cert', 'credential'],
    response: "Yes! You earn a verifiable certificate of completion when you finish a course. 🎓 These can be shared on LinkedIn and your resume.",
  },
  {
    keywords: ['discount', 'sale', 'offer', 'promotion', 'coupon'],
    response: "We often have discounts and special offers! Check the course page or subscribe to our newsletter for the latest deals.",
  },
  {
    keywords: ['payment', 'pay', 'credit card', 'visa', 'mastercard', 'paypal'],
    response: "We accept credit cards (Visa, Mastercard, Amex), PayPal, and other major payment methods. All transactions are secure and encrypted.",
  },
  {
    keywords: ['refund', 'money back', 'guarantee'],
    response: "We offer a 30-day money-back guarantee on all courses. If you're not satisfied, we'll refund your purchase—no questions asked!",
  },
  {
    keywords: ['access', 'lifetime', 'forever'],
    response: "All courses come with lifetime access! You can learn at your own pace and revisit the content anytime.",
  },
  {
    keywords: ['mobile', 'app', 'phone', 'tablet'],
    response: "Yes! All our courses are accessible on mobile devices and tablets. Learn anytime, anywhere! 📱",
  },
];

/** Default fallback response when no keywords match */
const DEFAULT_RESPONSE = "That's interesting! How else can I assist you today? You can ask me about courses, instructors, pricing, certificates, or payment options.";

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generates a unique message ID
 * @returns {number} Unique ID
 */
const generateId = () => Date.now();

/**
 * Checks if user input matches any keywords
 * @param {string} userText - User's message
 * @param {Array<string>} keywords - Array of keywords to match
 * @returns {boolean} True if any keyword matches
 */
const matchesKeyword = (userText, keywords) => {
  const lowerText = userText.toLowerCase();
  return keywords.some(keyword => lowerText.includes(keyword));
};

/**
 * Generates AI response based on user input
 * @param {string} userText - User's message text
 * @returns {string} AI response
 */
const generateResponse = (userText) => {
  // Find matching rule
  const matchedRule = RESPONSE_RULES.find(rule => 
    matchesKeyword(userText, rule.keywords)
  );
  
  // Return matched response or default
  return matchedRule?.response || DEFAULT_RESPONSE;
};

/**
 * Creates a new message object
 * @param {string} sender - Message sender ('bot' or 'user')
 * @param {string} text - Message text
 * @returns {Object} Message object
 */
const createMessage = (sender, text) => ({
  id: generateId(),
  sender,
  text,
  timestamp: new Date(),
});

// ============================================================================
// Hook
// ============================================================================

/**
 * useChat - Manages chat state and message handling
 * @param {Object} options - Configuration options
 * @param {Function} options.onMessageSent - Callback when message is sent
 * @param {Function} options.onResponseReceived - Callback when response is received
 * @returns {Object} Chat state and control functions
 */
const useChat = ({ onMessageSent, onResponseReceived } = {}) => {
  // --------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [loading, setLoading] = useState(false);
  
  // Refs for preventing duplicate sends
  const isSendingRef = useRef(false);

  // --------------------------------------------------------------------------
  // Public Methods
  // --------------------------------------------------------------------------
  
  /**
   * Sends a user message and generates bot response
   * @param {string} text - User's message text
   * @returns {Promise<void>}
   */
  const sendMessage = useCallback(async (text) => {
    // Validate input
    const trimmedText = text?.trim();
    if (!trimmedText) return;
    
    // Prevent duplicate sends while loading
    if (isSendingRef.current) return;
    isSendingRef.current = true;
    
    // Create user message
    const userMessage = createMessage('user', trimmedText);
    setMessages(prev => [...prev, userMessage]);
    
    // Call onMessageSent callback
    if (onMessageSent) {
      onMessageSent(trimmedText);
    }
    
    // Show typing indicator
    setLoading(true);
    
    // Simulate AI response (replace with actual API call)
    // TODO: Replace with real AI API endpoint
    // const response = await api.post('/chat/message', { message: trimmedText });
    // const botText = response.data.reply;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const responseText = generateResponse(trimmedText);
        const botMessage = createMessage('bot', responseText);
        
        setMessages(prev => [...prev, botMessage]);
        setLoading(false);
        
        // Call onResponseReceived callback
        if (onResponseReceived) {
          onResponseReceived(responseText);
        }
        
        isSendingRef.current = false;
        resolve();
      }, RESPONSE_DELAY);
    });
  }, [onMessageSent, onResponseReceived]);

  /**
   * Clears all messages and resets to initial welcome message
   */
  const clearMessages = useCallback(() => {
    setMessages(INITIAL_MESSAGES);
  }, []);

  /**
   * Removes the last message (useful for undo functionality)
   */
  const undoLastMessage = useCallback(() => {
    setMessages(prev => {
      if (prev.length <= 1) return prev;
      return prev.slice(0, -1);
    });
  }, []);

  /**
   * Updates a specific message by ID
   * @param {number} id - Message ID
   * @param {Object} updates - Fields to update
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
    
    // Actions
    sendMessage,
    clearMessages,
    undoLastMessage,
    updateMessage,
    
    // Derived state
    hasMessages: messages.length > 1,
    lastMessage: messages[messages.length - 1],
  };
};

export default useChat;