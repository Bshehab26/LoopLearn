/**
 * TestimonialSection.jsx
 * Component displaying student testimonials with expandable text.
 * Features hover effects, star ratings, and read more functionality.
 * 
 * @module features/student/components/TestimonialSection
 */

import React, { useEffect, useRef, useState } from 'react';
import { assets, dummyTestimonial } from '../../../assets/assets';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronRight, HiChevronLeft } from 'react-icons/hi';

// ============================================================================
// Constants
// ============================================================================

/** Number of characters to show before truncating */
const TRUNCATE_LENGTH = 150;

/** Animation variants */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Truncates text to specified length
 * @param {string} text - The text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
const truncateText = (text, length = TRUNCATE_LENGTH) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
};

/**
 * Formats rating to display stars
 * @param {number} rating - Rating value (1-5)
 * @returns {Array} Array of star elements
 */
const renderStars = (rating) => {
  return [...Array(5)].map((_, i) => (
    <img
      className='h-4 w-4'
      key={i}
      src={i < Math.floor(rating) ? assets.star : assets.star_blank}
      alt='star'
    />
  ));
};

// ============================================================================
// Subcomponents
// ============================================================================

/**
 * Star rating component
 */
const StarRating = ({ rating }) => (
  <div className='flex gap-0.5 mb-3'>
    {renderStars(rating)}
  </div>
);

/**
 * Testimonial Card component with expandable text
 */
const TestimonialCard = ({ testimonial, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const textRef = useRef(null);

  // Check if text needs truncation
  useEffect(() => {
    if (testimonial.feedback && testimonial.feedback.length > TRUNCATE_LENGTH) {
      setShowReadMore(true);
    }
  }, [testimonial.feedback]);

  const displayText = isExpanded 
    ? testimonial.feedback 
    : truncateText(testimonial.feedback);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      variants={cardVariants}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className='testimonial-card group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100'
    >
      {/* Header */}
      <div className='flex items-center gap-4 px-5 py-4 bg-gradient-to-r from-purple-50/50 to-white'>
        <motion.img 
          className='h-12 w-12 rounded-full object-cover border-2 border-purple-200'
          src={testimonial.image} 
          alt={testimonial.name}
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        />
        <div>
          <h3 className='text-base font-semibold text-gray-800'>{testimonial.name}</h3>
          <p className='text-xs text-purple-600'>{testimonial.role}</p>
        </div>
      </div>

      {/* Content */}
      <div className='p-5 pb-4'>
        <StarRating rating={testimonial.rating} />
        
        {/* Feedback Text with Read More */}
        <div className='relative'>
          <p 
            ref={textRef}
            className='text-gray-600 text-sm leading-relaxed italic'
          >
            "{displayText}"
          </p>
          
          {/* Fade gradient for truncated text */}
          {!isExpanded && showReadMore && (
            <div className='absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none' />
          )}
        </div>

        {/* Read More / Show Less Button */}
        {showReadMore && (
          <button
            onClick={toggleExpand}
            className='mt-3 text-purple-600 hover:text-purple-800 text-sm font-medium inline-flex items-center gap-1 group/btn transition-all'
          >
            {isExpanded ? (
              <>
                Show Less
                <HiChevronLeft className='w-4 h-4 transition-transform group-hover/btn:-translate-x-1' />
              </>
            ) : (
              <>
                Read More
                <HiChevronRight className='w-4 h-4 transition-transform group-hover/btn:translate-x-1' />
              </>
            )}
          </button>
        )}
      </div>

      {/* Footer with optional link */}
      <div className='px-5 pb-5 pt-2 border-t border-gray-50'>
        <div className='flex items-center justify-between'>
          <span className='text-xs text-gray-400'>
            {testimonial.date || 'Verified Student'}
          </span>
          <div className='flex items-center gap-1 text-xs text-gray-400'>
            <span>★★★★★</span>
            <span>{testimonial.rating?.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Section Header component
 */
const SectionHeader = () => (
  <div className='text-center mb-12'>
    <span className='inline-block text-xs font-medium px-3 py-1 rounded-full mb-4 bg-purple-100 text-purple-700'>
      Success Stories
    </span>
    <h2 className='text-3xl md:text-4xl font-bold text-gray-800'>Testimonials</h2>
    <p className='text-base text-gray-500 mt-3 max-w-2xl mx-auto leading-relaxed'>
      Hear From Our Learners As They Share Their Journeys Of Transformation, Success, 
      and How Our Platform Has Made A Difference In Their Lives
    </p>
  </div>
);

/**
 * Empty state component (when no testimonials)
 */
const EmptyState = () => (
  <div className='text-center py-12'>
    <div className='w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center'>
      <span className='text-4xl'>💬</span>
    </div>
    <p className='text-gray-500'>No testimonials available yet.</p>
    <p className='text-sm text-gray-400 mt-1'>Be the first to share your experience!</p>
  </div>
);

// ============================================================================
// Main Component
// ============================================================================

/**
 * TestimonialSection - Displays student testimonials
 * @returns {React.ReactElement} Testimonials section
 */
const TestimonialSection = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [testimonials, setTestimonials] = useState(dummyTestimonial);

  // Scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Optional: Auto-rotate testimonials (every 5 seconds)
  useEffect(() => {
    if (testimonials.length <= 1) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

  if (!testimonials || testimonials.length === 0) {
    return <EmptyState />;
  }

  return (
    <div 
      ref={sectionRef}
      className={`testimonial-section w-full py-16 px-6 md:px-16 lg:px-32 bg-gradient-to-br from-white via-purple-50/30 to-white ${
        isVisible ? 'animate-in' : ''
      }`}
    >
      {/* CSS Animations */}
      <style>{`
        .testimonial-section {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1), 
                      transform 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        }
        .testimonial-section.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        
        .testimonial-card {
          transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>

      {/* Section Header */}
      <SectionHeader />

      {/* Testimonials Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      >
        {testimonials.map((testimonial, index) => (
          <TestimonialCard 
            key={testimonial.id || index}
            testimonial={testimonial}
            index={index}
          />
        ))}
      </motion.div>

      {/* View All Button (optional) */}
      {testimonials.length > 3 && (
        <div className='text-center mt-12'>
          <button
            onClick={() => window.location.href = '/testimonials'}
            className='inline-flex items-center gap-2 px-6 py-2.5 text-purple-600 border border-purple-200 rounded-full hover:bg-purple-50 transition-all duration-300 group'
          >
            <span>View All Stories</span>
            <HiChevronRight className='w-4 h-4 transition-transform group-hover:translate-x-1' />
          </button>
        </div>
      )}
    </div>
  );
};

export default TestimonialSection;