// src/features/courses/components/CourseSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import CourseCard from './CourseCard';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllCourses } from '../api/course.api';

const CourseSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch featured courses on mount
  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        setLoading(true);
        // Fetch first 4 courses for featured section
        const result = await getAllCourses(1, 4);
        
        console.log('[CourseSection] API Result:', result);
        
        if (result.success) {
          // Handle both response formats
          const courseList = result.data?.courses || result.data || [];
          setCourses(courseList);
        } else {
          setError(result.message);
        }
      } catch (err) {
        console.error('[CourseSection] Error fetching courses:', err);
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

  // Intersection Observer for animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Dynamic grid classes based on number of courses
  const getGridClasses = () => {
    const coursesCount = courses.length;
    switch(coursesCount) {
      case 1:
        return 'grid-cols-1 max-w-md mx-auto';
      case 2:
        return 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto';
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div ref={sectionRef} className='fade-up w-full py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white'>
        <div className='text-center mb-12'>
          <span className='inline-block text-xs font-medium px-3 py-1 rounded-full mb-4 bg-purple-100 text-purple-700'>
            Featured Courses
          </span>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-800'>Learn From The Best</h2>
          <p className='text-sm md:text-base text-gray-500 mt-3 max-w-2xl mx-auto'>
            Loading courses...
          </p>
        </div>
        <div className='flex justify-center'>
          <div className='w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin' />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div ref={sectionRef} className='fade-up w-full py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white'>
        <div className='text-center'>
          <span className='inline-block text-xs font-medium px-3 py-1 rounded-full mb-4 bg-red-100 text-red-700'>
            Featured Courses
          </span>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-800'>Learn From The Best</h2>
          <p className='text-red-500 mt-3'>{error}</p>
        </div>
      </div>
    );
  }

  const displayCourses = courses.slice(0, 4);
  const coursesCount = displayCourses.length;

  return (
    <div ref={sectionRef} className='fade-up w-full py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white'>
      <style>{`
        .fade-up { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
        .fade-up.animate-in { opacity: 1; transform: translateY(0); }
      `}</style>
      
      <div className='text-center mb-12'>
        <span className='inline-block text-xs font-medium px-3 py-1 rounded-full mb-4 bg-purple-100 text-purple-700'>
          Featured Courses
        </span>
        <h2 className='text-3xl md:text-4xl font-bold text-gray-800'>Learn From The Best</h2>
        <p className='text-sm md:text-base text-gray-500 mt-3 max-w-2xl mx-auto'>
          Discover courses taught by industry experts and advance your career with our top-rated programs.
        </p>
      </div>

      {/* Responsive Grid */}
      {coursesCount > 0 ? (
        <div className={`grid ${getGridClasses()} gap-6 mb-12 auto-rows-fr`}>
          {displayCourses.map((course, index) => (
            <motion.div
              key={course.id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: Math.min(index * 0.1, 0.3) }}
              viewport={{ once: true }}
              className="h-full"
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className='text-center py-12'>
          <p className='text-gray-500'>No courses available yet. Check back soon!</p>
        </div>
      )}

      <div className='text-center'>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(83,74,183,0.3)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/course-list')}
          className='bg-gradient-to-r from-purple-600 to-purple-800 text-white px-8 py-3 rounded-full text-lg font-medium shadow-md transition-all duration-300'
        >
          View All Courses →
        </motion.button>
      </div>
    </div>
  );
};

export default CourseSection;