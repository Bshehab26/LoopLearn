import { motion } from "framer-motion";
import avatar from "../../assets/chatAvatar.png";

const ChatButton = ({ onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-purple-600 shadow-xl flex items-center justify-center z-50"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <img src={avatar} className="w-10 h-10 rounded-full" />
    </motion.button>
  );
};

export default ChatButton;