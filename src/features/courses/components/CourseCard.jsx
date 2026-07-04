// src/features/courses/components/CourseCard.jsx

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  HiStar, 
  HiClock, 
  HiOutlineBookOpen,
  HiUserGroup 
} from 'react-icons/hi';
import { ROUTES } from '../../../shared/constants/routes'; // ADD THIS IMPORT

// Get currency from env or default to USD
const CURRENCY = import.meta.env.VITE_CURRENCY || 'USD';
const CURRENCY_SYMBOL = CURRENCY === 'EGP' ? 'EGP' : '$';

// Helper function to format price
const formatPrice = (price, isFree) => {
  if (isFree) return 'Free';
  return `${CURRENCY_SYMBOL}${price?.toFixed(2) || '0.00'}`;
};

// Helper function to format duration
const formatDuration = (duration) => {
  if (!duration) return null;
  if (typeof duration === 'string') {
    const parts = duration.split(':');
    if (parts.length === 3) {
      const hours = parseInt(parts[0]);
      const minutes = parseInt(parts[1]);
      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}min`;
    }
  }
  if (typeof duration === 'number') {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}min`;
  }
  return null;
};

// Helper function to get level color
const getLevelColor = (level) => {
  const colors = {
    'Beginner': 'bg-green-100 text-green-700',
    'Intermediate': 'bg-yellow-100 text-yellow-700',
    'Advanced': 'bg-red-100 text-red-700',
    'All Levels': 'bg-blue-100 text-blue-700',
  };
  return colors[level] || 'bg-gray-100 text-gray-700';
};

// Helper function to get category color
const getCategoryColor = (category) => {
  const colors = {
    'Web Development': 'bg-blue-100 text-blue-700',
    'Mobile Development': 'bg-teal-100 text-teal-700',
    'Data Science': 'bg-orange-100 text-orange-700',
    'UI/UX Design': 'bg-pink-100 text-pink-700',
    'Cybersecurity': 'bg-red-100 text-red-700',
    'DevOps': 'bg-indigo-100 text-indigo-700',
    'Cloud Computing': 'bg-cyan-100 text-cyan-700',
    'Game Development': 'bg-purple-100 text-purple-700',
    'Business': 'bg-emerald-100 text-emerald-700',
    'Marketing': 'bg-amber-100 text-amber-700',
  };
  return colors[category] || 'bg-gray-100 text-gray-700';
};

// Card variants for animations
const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
};

const imageVariants = {
  hover: {
    scale: 1.1,
    transition: { duration: 0.3 },
  },
};

const CourseCard = ({ course, index = 0, viewMode = 'grid' }) => {
  const navigate = useNavigate(); // ADD THIS HOOK

  const {
    id,
    title,
    subtitle,
    thumbnailUrl,
    instructorName,
    averageRating = 0,
    totalRatings = 0,
    price = 0,
    isFree = false,
    level = 'Beginner',
    category,
    duration,
  } = course;

  // Generate gradient based on category for placeholder
  const getCategoryGradient = (cat) => {
    const gradients = {
      'Web Development': 'from-blue-500 to-purple-600',
      'Mobile Development': 'from-green-500 to-teal-600',
      'Data Science': 'from-yellow-500 to-orange-600',
      'UI/UX Design': 'from-pink-500 to-rose-600',
      'Cybersecurity': 'from-red-500 to-orange-600',
      'DevOps': 'from-indigo-500 to-purple-600',
      'Cloud Computing': 'from-cyan-500 to-blue-600',
      'Game Development': 'from-purple-500 to-pink-600',
      'Business': 'from-emerald-500 to-green-600',
      'Marketing': 'from-orange-500 to-red-600',
    };
    return gradients[cat] || 'from-purple-500 to-indigo-600';
  };

  const gradient = getCategoryGradient(category);
  const levelColor = getLevelColor(level);
  const categoryColor = getCategoryColor(category);
  const formattedPrice = formatPrice(price, isFree);
  const formattedDuration = formatDuration(duration);

  // Navigate to course details with scroll to top
  const handleNavigateToCourse = () => {
    navigate(`/course/${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Alternative: Use ROUTES constant if you have it configured
  // const handleNavigateToCourse = () => {
  //   navigate(ROUTES.COURSE_DETAILS.replace(':id', id));
  //   window.scrollTo({ top: 0, behavior: 'smooth' });
  // };

  // Play Icon Component
  const PlayIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  // Grid view
  if (viewMode === 'grid') {
    return (
      <motion.div
        custom={index}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        variants={cardVariants}
        className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer"
        onClick={handleNavigateToCourse} // ADD THIS - Makes entire card clickable
      >
        {/* Thumbnail Container */}
        <div className="relative h-48 overflow-hidden bg-gray-100">
          {thumbnailUrl ? (
            <motion.img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover"
              variants={imageVariants}
            />
          ) : (
            <motion.div 
              variants={imageVariants}
              className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
            >
              <HiOutlineBookOpen className="w-16 h-16 text-white/30" />
            </motion.div>
          )}
          
          {/* Level Badge - Top Left */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="absolute top-3 left-3 z-10"
          >
            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${levelColor} shadow-sm`}>
              {level}
            </span>
          </motion.div>
          
          {/* Category Badge - Below Level, Top Left */}
          {category && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="absolute top-12 left-3 z-10"
            >
              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${categoryColor} shadow-sm backdrop-blur-sm bg-white/80`}>
                {category}
              </span>
            </motion.div>
          )}
          
          {/* Price Badge - Right Side */}
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute top-3 right-3 z-10"
          >
            <span className="px-3 py-1 rounded-lg text-sm font-bold bg-white/95 backdrop-blur-sm shadow-md">
              {formattedPrice}
            </span>
          </motion.div>
          
          {/* Overlay on hover */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-black/40 flex items-center justify-center z-20"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-white rounded-full text-gray-800 font-semibold text-sm shadow-lg"
              onClick={(e) => {
                e.stopPropagation(); // Prevent double trigger
                handleNavigateToCourse();
              }}
            >
              View Course
            </motion.button>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Rating Row */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <HiStar className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-semibold text-gray-700">
                {averageRating?.toFixed(1) || '0.0'}
              </span>
              <span className="text-xs text-gray-400">
                ({totalRatings || 0})
              </span>
            </div>
            
            {/* Duration */}
            {formattedDuration && (
              <div className="flex items-center gap-1 text-gray-500">
                <HiClock className="w-4 h-4" />
                <span className="text-xs">{formattedDuration}</span>
              </div>
            )}
          </div>
          
          {/* Title */}
          <h3 className="font-bold text-gray-800 mb-1 line-clamp-2 text-lg group-hover:text-purple-600 transition-colors">
            {title}
          </h3>
          
          {/* Subtitle */}
          {subtitle && (
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">
              {subtitle}
            </p>
          )}
          
          {/* Instructor */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <HiUserGroup className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-xs truncate">{instructorName || 'Unknown Instructor'}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  // List view
  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row cursor-pointer"
      onClick={handleNavigateToCourse} // ADD THIS - Makes entire card clickable
    >
      {/* Thumbnail */}
      <div className="relative sm:w-64 h-48 sm:h-auto overflow-hidden bg-gray-100">
        {thumbnailUrl ? (
          <motion.img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover"
            variants={imageVariants}
          />
        ) : (
          <motion.div 
            variants={imageVariants}
            className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
          >
            <HiOutlineBookOpen className="w-12 h-12 text-white/30" />
          </motion.div>
        )}
        
        {/* Level Badge - Top Left */}
        <div className="absolute top-3 left-3 z-10">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${levelColor} shadow-sm`}>
            {level}
          </span>
        </div>
        
        {/* Category Badge - Below Level, Top Left */}
        {category && (
          <div className="absolute top-12 left-3 z-10">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${categoryColor} shadow-sm backdrop-blur-sm bg-white/80`}>
              {category}
            </span>
          </div>
        )}
        
        {/* Price Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="px-3 py-1 rounded-lg text-sm font-bold bg-white/95 backdrop-blur-sm shadow-md">
            {formattedPrice}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-5">
        <div className="flex flex-col h-full">
          {/* Rating and Duration Row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <HiStar className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-semibold text-gray-700">
                {averageRating?.toFixed(1) || '0.0'}
              </span>
              <span className="text-xs text-gray-400">
                ({totalRatings || 0} ratings)
              </span>
            </div>
            
            {formattedDuration && (
              <div className="flex items-center gap-1 text-gray-500">
                <HiClock className="w-4 h-4" />
                <span className="text-sm">{formattedDuration}</span>
              </div>
            )}
          </div>
          
          {/* Title */}
          <h3 className="font-bold text-gray-800 mb-2 line-clamp-1 text-xl group-hover:text-purple-600 transition-colors">
            {title}
          </h3>
          
          {/* Subtitle */}
          {subtitle && (
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">
              {subtitle}
            </p>
          )}
          
          {/* Instructor */}
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
            <HiUserGroup className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm">{instructorName || 'Unknown Instructor'}</span>
          </div>
          
          {/* Footer with CTA */}
          <div className="flex justify-end mt-auto pt-3 border-t border-gray-100">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition shadow-sm"
              onClick={(e) => {
                e.stopPropagation(); // Prevent double trigger
                handleNavigateToCourse();
              }}
            >
              <PlayIcon />
              Enroll Now
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;