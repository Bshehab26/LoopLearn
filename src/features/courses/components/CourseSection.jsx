// src/features/courses/components/CourseSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import CourseCard from './CourseCard';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { getAllCourses } from '../api/course.api';
import { HiOutlineArrowRight, HiOutlineSparkles, HiOutlineAcademicCap } from 'react-icons/hi';

const CourseSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCourses, setTotalCourses] = useState(0);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await getAllCourses(1, 10);
        
        console.log('[CourseSection] API Response:', result);
        
        // ✅ Handle different API response structures
        let allCourses = [];
        if (result.success && result.data) {
          allCourses = Array.isArray(result.data) ? result.data : [];
        } else if (Array.isArray(result)) {
          allCourses = result;
        } else if (result.courses && Array.isArray(result.courses)) {
          allCourses = result.courses;
        } else {
          allCourses = [];
        }
        
        setTotalCourses(allCourses.length);
        
        // ✅ Filter only PUBLISHED courses (case insensitive)
        const publishedCourses = allCourses.filter(course => {
          const status = course.status?.toLowerCase();
          const isPublished = status === 'published' || status === 'active' || status === 'live';
          const isVisible = course.isVisible !== false;
          return isPublished && isVisible;
        });
        
        console.log('[CourseSection] Total courses:', allCourses.length);
        console.log('[CourseSection] Published courses:', publishedCourses.length);
        
        // ✅ Sort by featured flag or creation date
        const sortedCourses = publishedCourses.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        
        setCourses(sortedCourses);
        
      } catch (err) {
        console.error('[CourseSection] Error fetching courses:', err);
        setError(err.message || 'Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

  // Handle retry
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    window.location.reload();
  };

  // Loading state
  if (loading) {
    return (
      <section ref={sectionRef} className='w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50'>
        <div className='text-center'>
          <div className="inline-block w-16 h-16 mb-4">
            <div className="w-full h-full border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          </div>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-800'>Loading Courses...</h2>
          <p className='text-gray-500 mt-2'>Fetching the best courses for you</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section ref={sectionRef} className='w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50'>
        <div className='text-center max-w-md mx-auto'>
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className='text-2xl font-semibold text-gray-800 mb-2'>Something went wrong</h2>
          <p className='text-gray-500 mt-2 mb-6'>{error}</p>
          <button 
            onClick={handleRetry} 
            className="px-6 py-2.5 bg-purple-600 text-white rounded-full text-sm font-medium hover:bg-purple-700 transition-all shadow-md"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  const displayCourses = courses.slice(0, 4);
  const coursesCount = displayCourses.length;

  // ✅ No published courses state - Beautiful empty state
  if (coursesCount === 0) {
    return (
      <section ref={sectionRef} className='relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-gray-50 to-white'>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-purple-100/30 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-indigo-100/30 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className='text-center mb-12'
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 mb-6 shadow-sm">
              <HiOutlineSparkles className="text-purple-600" size={18} />
              <span className='text-sm font-medium text-purple-700'>Coming Soon</span>
            </div>
            <h2 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4'>
              Learn From The Best
            </h2>
            <p className='text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed'>
              Discover courses taught by industry experts and advance your career with our top-rated programs.
            </p>
          </motion.div>
          
          {/* Empty State Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-8 md:p-10 text-center">
                {/* Illustration */}
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                  <HiOutlineAcademicCap className="w-16 h-16 text-purple-500" />
                </div>
                
                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                  No Courses Available Yet
                </h3>
                
                {/* Description */}
                <p className="text-gray-500 max-w-md mx-auto mb-6 leading-relaxed">
                  We're working hard to bring you amazing courses. 
                  {totalCourses > 0 && ` Found ${totalCourses} course${totalCourses !== 1 ? 's' : ''} in draft mode.`}
                  Stay tuned for updates!
                </p>
                
                {/* Info Banner */}
                {totalCourses > 0 && (
                  <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-amber-600 text-xl">📝</span>
                      <p className="text-sm text-amber-700">
                        {totalCourses} course{totalCourses !== 1 ? 's are' : ' is'} currently being prepared
                      </p>
                    </div>
                  </div>
                )}
                
                {/* CTA Button */}
                <button
                  onClick={() => navigate('/courses')}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-full text-base font-medium hover:bg-purple-700 transition-all shadow-md hover:shadow-lg"
                >
                  Browse All Courses
                  <HiOutlineArrowRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-16 pt-8 border-t border-gray-200"
          >
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-gray-500">30,000+ active students</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-gray-500">4.8 average rating</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-gray-500">500+ expert instructors</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // ✅ Normal state with courses
  return (
    <section
      ref={sectionRef}
      className='relative w-full py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white'
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-purple-100/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-indigo-100/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-50/20 to-indigo-50/20 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className='text-center mb-12'
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 mb-6 shadow-sm"
          >
            <HiOutlineSparkles className="text-purple-600" size={18} />
            <span className='text-sm font-medium text-purple-700'>Handpicked for You</span>
          </motion.div>
          
          <h2 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4'>
            Learn From The Best
          </h2>
          
          <p className='text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed'>
            Discover courses taught by industry experts and advance your career with our top-rated programs.
          </p>
        </motion.div>

        {/* Course Grid - Responsive layout based on number of courses */}
        <div className={`grid gap-6 md:gap-8 mb-12 auto-rows-fr ${
          coursesCount === 1 ? 'grid-cols-1 max-w-md mx-auto' :
          coursesCount === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto' :
          coursesCount === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }`}>
          {displayCourses.map((course, index) => (
            <motion.div
              key={course.id || course._id || index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.5) }}
              whileHover={{ y: -4 }}
              className="h-full"
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className='text-center'
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -15px rgba(83,74,183,0.4)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/courses')}
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 md:px-10 md:py-4 rounded-full text-base md:text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">View All Courses</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              className="relative z-10"
            >
              <HiOutlineArrowRight size={20} />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-16 pt-8 border-t border-gray-200"
        >
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-gray-500">30,000+ active students</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-gray-500">4.8 average rating</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-gray-500">500+ expert instructors</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CourseSection;