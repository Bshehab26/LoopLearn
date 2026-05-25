/**
 * CourseCard.jsx
 * Reusable course card component for displaying course information.
 * Supports both grid and list view modes with animations.
 * 
 * @module features/courses/components/CourseCard
 * 
 * @example
 * // Grid view
 * <CourseCard course={course} viewMode="grid" />
 * 
 * // List view
 * <CourseCard course={course} viewMode="list" />
 */

import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../../assets/assets';
import { AppContext } from '../../../store/AppContext';
import { motion } from 'framer-motion';
import { HiOutlineUserGroup, HiOutlineClock, HiOutlineStar } from 'react-icons/hi';

// ============================================================================
// Constants
// ============================================================================

/** Default values for missing course data */
const DEFAULT_VALUES = {
  rating: 0,
  reviews: 0,
  students: 1200,
  duration: '10 hours',
  description: 'An excellent course to advance your skills and career.',
};

/** Star rating array (5 stars) */
const STAR_RATING = [0, 1, 2, 3, 4];

/** Animation variants for grid view */
const GRID_ANIMATION = {
  whileHover: { y: -6 },
  transition: { duration: 0.2 },
};

/** Animation variants for list view */
const LIST_ANIMATION = {
  whileHover: { y: -4, boxShadow: '0 12px 24px -8px rgba(0,0,0,0.1)' },
  transition: { duration: 0.2 },
};

// ============================================================================
// Helper Components
// ============================================================================

/**
 * Star rating component using images
 */
const ImageStarRating = ({ rating }) => (
  <div className='flex'>
    {STAR_RATING.map((_, i) => (
      <img
        key={i}
        className='w-4 h-4'
        src={i < Math.floor(rating ?? 0) ? assets.star : assets.star_blank}
        alt=''
      />
    ))}
  </div>
);

/**
 * Star rating component using SVG icon
 */
const IconStarRating = ({ rating }) => (
  <div className='flex items-center gap-1'>
    <HiOutlineStar className='text-yellow-500' size={14} />
    <span className='font-medium'>{rating?.toFixed(1) ?? DEFAULT_VALUES.rating.toFixed(1)}</span>
    <span className='text-gray-400'>({rating?.reviews?.length || DEFAULT_VALUES.reviews} reviews)</span>
  </div>
);

/**
 * Price badge component for mobile view
 */
const MobilePriceBadge = ({ currency, price }) => (
  <span className='absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-purple-600 text-sm font-bold px-2 py-1 rounded-lg shadow-md md:hidden'>
    {currency}{price?.toFixed(2)}
  </span>
);

/**
 * Badge component for featured/promo courses
 */
const CourseBadge = ({ text }) => (
  <span className='absolute top-3 left-3 bg-purple-600 text-white text-xs px-2 py-1 rounded-full'>
    {text}
  </span>
);

/**
 * Course stats component for list view
 */
const ListViewStats = ({ rating, reviews, students, duration }) => (
  <div className='flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-gray-100'>
    <div className='flex items-center gap-1 text-xs text-gray-500'>
      <svg className='text-yellow-500' width={14} height={14} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
        <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
      </svg>
      <span className='font-medium'>{rating?.toFixed(1) ?? DEFAULT_VALUES.rating.toFixed(1)}</span>
      <span>({reviews?.length || DEFAULT_VALUES.reviews} reviews)</span>
    </div>
    <div className='flex items-center gap-1 text-xs text-gray-500'>
      <HiOutlineUserGroup size={14} />
      <span>{(students?.toLocaleString() || DEFAULT_VALUES.students).toLocaleString()} students</span>
    </div>
    <div className='flex items-center gap-1 text-xs text-gray-500'>
      <HiOutlineClock size={14} />
      <span>{duration || DEFAULT_VALUES.duration}</span>
    </div>
  </div>
);

/**
 * Course stats component for grid view
 */
const GridViewStats = ({ rating, reviews }) => (
  <div className='flex items-center flex-wrap gap-2 mt-2'>
    <div className='flex items-center space-x-1'>
      <p className='text-sm font-semibold text-yellow-600'>
        {rating?.toFixed(1) ?? DEFAULT_VALUES.rating.toFixed(1)}
      </p>
      <ImageStarRating rating={rating} />
    </div>
    <span className='text-xs text-gray-400'>({reviews?.length || DEFAULT_VALUES.reviews})</span>
  </div>
);

// ============================================================================
// Main Component
// ============================================================================

/**
 * CourseCard - Displays course information in grid or list format
 * @param {Object} props
 * @param {Object} props.course - Course data object
 * @param {string} props.viewMode - Display mode ('grid' or 'list')
 */
const CourseCard = ({ course, viewMode = 'grid' }) => {
  const { currency } = useContext(AppContext);
  
  // Memoized values for better performance
  const formattedPrice = useMemo(() => 
    currency + (course.price?.toFixed(2) ?? '0.00'), 
    [currency, course.price]
  );
  
  const formattedRating = useMemo(() => 
    course.rating?.toFixed(1) ?? DEFAULT_VALUES.rating.toFixed(1),
    [course.rating]
  );
  
  const reviewCount = useMemo(() => 
    course.reviews?.length ?? DEFAULT_VALUES.reviews,
    [course.reviews]
  );
  
  const studentCount = useMemo(() => 
    (course.students?.toLocaleString() ?? DEFAULT_VALUES.students).toLocaleString(),
    [course.students]
  );
  
  // Handle scroll to top on navigation
  const handleClick = () => {
    window.scrollTo(0, 0);
  };
  
  // List View
  if (viewMode === 'list') {
    return (
      <motion.div
        {...LIST_ANIMATION}
        className='h-full'
      >
        <Link
          to={`/course/${course.id}`}
          onClick={handleClick}
          className='flex flex-col sm:flex-row bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 h-full'
        >
          {/* Course Image */}
          <img
            className='sm:w-48 w-full h-48 object-cover'
            src={course.avatar}
            alt={course.title}
            loading='lazy'
          />
          
          {/* Course Info */}
          <div className='flex-1 p-5 text-left'>
            {/* Header with title and price */}
            <div className='flex items-start justify-between flex-wrap gap-2'>
              <div>
                <h3 className='text-lg font-semibold text-gray-800 line-clamp-1'>
                  {course.title}
                </h3>
                <p className='text-sm text-purple-600 mt-1'>
                  {course.instructorName}
                </p>
              </div>
              <span className='text-xl font-bold text-purple-600'>
                {formattedPrice}
              </span>
            </div>
            
            {/* Description */}
            <p className='text-gray-500 text-sm mt-2 line-clamp-2'>
              {course.description || DEFAULT_VALUES.description}
            </p>
            
            {/* Stats */}
            <ListViewStats
              rating={course.rating}
              reviews={course.reviews}
              students={course.students}
              duration={course.duration}
            />
          </div>
        </Link>
      </motion.div>
    );
  }
  
  // Grid View
  return (
    <motion.div
      {...GRID_ANIMATION}
      className='group h-full'
    >
      <Link
        to={`/course/${course.id}`}
        onClick={handleClick}
        className='block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col'
      >
        {/* Image Container */}
        <div className='relative overflow-hidden flex-shrink-0'>
          <img
            className='w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105'
            src={course.avatar}
            alt={course.title}
            loading='lazy'
          />
          
          {/* Badges */}
          {course.badge && <CourseBadge text={course.badge} />}
          <MobilePriceBadge currency={currency} price={course.price} />
        </div>
        
        {/* Content Container */}
        <div className='p-4 flex flex-col flex-grow'>
          {/* Title */}
          <h3 className='text-base font-semibold text-gray-800 line-clamp-1 group-hover:text-purple-600 transition'>
            {course.title}
          </h3>
          
          {/* Instructor */}
          <p className='text-gray-500 text-sm mt-1 line-clamp-1'>
            {course.instructorName}
          </p>
          
          {/* Rating */}
          <GridViewStats
            rating={course.rating}
            reviews={course.reviews}
          />
          
          {/* Price and Action */}
          <div className='flex items-center justify-between mt-3 pt-2 border-t border-gray-100 mt-auto'>
            <p className='text-lg font-bold text-purple-600 hidden md:block'>
              {formattedPrice}
            </p>
            <span className='text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full'>
              Enroll Now
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CourseCard;