import React, { useContext } from 'react';
import { AppContext } from '../../context/Appcontext';
import CourseCard from './CourseCard';
import { useNavigate } from "react-router-dom";

const CourseSection = () => {
  const navigate = useNavigate();
  const { allCourses } = useContext(AppContext); 

  const handleExploreCourses = () => {
    navigate("/course-list");
  };

  return (
    <div className="py-16 md:px-40 px-8 bg-gray-50">
      <h2 className="text-3xl font-medium text-gray-800">Learn From The Best</h2>
      <p className="text-sm md:text-base text-gray-500 mt-3 mb-6">
        Discover courses taught by industry experts and advance your career.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {allCourses.slice(0,4).map((course,index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>

      <button
        onClick={handleExploreCourses}
        className="bg-linear-to-r from-purple-600 to-purple-800 text-white px-8 py-3 rounded-full text-lg font-medium shadow-md hover:scale-105 transition duration-300"
      >
        Explore Courses
      </button>
    </div>
  );
};

export default CourseSection;