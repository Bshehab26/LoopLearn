/**
 * CourseCard.jsx
 * Fixed: handleCardClick was undefined (crash), ListViewStats reviews.length on number,
 *        MobilePriceBadge showed on md+ screens (logic reversed), isFree badge duplicated.
 * Enhanced: cleaner grid/list layout, better responsive design, accessible markup.
 *
 * @module features/courses/components/CourseCard
 */

import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUI } from '../../../store/AppProvider';
import { motion } from 'framer-motion';
import {
  HiOutlineUserGroup, HiOutlineClock, HiOutlineStar,
  HiOutlineBookmark, HiOutlinePlay,
} from 'react-icons/hi';

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_VALUES = {
  rating: 0,
  reviews: 0,
  students: 0,
  duration: '0m',
  description: 'An excellent course to advance your skills and career.',
};

// Animation variants
const CARD_VARIANTS = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  hover:   { y: -6, transition: { duration: 0.25, ease: 'easeOut' } },
};

const IMAGE_VARIANTS = {
  hover: { scale: 1.06, transition: { duration: 0.4 } },
};

// ============================================================================
// Sub-components
// ============================================================================

const StarRating = ({ rating = 0 }) => {
  const full = Math.floor(rating);
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <HiOutlineStar
          key={i}
          size={13}
          className={i < full ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
        />
      ))}
    </div>
  );
};

/** ✅ FIX: reviewCount is a number — use it directly, not .length */
const ListViewStats = ({ rating = 0, reviewCount = 0, students = 0, duration }) => (
  <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-gray-100">
    <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
      <HiOutlineStar size={12} className="text-amber-400 fill-amber-400" />
      <span className="font-semibold text-gray-700">{Number(rating).toFixed(1)}</span>
      <span className="text-gray-400">({reviewCount.toLocaleString()})</span>
    </span>
    <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
      <HiOutlineUserGroup size={12} />
      {Number(students).toLocaleString()} students
    </span>
    {duration && (
      <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
        <HiOutlineClock size={12} />
        {duration}
      </span>
    )}
  </div>
);

const GridViewStats = ({ rating = 0, reviewCount = 0, students = 0 }) => (
  <div className="flex items-center justify-between mt-2">
    <div className="flex items-center gap-1.5">
      <StarRating rating={rating} />
      <span className="text-xs font-semibold text-gray-700">{Number(rating).toFixed(1)}</span>
      <span className="text-xs text-gray-400">({Number(reviewCount).toLocaleString()})</span>
    </div>
    <div className="flex items-center gap-1 text-xs text-gray-500">
      <HiOutlineUserGroup size={12} />
      <span>{Number(students).toLocaleString()}</span>
    </div>
  </div>
);

const CourseBadge = ({ text, type = 'featured' }) => {
  const styles = {
    featured:   'bg-gradient-to-r from-yellow-500 to-orange-500',
    bestseller: 'bg-gradient-to-r from-green-500 to-emerald-600',
    new:        'bg-gradient-to-r from-blue-500 to-cyan-500',
    updated:    'bg-gradient-to-r from-violet-500 to-purple-600',
    free:       'bg-gradient-to-r from-teal-500 to-green-500',
  };
  return (
    <span
      className={`absolute top-3 left-3 ${styles[type] ?? styles.featured} text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow`}
    >
      {text}
    </span>
  );
};

const ProgressBar = ({ progress = 0 }) => {
  if (!progress) return null;
  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Progress</span>
        <span className="text-violet-600 font-medium">{progress}%</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
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
  const [saved, setSaved]         = useState(isSaved);

  const formattedPrice = useMemo(
    () => course.isFree ? 'Free' : `${currency}${Number(course.price ?? 0).toFixed(2)}`,
    [currency, course.price, course.isFree]
  );

  /** ✅ FIX: was undefined before — extracted from inline handler */
  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(prev => !prev);
    onSave?.(course.id);
  };

  const badge = (() => {
    if (course.isFree)       return { text: 'Free',             type: 'free' };
    if (course.isFeatured)   return { text: 'Featured',         type: 'featured' };
    if (course.isBestseller) return { text: 'Bestseller',       type: 'bestseller' };
    if (course.isNew)        return { text: 'New',              type: 'new' };
    if (course.isUpdated)    return { text: 'Recently Updated', type: 'updated' };
    return null;
  })();

  const thumbnail =
    course.thumbnailUrl ||
    course.avatar ||
    `https://placehold.co/400x225/7c3aed/ffffff?text=${encodeURIComponent(course.title?.slice(0, 2) ?? 'C')}`;

  // ──────────────────────────────────────────────────
  // LIST VIEW
  // ──────────────────────────────────────────────────
  if (viewMode === 'list') {
    return (
      <motion.div variants={CARD_VARIANTS} initial="hidden" animate="visible" whileHover="hover" className="group">
        <Link
          to={`/course/${course.id}`}
          className="flex flex-col sm:flex-row bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300"
        >
          {/* Thumbnail */}
          <div className="relative sm:w-56 w-full overflow-hidden flex-shrink-0 bg-gray-100">
            <motion.img
              className="w-full h-40 sm:h-full object-cover"
              src={thumbnail}
              alt={course.title}
              loading="lazy"
              variants={IMAGE_VARIANTS}
              whileHover="hover"
            />
            {badge && <CourseBadge text={badge.text} type={badge.type} />}
          </div>

          {/* Body */}
          <div className="flex-1 p-5 text-left flex flex-col justify-between min-w-0">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
                  {course.category || 'Course'}
                </span>
                <span className="text-xs text-gray-400">{course.level || 'All Levels'}</span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-gray-800 line-clamp-2 group-hover:text-violet-600 transition-colors leading-snug">
                {course.title}
              </h3>
              <p className="text-sm text-violet-500 mt-0.5 font-medium truncate">
                {course.instructorName}
              </p>
              <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed hidden sm:block">
                {course.description || course.subtitle || DEFAULT_VALUES.description}
              </p>
            </div>

            <div className="flex items-end justify-between gap-4 mt-3">
              <ListViewStats
                rating={course.averageRating}
                reviewCount={course.totalRatings ?? 0}
                students={course.enrollmentCount ?? 0}
                duration={course.totalDuration}
              />
              <div className="text-right flex-shrink-0">
                <p className="text-xl font-bold text-violet-600">{formattedPrice}</p>
                {course.originalPrice && course.originalPrice > course.price && (
                  <p className="text-xs text-gray-400 line-through">
                    {currency}{Number(course.originalPrice).toFixed(2)}
                  </p>
                )}
              </div>
            </div>

            {showProgress && <ProgressBar progress={course.progress} />}
          </div>
        </Link>
      </motion.div>
    );
  }

  // ──────────────────────────────────────────────────
  // GRID VIEW
  // ──────────────────────────────────────────────────
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
        className="flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 h-full"
      >
        {/* Thumbnail */}
        <div className="relative overflow-hidden bg-gray-100 flex-shrink-0">
          <motion.img
            className="w-full aspect-video object-cover"
            src={thumbnail}
            alt={course.title}
            loading="lazy"
            variants={IMAGE_VARIANTS}
            whileHover="hover"
          />

          {/* Hover overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none"
          >
            <div className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center">
              <HiOutlinePlay size={22} className="text-violet-600 ml-0.5" />
            </div>
          </motion.div>

          {badge && <CourseBadge text={badge.text} type={badge.type} />}

          {/* Save button */}
          <button
            onClick={handleSaveClick}
            aria-label={saved ? 'Unsave course' : 'Save course'}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow transition-transform duration-200 hover:scale-110"
          >
            <HiOutlineBookmark
              size={16}
              className={`transition-colors ${saved ? 'text-violet-600 fill-violet-600' : 'text-gray-500'}`}
            />
          </button>

          {/* ✅ FIX: price badge shown only on mobile (correct logic) */}
          {!course.isFree && (
            <span className="absolute bottom-3 right-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow sm:hidden">
              {formattedPrice}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
              {course.category || 'Course'}
            </span>
            <span className="text-xs text-gray-400">{course.level || 'All Levels'}</span>
          </div>

          <h3 className="text-sm font-bold text-gray-800 line-clamp-2 group-hover:text-violet-600 transition-colors leading-snug flex-grow">
            {course.title}
          </h3>

          <p className="text-xs text-gray-500 mt-1 truncate">by {course.instructorName}</p>

          <GridViewStats
            rating={course.averageRating ?? 0}
            reviewCount={course.totalRatings ?? 0}
            students={course.enrollmentCount ?? 0}
          />

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            {/* ✅ Price visible on sm+ screens (hidden on mobile — shown in badge above) */}
            <div className="hidden sm:block">
              <p className="text-base font-bold text-violet-600">{formattedPrice}</p>
              {course.originalPrice && course.originalPrice > course.price && (
                <p className="text-xs text-gray-400 line-through">
                  {currency}{Number(course.originalPrice).toFixed(2)}
                </p>
              )}
            </div>

            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-1.5 rounded-full shadow ml-auto sm:ml-0"
            >
              {course.isEnrolled ? 'Continue' : 'Enroll Now'}
            </motion.span>
          </div>

          {showProgress && <ProgressBar progress={course.progress} />}
        </div>
      </Link>
    </motion.div>
  );
};

export default CourseCard;