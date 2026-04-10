import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../context/Appcontext';
import SearchBar from '../../components/student/SearchBar';
import { useParams } from 'react-router-dom';
import CourseCard from '../../components/student/CourseCard';
import { assets } from '../../assets/assets';
import Footer from '../../components/student/Footer';

const CoursesList = () => {
  const { navigate, allCourses } = useContext(AppContext);
  const { input } = useParams();

  const [filteredCourse, setFilteredCourse] = useState([]);


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
    <div className='relative md:px-36 px-6 pt-15 text-left'>
      
      <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full'>
        <div>
          <h1 className='text-4xl font-semibold text-gray-800'>
            Courses List
          </h1>

          <p className='text-gray-500'>
            <span
              className='text-purple-600 cursor-pointer'
              onClick={() => navigate('/')}
            >
              Home
            </span> / <span>Courses List</span>
          </p>
        </div>

        <SearchBar />
      </div>

      {
        input && <div className='inline-flex items-center gap-4 px-4 py-2 border mt-8 mb-8 text-gray-600 rounded-lg bg-gray-100'>
          <p>{input}</p>
          <img src={assets.cross_icon} alt=""  className='cursor-pointer' onClick={()=>
            navigate('/course-list')
          }/>
        </div>
      }
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-3 px-2 md:px-0'>
        
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
    </>
    
  );
};

export default CoursesList;