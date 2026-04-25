import { useState } from "react";
import { HiPaperAirplane } from "react-icons/hi";

const ChatInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const trimmedText = text.trim();
    if (!trimmedText) return;
    
    onSend(trimmedText);
    setText("");
  };

  return (
    <form
      onSubmit={submit}
      className="p-3 bg-white border-t flex gap-2 rounded-b-2xl"
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask Loopy anything..."
        className="flex-1 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 rounded-xl hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <HiPaperAirplane className="w-5 h-5" />
      </button>
    </form>
  );
};

export default ChatInput;