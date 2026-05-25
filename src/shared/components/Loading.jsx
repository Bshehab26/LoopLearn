/**
 * Loading.jsx
 * Skeleton loading component for better UX during data fetching.
 * Provides visual placeholders for courses, testimonials, hero section, and more.
 * 
 * @module shared/components/Loading
 */

import React from 'react';
import { motion } from 'framer-motion';

// ============================================================================
// Constants
// ============================================================================

/** Animation variants for staggered loading */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

/** Number of company logos to show in skeleton */
const COMPANY_COUNT = 5;

/** Number of featured courses to show */
const FEATURED_COURSES_COUNT = 4;

/** Number of testimonials to show */
const TESTIMONIALS_COUNT = 3;

/** Number of stats cards to show */
const STATS_COUNT = 4;

/** Number of feature cards to show */
const FEATURES_COUNT = 4;

// ============================================================================
// Subcomponents
// ============================================================================

/**
 * Shimmer animation component
 */
const Shimmer = ({ className = '', style = {}, animated = true }) => (
  <div
    className={`relative overflow-hidden bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-lg ${className}`}
    style={style}
  >
    {animated && (
      <div
        className="absolute inset-0 shimmer-animation"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
        }}
      />
    )}
  </div>
);

/**
 * Course card skeleton component
 */
const CourseCardSkeleton = () => (
  <motion.div
    variants={itemVariants}
    className='rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100'
  >
    <Shimmer style={{ height: '160px', borderRadius: 0 }} />
    <div className='p-4 space-y-3'>
      <Shimmer style={{ height: '18px', width: '85%' }} />
      <Shimmer style={{ height: '14px', width: '55%' }} />
      <div className='flex items-center gap-2'>
        <Shimmer style={{ height: '14px', width: '35px' }} />
        <Shimmer style={{ height: '14px', width: '80px' }} />
        <Shimmer style={{ height: '14px', width: '60px' }} />
      </div>
      <div className='flex items-center justify-between pt-2'>
        <Shimmer style={{ height: '20px', width: '70px' }} />
        <Shimmer style={{ height: '28px', width: '90px', borderRadius: '20px' }} />
      </div>
    </div>
  </motion.div>
);

/**
 * Testimonial card skeleton component
 */
const TestimonialCardSkeleton = () => (
  <motion.div
    variants={itemVariants}
    className='rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm'
  >
    <div className='flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-white'>
      <Shimmer style={{ width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0 }} />
      <div className='flex-1 space-y-2'>
        <Shimmer style={{ height: '16px', width: '60%' }} />
        <Shimmer style={{ height: '12px', width: '40%' }} />
      </div>
    </div>
    <div className='p-4 space-y-3'>
      <Shimmer style={{ height: '14px', width: '100px' }} />
      <Shimmer style={{ height: '14px', width: '100%' }} />
      <Shimmer style={{ height: '14px', width: '90%' }} />
      <Shimmer style={{ height: '14px', width: '75%' }} />
    </div>
  </motion.div>
);

/**
 * Stat card skeleton component
 */
const StatCardSkeleton = () => (
  <motion.div
    variants={itemVariants}
    className='rounded-2xl p-6 bg-white border border-gray-100 shadow-sm text-center'
  >
    <Shimmer style={{ width: '48px', height: '48px', borderRadius: '50%', margin: '0 auto 16px' }} />
    <Shimmer style={{ height: '32px', width: '60%', margin: '0 auto 8px' }} />
    <Shimmer style={{ height: '14px', width: '80%', margin: '0 auto' }} />
  </motion.div>
);

/**
 * Feature card skeleton component
 */
const FeatureCardSkeleton = () => (
  <motion.div
    variants={itemVariants}
    className='flex items-start gap-4 p-5 rounded-2xl bg-white border border-gray-100'
  >
    <Shimmer style={{ width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0 }} />
    <div className='flex-1 space-y-2'>
      <Shimmer style={{ height: '18px', width: '60%' }} />
      <Shimmer style={{ height: '14px', width: '90%' }} />
      <Shimmer style={{ height: '14px', width: '70%' }} />
    </div>
  </motion.div>
);

/**
 * Hero section skeleton
 */
const HeroSkeleton = () => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className='flex flex-col items-center gap-5 py-16 mb-6 text-center'
  >
    {/* Badge */}
    <Shimmer style={{ height: '28px', width: '180px', borderRadius: '99px' }} />
    
    {/* Main Title */}
    <Shimmer style={{ height: '56px', width: '70%', maxWidth: '700px' }} />
    <Shimmer style={{ height: '28px', width: '45%', maxWidth: '400px' }} />
    
    {/* Description */}
    <div className='space-y-2'>
      <Shimmer style={{ height: '20px', width: '55%', maxWidth: '500px' }} />
      <Shimmer style={{ height: '20px', width: '40%', maxWidth: '400px' }} />
    </div>
    
    {/* Search Bar */}
    <Shimmer style={{ height: '56px', width: '100%', maxWidth: '500px', borderRadius: '99px' }} />
    
    {/* Buttons */}
    <div className='flex gap-4 mt-2'>
      <Shimmer style={{ height: '48px', width: '160px', borderRadius: '99px' }} />
      <Shimmer style={{ height: '48px', width: '140px', borderRadius: '99px' }} />
    </div>
  </motion.div>
);

/**
 * Companies section skeleton
 */
const CompaniesSkeleton = () => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className='flex items-center justify-center gap-8 md:gap-12 mb-16 flex-wrap'
  >
    <div className='text-center w-full mb-4'>
      <Shimmer style={{ height: '16px', width: '200px', margin: '0 auto' }} />
    </div>
    {[...Array(COMPANY_COUNT)].map((_, i) => (
      <Shimmer key={i} style={{ height: '32px', width: '100px', borderRadius: '8px' }} />
    ))}
  </motion.div>
);

/**
 * Courses section skeleton
 */
const CoursesSectionSkeleton = () => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className='mb-16'
  >
    <div className='text-center mb-8'>
      <Shimmer style={{ height: '32px', width: '200px', margin: '0 auto 8px' }} />
      <Shimmer style={{ height: '18px', width: '320px', margin: '0 auto' }} />
    </div>
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
      {[...Array(FEATURED_COURSES_COUNT)].map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  </motion.div>
);

/**
 * Testimonials section skeleton
 */
const TestimonialsSectionSkeleton = () => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className='mb-16'
  >
    <div className='text-center mb-8'>
      <Shimmer style={{ height: '32px', width: '180px', margin: '0 auto 8px' }} />
      <Shimmer style={{ height: '18px', width: '400px', margin: '0 auto' }} />
    </div>
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
      {[...Array(TESTIMONIALS_COUNT)].map((_, i) => (
        <TestimonialCardSkeleton key={i} />
      ))}
    </div>
  </motion.div>
);

/**
 * About section skeleton
 */
const AboutSectionSkeleton = () => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className='mb-16'
  >
    <div className='text-center mb-8'>
      <Shimmer style={{ height: '24px', width: '100px', margin: '0 auto 8px', borderRadius: '99px' }} />
      <Shimmer style={{ height: '36px', width: '350px', margin: '0 auto 8px' }} />
      <Shimmer style={{ height: '18px', width: '500px', margin: '0 auto' }} />
    </div>
    
    {/* Stats Grid */}
    <div className='grid grid-cols-2 md:grid-cols-4 gap-5 mb-12'>
      {[...Array(STATS_COUNT)].map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
    
    {/* Features Grid */}
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
      {[...Array(FEATURES_COUNT)].map((_, i) => (
        <FeatureCardSkeleton key={i} />
      ))}
    </div>
  </motion.div>
);

// ============================================================================
// Main Component
// ============================================================================

/**
 * Loading - Skeleton loading component
 * @returns {React.ReactElement} Loading skeleton
 */
const Loading = () => {
  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white'>
      {/* Inject keyframes for shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .shimmer-animation {
          animation: shimmer 1.2s ease-in-out infinite;
        }
      `}</style>

      <div className='px-6 md:px-16 lg:px-32 py-10'>
        {/* Hero Section */}
        <HeroSkeleton />

        {/* Companies Section */}
        <CompaniesSkeleton />

        {/* Courses Section */}
        <CoursesSectionSkeleton />

        {/* Testimonials Section */}
        <TestimonialsSectionSkeleton />

        {/* About Section */}
        <AboutSectionSkeleton />
      </div>
    </div>
  );
};

export default Loading;