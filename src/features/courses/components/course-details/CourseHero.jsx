// src/features/courses/components/course-details/CourseHero.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineHome, HiOutlineChevronRight } from 'react-icons/hi';

const Stars = ({ rating, size = 14 }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg key={star} width={size} height={size} viewBox="0 0 24 24" 
        fill={star <= Math.floor(rating) ? '#F59E0B' : 'none'} 
        stroke="#F59E0B" strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ))}
  </div>
);

const CourseHero = ({ course }) => {
  const navigate = useNavigate();

  const getLevelStyle = (level) => {
    const styles = {
      Beginner: { bg: '#EAF3DE', color: '#27500A', icon: '🌱' },
      Intermediate: { bg: '#FEF3C7', color: '#92400E', icon: '📈' },
      Advanced: { bg: '#FCE7F3', color: '#9D174D', icon: '🚀' },
    };
    return styles[level] || styles.Beginner;
  };

  const levelStyle = getLevelStyle(course.levelName || 'Beginner');
  const instructorInitials = course.instructorName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'IN';

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
        <button onClick={() => navigate('/')} className="hover:text-purple-600 transition flex items-center gap-1">
          <HiOutlineHome size={12} /> Home
        </button>
        <HiOutlineChevronRight size={10} />
        <button onClick={() => navigate('/courses')} className="hover:text-purple-600 transition">Courses</button>
        <HiOutlineChevronRight size={10} />
        <span className="text-purple-600 font-medium truncate max-w-[200px]">{course.title}</span>
      </div>

      {/* Badges */}
      <div className="flex gap-2 flex-wrap mb-3">
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
          {course.categoryName || course.category || 'Development'}
        </span>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: levelStyle.bg, color: levelStyle.color }}>
          {levelStyle.icon} {course.levelName || 'Beginner'}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-3">
        {course.title}
      </h1>

      {/* Subtitle */}
      <p className="text-gray-600 text-sm mb-4">
        {course.subtitle || course.description?.slice(0, 200)}
      </p>

      {/* Rating Row */}
      <div className="flex items-center gap-3 flex-wrap mb-4">
        <span className="text-lg font-bold text-gray-900">{course.averageRating?.toFixed(1) || '0.0'}</span>
        <Stars rating={course.averageRating || 0} size={16} />
        <span className="text-xs text-purple-600 font-medium">{course.totalRatings || 0} ratings</span>
        <span className="text-gray-300">•</span>
        <span className="text-xs text-gray-500">{course.enrollmentCount?.toLocaleString() || 0} students</span>
      </div>

      {/* Instructor */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-xs font-semibold text-purple-600">
          {instructorInitials}
        </div>
        <div>
          <p className="text-[10px] text-gray-400">Created by</p>
          <p className="text-sm font-medium text-gray-800">{course.instructorName}</p>
        </div>
      </div>
    </div>
  );
};

export default CourseHero;