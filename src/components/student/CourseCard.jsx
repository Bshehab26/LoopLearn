// src/components/student/CourseCard.jsx

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';

const CourseCard = ({ course }) => {
  const { currency } = useContext(AppContext);

  return (
    <Link
      to={'/course/' + course.id}            
      onClick={() => scrollTo(0, 0)}
      className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'
    >
      {/* ✅ FIX 2: was course.courseThumbnail — DTO field is Avatar */}
      <img
        className='w-full aspect-video object-cover'
        src={course.avatar}
        alt={course.title}
      />

      <div className='p-3 text-left'>
        {/* ✅ FIX 3: was course.courseTitle — DTO field is Title */}
        <h3 className='text-base font-semibold'>{course.title}</h3>

        {/* ✅ FIX 4: was "LoopLearn" hardcoded — DTO has InstructorName */}
        <p className='text-gray-500 text-sm'>{course.instructorName}</p>

        {/* ✅ FIX 5: course.rating is already a double from DTO — no calculateRating needed */}
        {/* ✅ FIX 6: courseRatings doesn't exist in CourseDTO — removed */}
        <div className='flex items-center space-x-2 mt-1'>
          <p className='text-sm font-medium'>{course.rating?.toFixed(1) ?? '0.0'}</p>
          <div className='flex'>
            {[...Array(5)].map((_, i) => (
              <img
                className='w-4 h-4'
                key={i}
                src={i < Math.floor(course.rating ?? 0) ? assets.star : assets.star_blank}
                alt=''
              />
            ))}
          </div>
        </div>

        {/* ✅ FIX 7: was course.coursePrice with discount — DTO has only Price, no discount field */}
        {/* ✅ FIX 8: was "${currency}{...}" — currency var already holds the symbol (e.g "$") */}
        <p className='text-base font-semibold text-gray-800 mt-1'>
          {currency}{course.price?.toFixed(2)}
        </p>
      </div>
    </Link>
  );
};

export default CourseCard;