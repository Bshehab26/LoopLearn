import React, { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";

import Hero from "../../components/student/Hero";
import Companies from "../../components/student/Companies";
import CoursesSection from "../../components/student/CourseSecton";
import TestimonialSection from "../../components/student/TestimonialSection";
import AboutSection from "../../components/student/AboutSection";
import ContactSection from "../../components/student/ContactSection";
import Footer from "../../components/student/Footer";

import ChatButton from "../../components/chat/ChatButton";
import ChatWindow from "../../components/chat/ChatWindow";

const Home = () => {
  const { coursesLoading } = useContext(AppContext);
  const [chatOpen, setChatOpen] = useState(false);

  // ✅ show skeleton while courses are loading
  if (coursesLoading) return <Loading />;

  return (
    <>
      <div className="flex flex-col items-center w-full text-center">
        <Hero />
        <Companies />
        <CoursesSection />
        <TestimonialSection />
        <AboutSection />
        <ContactSection />
        <Footer />
      </div>

      {chatOpen && <ChatWindow onClose={() => setChatOpen(false)} />}
      <ChatButton onClick={() => setChatOpen(true)} />
    </>
  );
};

export default Home;
