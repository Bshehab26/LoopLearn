// src/features/courses/components/course-details/InstructorCard.jsx

import React from 'react';
import { HiOutlineStar, HiOutlineUsers, HiOutlineBookOpen } from 'react-icons/hi';

const InstructorCard = ({
  instructorName,
  instructorBio,
  instructorRating = 0,
  instructorStudents = 0,
  instructorCourses = 0,
}) => {
  const initials =
    instructorName?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'IN';

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-[#EEEDFE] flex items-center justify-center text-base font-semibold text-[#534AB7] flex-shrink-0">
          {initials}
        </div>
        <div>
          <h3 className="text-[14px] font-semibold text-gray-800">{instructorName}</h3>
          <p className="text-[11px] text-gray-400">Course Instructor</p>
        </div>
      </div>

      <div className="flex gap-4 mb-3 text-[11px] text-gray-500">
        <div className="flex items-center gap-1">
          <HiOutlineStar size={13} className="text-amber-500" />
          <span>{Number(instructorRating).toFixed(1)} rating</span>
        </div>
        <div className="flex items-center gap-1">
          <HiOutlineUsers size={13} className="text-purple-500" />
          <span>{Number(instructorStudents).toLocaleString()} students</span>
        </div>
        <div className="flex items-center gap-1">
          <HiOutlineBookOpen size={13} className="text-purple-500" />
          <span>{instructorCourses} courses</span>
        </div>
      </div>

      <p className="text-[12px] text-gray-600 leading-relaxed">
        {instructorBio || 'Expert instructor passionate about teaching and helping students succeed.'}
      </p>
    </div>
  );
};

export default InstructorCard;