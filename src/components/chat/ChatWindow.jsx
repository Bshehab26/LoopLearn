import { motion } from "framer-motion";
import { useState } from "react";
import ChatAvatar from "./BotAvatar";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

const ChatWindow = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { 
      sender: "bot", 
      text: "Hi! I'm Loopy, your AI assistant 🤖 How can I help you today?" 
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (text) => {
    // Add user message
    const userMessage = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    
    setLoading(true);

    // Simulate AI response (replace with real API call later)
    setTimeout(() => {
      const botResponse = {
        sender: "bot",
        text: generateResponse(text),
      };
      setMessages((prev) => [...prev, botResponse]);
      setLoading(false);
    }, 1000);
  };

  // Smart response generator (you'll replace this with real AI API)
  const generateResponse = (userText) => {
    const lowerText = userText.toLowerCase();
    
    if (lowerText.includes("course") || lowerText.includes("learn")) {
      return "I can help you find the perfect course! What topic are you interested in?";
    }
    if (lowerText.includes("instructor") || lowerText.includes("teach")) {
      return "Would you like to become an instructor? I can guide you through the process!";
    }
    if (lowerText.includes("help") || lowerText.includes("support")) {
      return "I'm here to help! You can ask me about courses, enrollment, or anything else.";
    }
    return "That's interesting! How else can I assist you today?";
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-24 right-6 w-[90%] sm:w-96 bg-white rounded-2xl shadow-2xl z-50 flex flex-col max-h-[500px]"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-2xl">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="font-semibold">Loopy AI Assistant</span>
        </div>
        <button 
          onClick={onClose} 
          className="text-white hover:bg-white/20 rounded-full p-1 transition"
        >
          ✕
        </button>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 max-w-xs p-3 rounded-lg">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* INPUT */}
      <ChatInput onSend={handleSend} />
    </motion.div>
  );
};

export default ChatWindow;