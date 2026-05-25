/**
 * Chat.jsx
 * Full-page chat interface for standalone chat view.
 * Features gradient background, header, and responsive design.
 * 
 * @module features/chat/pages/Chat
 */

import { useNavigate } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import ChatWindow from '../components/ChatWindow';

// ============================================================================
// Constants
// ============================================================================

/** Page background gradient */
const BACKGROUND_GRADIENT = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
};

// ============================================================================
// Subcomponents
// ============================================================================

/**
 * Page header with back button
 */
const PageHeader = ({ onBack }) => (
  <div className="absolute top-0 left-0 right-0 p-4 flex items-center gap-3">
    <button
      onClick={onBack}
      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition text-white"
      aria-label="Go back"
    >
      <HiArrowLeft size={20} />
    </button>
    <h1 className="text-white font-semibold text-lg">Chat with Loopy</h1>
  </div>
);

// ============================================================================
// Main Component
// ============================================================================

/**
 * Chat - Full-page chat interface
 * @returns {React.ReactElement} Chat page component
 */
const Chat = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={BACKGROUND_GRADIENT}
    >
      <PageHeader onBack={handleClose} />
      
      <div className="w-full max-w-lg mx-auto mt-12">
        <ChatWindow onClose={handleClose} />
      </div>
    </div>
  );
};

export default Chat;