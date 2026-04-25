import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import SearchBar from '../../components/student/SearchBar';
import { useParams } from 'react-router-dom';
import CourseCard from '../../components/student/CourseCard';
import { assets } from '../../assets/assets';
import Footer from '../../components/student/Footer';

// 🤖 Chatbot
import ChatButton from "../../components/chat/ChatButton";
import ChatWindow from "../../components/chat/ChatWindow";

const CoursesList = () => {
  const { navigate, allCourses } = useContext(AppContext);
  const { input } = useParams();

  const [filteredCourse, setFilteredCourse] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);

  const decodedInput = decodeURIComponent(input || "");

  useEffect(() => {
    if (allCourses?.length > 0) {
      const searchTerm = decodedInput.toLowerCase();
      const filtered = searchTerm
        ? allCourses.filter(item =>
            item.courseTitle?.toLowerCase().includes(searchTerm)
          )
        : allCourses;

      setFilteredCourse(filtered);
    }
  }, [allCourses, decodedInput]);

  return (
    <>
      {/* PAGE CONTENT */}
      <div className='relative md:px-36 px-6 pt-15 text-left'>
        <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full'>
          <div className='mb-6 md:mb-0'>
            <h1 className='text-4xl font-semibold text-gray-800'>
              Course List
            </h1>
            <p className='text-gray-500 mt-2'>
              <span
                className='text-purple-600 cursor-pointer'
                onClick={() => navigate('/')}
              >
                Home
              </span>
              <span className='mx-2'>/</span>
              Course List
            </p>
          </div>

          <SearchBar />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-3'>
          {filteredCourse.length > 0 ? (
            filteredCourse.map((course, index) => (
              <CourseCard key={index} course={course} />
            ))
          ) : (
            <p className="text-gray-500 col-span-full">
              No courses found.
            </p>
          )}
        </div>
      </div>

      <Footer />

      {/* 🤖 CHATBOT */}
      {chatOpen && <ChatWindow onClose={() => setChatOpen(false)} />}
      <ChatButton onClick={() => setChatOpen(true)} />
    </>
  );
};

export default CoursesList;