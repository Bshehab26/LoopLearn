import { motion } from "framer-motion";
import avatar from "../../assets/chatAvatar.png";

const ChatAvatar = () => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120 }}
      className="flex items-center gap-3"
    >
      <motion.img
        src={avatar}
        alt="AI Assistant"
        className="w-12 h-12 rounded-full shadow-lg bg-white"
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />

      <div className="bg-gray-100 px-4 py-2 rounded-2xl text-sm text-gray-700 shadow">
        Hi! I’m loopy, your AI assistant 🤖
      </div>
    </motion.div>
  );
};

export default ChatAvatar;