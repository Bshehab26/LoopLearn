import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/student/Navbar";
import Footer from "../components/student/Footer";
import ChatButton from "../components/chat/ChatButton";
import ChatWindow from "../components/chat/ChatWindow";

const StudentLayout = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col relative">

      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      {/* CHAT (fixed layer) */}
      {chatOpen && (
        <ChatWindow onClose={() => setChatOpen(false)} />
      )}

      <ChatButton onClick={() => setChatOpen(true)} />

    </div>
  );
};

export default StudentLayout;