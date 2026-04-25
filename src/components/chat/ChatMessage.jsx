import { motion } from "framer-motion";

const ChatMessage = ({ message }) => {
  const isBot = message.sender === "bot";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isBot ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`max-w-[75%] p-3 rounded-2xl text-sm shadow-sm ${
          isBot
            ? "bg-white text-gray-800 rounded-bl-none border border-gray-200"
            : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none"
        }`}
      >
        {message.text}
      </div>
    </motion.div>
  );
};

export default ChatMessage;