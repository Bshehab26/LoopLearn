import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import SearchBar from '../../components/student/SearchBar';
import { useParams } from 'react-router-dom';
import CourseCard from '../../components/student/CourseCard';
import Footer from '../../components/student/Footer';
import ChatButton from "../../components/chat/ChatButton";
import ChatWindow from "../../components/chat/ChatWindow";

// ─── Course card skeleton ────────────────────────────────────────────────────
const Shimmer = ({ style = {} }) => (
  <div style={{ background: "#EEEDFE", borderRadius: 10, overflow: "hidden", position: "relative", ...style }}>
    <div style={{
      position: "absolute", inset: 0,
      background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
      animation: "shimmer 1.5s infinite",
    }} />
  </div>
);

const CourseCardSkeleton = () => (
  <div style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.07)", borderRadius: 12, overflow: "hidden" }}>
    <Shimmer style={{ height: 160, borderRadius: 0 }} />
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
      <Shimmer style={{ height: 15, width: "80%" }} />
      <Shimmer style={{ height: 13, width: "50%" }} />
      <Shimmer style={{ height: 13, width: "60%" }} />
      <Shimmer style={{ height: 16, width: "35%" }} />
    </div>
  </div>
);

const CoursesListSkeleton = () => (
  <div className="md:px-36 px-6 pt-15">
    <style>{`@keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }`}</style>
    <div className="flex md:flex-row flex-col gap-6 items-start justify-between w-full mb-10">
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Shimmer style={{ height: 36, width: 200 }} />
        <Shimmer style={{ height: 16, width: 160 }} />
      </div>
      <Shimmer style={{ height: 36, width: 280, borderRadius: 99 }} />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 my-10">
      {[...Array(8)].map((_, i) => <CourseCardSkeleton key={i} />)}
    </div>
  </div>
);
// ────────────────────────────────────────────────────────────────────────────

const CoursesList = () => {
  const { navigate, allCourses, coursesLoading } = useContext(AppContext);
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

  if (coursesLoading) return <CoursesListSkeleton />;

  return (
    <>
      <div className='relative md:px-36 px-6 pt-15 text-left'>
        <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full'>
          <div className='mb-6 md:mb-0'>
            <h1 className='text-4xl font-semibold text-gray-800'>Course List</h1>
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
            <p className="text-gray-500 col-span-full">No courses found.</p>
          )}
        </div>
      </div>

      <Footer />
      {chatOpen && <ChatWindow onClose={() => setChatOpen(false)} />}
      <ChatButton onClick={() => setChatOpen(true)} />
    </>
  );
};

export default CoursesList;
