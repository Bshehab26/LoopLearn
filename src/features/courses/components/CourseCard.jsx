/**
 * CourseCard.jsx
 * Enhanced course card with glass morphism, hover effects, and micro-interactions
 * 
 * @module features/courses/components/CourseCard
 */

import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../../assets/assets';
import { useUI } from '../../../store/AppProvider';
import { motion } from 'framer-motion';
import { 
  HiOutlineUserGroup, HiOutlineClock, HiOutlineStar, 
  HiOutlineBookmark, HiOutlinePlay, HiOutlineHeart,
  HiOutlineChartBar
} from 'react-icons/hi';

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_VALUES = {
  rating: 0,
  reviews: 0,
  students: 0,
  duration: '0 hours',
  description: 'An excellent course to advance your skills and career.',
};

const STAR_RATING = [0, 1, 2, 3, 4];

// Animation variants
const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
  hover: { 
    y: -8,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};

const IMAGE_VARIANTS = {
  hover: { scale: 1.08, transition: { duration: 0.4 } }
};

const BADGE_VARIANTS = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { delay: 0.1, type: 'spring', stiffness: 300 } }
};

// ============================================================================
// Helper Components
// ============================================================================

const ImageStarRating = ({ rating }) => (
  <div className='flex'>
    {STAR_RATING.map((_, i) => (
      <img
        key={i}
        className='w-4 h-4 transition-transform duration-200 hover:scale-110'
        src={i < Math.floor(rating ?? 0) ? assets.star : assets.star_blank}
        alt=''
      />
    ))}
  </div>
);

const ModernStarRating = ({ rating, size = 'sm' }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const starSize = size === 'lg' ? 18 : 14;
  
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <HiOutlineStar key={i} size={starSize} className="text-yellow-500 fill-yellow-500" />;
          } else if (i === fullStars && hasHalfStar) {
            return <HiOutlineStar key={i} size={starSize} className="text-yellow-500 fill-yellow-500" style={{ clipPath: 'inset(0 50% 0 0)' }} />;
          } else {
            return <HiOutlineStar key={i} size={starSize} className="text-gray-300" />;
          }
        })}
      </div>
      <span className="text-sm font-semibold text-gray-700">{rating.toFixed(1)}</span>
    </div>
  );
};

const MobilePriceBadge = ({ currency, price }) => (
  <motion.span
    initial={{ opacity: 0, x: 10 }}
    animate={{ opacity: 1, x: 0 }}
    className='absolute bottom-3 right-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg md:hidden'
  >
    {currency}{price?.toFixed(2)}
  </motion.span>
);

const CourseBadge = ({ text, type = 'featured' }) => {
  const config = {
    featured: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    bestseller: 'bg-gradient-to-r from-green-500 to-emerald-500',
    new: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    updated: 'bg-gradient-to-r from-purple-500 to-pink-500',
  };
  
  return (
    <motion.span
      variants={BADGE_VARIANTS}
      initial="initial"
      animate="animate"
      className={`absolute top-3 left-3 ${config[type] || config.featured} text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-lg`}
    >
      {text}
    </motion.span>
  );
};

const ListViewStats = ({ rating, reviews, students, duration }) => (
  <div className='flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-gray-100'>
    <div className='flex items-center gap-1.5 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full'>
      <HiOutlineStar className='text-yellow-500' size={14} />
      <span className='font-semibold text-gray-700'>{rating?.toFixed(1) ?? DEFAULT_VALUES.rating.toFixed(1)}</span>
      <span className='text-gray-400'>({reviews?.length || DEFAULT_VALUES.reviews})</span>
    </div>
    <div className='flex items-center gap-1.5 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full'>
      <HiOutlineUserGroup size={14} />
      <span>{(students?.toLocaleString() || DEFAULT_VALUES.students).toLocaleString()} students</span>
    </div>
    <div className='flex items-center gap-1.5 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full'>
      <HiOutlineClock size={14} />
      <span>{duration || DEFAULT_VALUES.duration}</span>
    </div>
  </div>
);

const GridViewStats = ({ rating, reviews, students }) => (
  <div className='flex items-center justify-between mt-2'>
    <div className='flex items-center gap-2'>
      <div className='flex items-center gap-0.5'>
        <HiOutlineStar size={14} className='text-yellow-500 fill-yellow-500' />
        <span className='text-sm font-semibold text-gray-700'>{rating?.toFixed(1) ?? DEFAULT_VALUES.rating.toFixed(1)}</span>
      </div>
      <span className='text-xs text-gray-400'>({reviews?.length || DEFAULT_VALUES.reviews})</span>
    </div>
    <div className='flex items-center gap-1 text-xs text-gray-500'>
      <HiOutlineUserGroup size={12} />
      <span>{(students?.toLocaleString() || DEFAULT_VALUES.students).toLocaleString()}</span>
    </div>
  </div>
);

const ProgressBar = ({ progress }) => {
  if (!progress || progress === 0) return null;
  
  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Progress</span>
        <span className="text-purple-600 font-medium">{progress}%</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
        />
      </div>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

const CourseCard = ({ course, viewMode = 'grid', showProgress = false, onSave, isSaved = false }) => {
  const { currency } = useUI();
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const formattedPrice = useMemo(() => 
    course.isFree ? 'Free' : `${currency}${course.price?.toFixed(2) ?? '0.00'}`, 
    [currency, course.price, course.isFree]
  );
  
  const formattedRating = useMemo(() => 
    course.averageRating?.toFixed(1) ?? DEFAULT_VALUES.rating.toFixed(1),
    [course.averageRating]
  );
  
  const reviewCount = useMemo(() => 
    course.totalRatings ?? DEFAULT_VALUES.reviews,
    [course.totalRatings]
  );
  
  const studentCount = useMemo(() => 
    course.enrollmentCount?.toLocaleString() ?? DEFAULT_VALUES.students.toLocaleString(),
    [course.enrollmentCount]
  );
  
  const handleCardClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    onSave?.(course.id);
  };
  
  // Determine badge type based on course data
  const getBadgeInfo = () => {
    if (course.isFeatured) return { text: 'Featured', type: 'featured' };
    if (course.isBestseller) return { text: 'Bestseller', type: 'bestseller' };
    if (course.isNew) return { text: 'New', type: 'new' };
    if (course.isUpdated) return { text: 'Recently Updated', type: 'updated' };
    return null;
  };
  
  const badgeInfo = getBadgeInfo();
  const progress = course.progress || 0;
  
  // List View
  if (viewMode === 'list') {
    return (
      <motion.div
        variants={CARD_VARIANTS}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="group"
      >
        <Link
          to={`/course/${course.id}`}
          onClick={handleCardClick}
          className="flex flex-col sm:flex-row bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
        >
          {/* Image Container */}
          <div className="relative sm:w-64 w-full overflow-hidden bg-gradient-to-br from-purple-100 to-indigo-100">
            <motion.img
              className='w-full h-48 sm:h-full object-cover'
              src={course.thumbnailUrl || course.avatar || 'https://via.placeholder.com/400x300?text=No+Image'}
              alt={course.title}
              loading='lazy'
              variants={IMAGE_VARIANTS}
              whileHover="hover"
            />
            {badgeInfo && <CourseBadge text={badgeInfo.text} type={badgeInfo.type} />}
            {course.isFree && <CourseBadge text="Free" type="featured" />}
          </div>
          
          {/* Content */}
          <div className='flex-1 p-6 text-left'>
            <div className='flex items-start justify-between gap-4'>
              <div className='flex-1'>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                    {course.category || 'Course'}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{course.level || 'Beginner'}</span>
                </div>
                <h3 className='text-xl font-bold text-gray-800 line-clamp-1 group-hover:text-purple-600 transition-colors'>
                  {course.title}
                </h3>
                <p className='text-sm text-purple-600 mt-1 font-medium'>{course.instructorName}</p>
              </div>
              <div className="text-right">
                <p className='text-2xl font-bold text-purple-600'>{formattedPrice}</p>
                {course.originalPrice && course.originalPrice > course.price && (
                  <p className='text-sm text-gray-400 line-through'>{currency}{course.originalPrice?.toFixed(2)}</p>
                )}
              </div>
            </div>
            
            <p className='text-gray-500 text-sm mt-3 line-clamp-2 leading-relaxed'>
              {course.description || course.subtitle || DEFAULT_VALUES.description}
            </p>
            
            <ListViewStats
              rating={course.averageRating}
              reviews={course.totalRatings}
              students={course.enrollmentCount}
              duration={course.totalDuration}
            />
            
            {showProgress && <ProgressBar progress={progress} />}
          </div>
        </Link>
      </motion.div>
    );
  }
  
  // Grid View - Enhanced
  return (
    <motion.div
      variants={CARD_VARIANTS}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group h-full"
    >
      <Link
        to={`/course/${course.id}`}
        onClick={handleCardClick}
        className="block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 h-full flex flex-col relative"
      >
        {/* Image Container with Overlay */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-100 to-indigo-100 flex-shrink-0">
          <motion.img
            className='w-full aspect-video object-cover'
            src={course.thumbnailUrl || course.avatar || 'https://via.placeholder.com/400x225?text=No+Image'}
            alt={course.title}
            loading='lazy'
            variants={IMAGE_VARIANTS}
            whileHover="hover"
          />
          
          {/* Play Button Overlay on Hover */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center transform transition-transform duration-300 hover:scale-110">
              <HiOutlinePlay size={24} className="text-purple-600 ml-0.5" />
            </div>
          </motion.div>
          
          {badgeInfo && <CourseBadge text={badgeInfo.text} type={badgeInfo.type} />}
          {course.isFree && <CourseBadge text="Free" type="featured" />}
          
          {/* Save Button */}
          <button
            onClick={handleSaveClick}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 hover:bg-white"
          >
            <HiOutlineBookmark size={16} className={`transition-colors ${isLiked || isSaved ? 'text-purple-600 fill-purple-600' : 'text-gray-600'}`} />
          </button>
          
          <MobilePriceBadge currency={currency} price={course.price} />
        </div>
        
        {/* Content Container */}
        <div className='p-5 flex flex-col flex-grow'>
          {/* Category & Level Tags */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              {course.category || 'Course'}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">{course.level || 'Beginner'}</span>
          </div>
          
          {/* Title */}
          <h3 className='text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-purple-600 transition-colors'>
            {course.title}
          </h3>
          
          {/* Instructor */}
          <p className='text-sm text-gray-500 mt-1 line-clamp-1'>
            by {course.instructorName}
          </p>
          
          {/* Rating */}
          <GridViewStats
            rating={course.averageRating}
            reviews={course.totalRatings}
            students={course.enrollmentCount}
          />
          
          {/* Price and Action */}
          <div className='flex items-center justify-between mt-4 pt-3 border-t border-gray-100'>
            <div>
              <p className='text-xl font-bold text-purple-600 hidden md:block'>
                {formattedPrice}
              </p>
              {course.originalPrice && course.originalPrice > course.price && (
                <p className='text-xs text-gray-400 line-through hidden md:block'>
                  {currency}{course.originalPrice?.toFixed(2)}
                </p>
              )}
            </div>
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='text-xs font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-1.5 rounded-full shadow-md'
            >
              {course.isEnrolled ? 'Continue Learning' : 'Enroll Now'}
            </motion.span>
          </div>
          
          {/* Progress Bar (for enrolled courses) */}
          {showProgress && <ProgressBar progress={progress} />}
        </div>
      </Link>
    </motion.div>
  );
};

export default CourseCard;