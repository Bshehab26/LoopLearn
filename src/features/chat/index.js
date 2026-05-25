// features/chat — barrel export
export { default as ChatButton }  from './components/ChatButton';
export { default as ChatWindow }  from './components/ChatWindow';
export { default as ChatInput }   from './components/ChatInput';
export { default as ChatMessage } from './components/ChatMessage';
export { default as ChatAvatar }  from './components/BotAvatar';
export { default as Chat }        from './pages/Chat';
export { default as useChat }     from './hooks/useChat';/**
 * Chat Module - Barrel Exports
 * Central export point for all chat-related functionality.
 * Includes components, pages, and hooks for the chat feature.
 * 
 * @module features/chat
 * 
 * @example
 * // Import chat components
 * import { ChatButton, ChatWindow, ChatMessage } from '../features/chat';
 * 
 * // Import chat hook
 * import { useChat } from '../features/chat';
 * 
 * // Import chat page
 * import { Chat } from '../features/chat';
 */

// ============================================================================
// Components
// ============================================================================

export { default as ChatButton } from './components/ChatButton';
export { default as ChatWindow } from './components/ChatWindow';
export { default as ChatInput } from './components/ChatInput';
export { default as ChatMessage } from './components/ChatMessage';
export { default as ChatAvatar } from './components/BotAvatar';

// ============================================================================
// Pages
// ============================================================================

export { default as Chat } from './pages/Chat';

// ============================================================================
// Hooks
// ============================================================================

export { default as useChat } from './hooks/useChat';

// ============================================================================
// Types (for TypeScript - uncomment when using TypeScript)
// ============================================================================

// export type {
//   Message,
//   ChatState,
//   ChatContextType,
// } from './types';

// ============================================================================
// Utilities (if needed in the future)
// ============================================================================

// export { formatMessageTime, generateResponse } from './utils/chatUtils';