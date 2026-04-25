import React, { useState } from "react";
import Hero from "../../components/student/Hero";
import Companies from "../../components/student/Companies";
import CoursesSection from "../../components/student/CourseSecton";
import TestimonialSection from "../../components/student/TestimonialSection";
import CallToAction from "../../components/student/CallToAction";
import Footer from "../../components/student/Footer";

// 🤖 Chatbot
import ChatButton from "../../components/chat/ChatButton";
import ChatWindow from "../../components/chat/ChatWindow";

const Home = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      {/* PAGE CONTENT */}
      <div className="flex flex-col items-center space-y-7 text-center">
        <Hero />
        <Companies />
        <CoursesSection />
        <TestimonialSection />
        <CallToAction />
        <Footer />
      </div>

      {/* 🤖 CHATBOT (OUTSIDE LAYOUT) */}
      {chatOpen && <ChatWindow onClose={() => setChatOpen(false)} />}
      <ChatButton onClick={() => setChatOpen(true)} />
    </>
  );
};

export default Home;