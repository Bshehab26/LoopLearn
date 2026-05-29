/**
 * Hero.jsx
 * Hero section component with animated text, CTA buttons, and stats.
 * Features scroll-triggered animations and modern gradient design.
 * 
 * @module features/student/components/Hero
 */

import React, { useEffect, useRef, useState } from 'react';  // ✅ Removed useContext
import { assets } from '../../../assets/assets';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../courses/components/SearchBar';
import { useUI } from '../../../store/AppProvider';  // ✅ Changed: useUI instead of AppContext
import { motion } from 'framer-motion';

// ============================================================================
// Constants
// ============================================================================

const STATS_DATA = [
  { value: '50K+', label: 'Active Students', color: '#534AB7' },
  { value: '500+', label: 'Expert Courses', color: '#534AB7' },
  { value: '95%', label: 'Success Rate', color: '#534AB7' },
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
};

const badgeVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
};

// ============================================================================
// Subcomponents
// ============================================================================

const PromoBadge = () => (
  <motion.div
    variants={badgeVariants}
    className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 shadow-sm cursor-default'
    style={{ border: '0.5px solid rgba(83,74,183,0.2)' }}
  >
    <span className='w-2 h-2 rounded-full bg-purple-600 animate-pulse' />
    <span className='text-xs font-medium text-purple-700'>✨ Limited Time Offer - 20% Off</span>
  </motion.div>
);

const MainHeading = () => (
  <motion.h1 
    variants={itemVariants}
    className='text-3xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight relative'
  >
    Empower Your Future With Courses Designed To{' '}
    <span className='gradient-text relative inline-block'>
      Fit Your Needs
      <motion.div 
        className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full'
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />
    </span>
  </motion.h1>
);

const Description = () => (
  <motion.p 
    variants={itemVariants}
    className='text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed'
  >
    Learn from world-class instructors, explore interactive content,
    and join a supportive community to achieve your goals.
  </motion.p>
);

const CTAButtons = ({ onExplore, onLearnMore }) => (
  <motion.div 
    variants={itemVariants}
    className='flex flex-col sm:flex-row items-center justify-center gap-4 pt-2'
  >
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(83,74,183,0.3)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onExplore}
      className='bg-gradient-to-r from-purple-600 to-purple-800 text-white px-8 py-3 rounded-full text-lg font-medium shadow-md transition-all duration-300'
    >
      Explore Courses
    </motion.button>

    <motion.button
      whileHover={{ scale: 1.05, backgroundColor: '#F3F0FF' }}
      whileTap={{ scale: 0.98 }}
      onClick={onLearnMore}
      className='btn-secondary'
    >
      Learn More
    </motion.button>
  </motion.div>
);

const StatsRow = () => (
  <motion.div 
    variants={itemVariants}
    className='stats-row flex flex-wrap justify-center gap-8 pt-8 mt-4'
  >
    {STATS_DATA.map((stat, idx) => (
      <div key={idx} className='text-center group'>
        <p className='text-2xl md:text-3xl font-bold text-purple-600 group-hover:scale-110 transition-transform duration-300'>
          {stat.value}
        </p>
        <p className='text-xs text-gray-500 mt-1'>{stat.label}</p>
      </div>
    ))}
  </motion.div>
);

const FloatingSketch = () => (
  <img
    src={assets.sketch}
    alt='sketch'
    className='hidden md:block absolute -bottom-6 right-10 w-28 opacity-80 floating-sketch'
  />
);

// ============================================================================
// Main Component
// ============================================================================

const Hero = () => {
  const navigate = useNavigate();
  const { isNavSearchVisible } = useUI();  // ✅ Changed: from AppContext to useUI
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

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

  const handleExploreCourses = () => {
    navigate('/courses');
  };

  const handleLearnMore = () => {
    const section = document.getElementById('about');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      className='hero-section w-full overflow-hidden'
    >
      <style>{`
        .hero-section {
          background: linear-gradient(135deg, #f8f7ff 0%, #ffffff 50%, #ffffff 100%);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #534AB7 0%, #7B74D4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .btn-secondary {
          border: 2px solid #534AB7;
          color: #534AB7;
          background: transparent;
          padding: 12px 32px;
          border-radius: 9999px;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        }
        
        .btn-secondary:hover {
          background: #F3F0FF;
          transform: translateY(-2px);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .floating-sketch {
          animation: float 4s ease-in-out infinite;
        }
        
        .stats-row {
          border-top: 0.5px solid rgba(0, 0, 0, 0.06);
        }
        
        .fade-up {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1), 
                      transform 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        }
        
        .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .stagger-1 { transition-delay: 0.05s; }
        .stagger-2 { transition-delay: 0.1s; }
        .stagger-3 { transition-delay: 0.15s; }
        .stagger-4 { transition-delay: 0.2s; }
        .stagger-5 { transition-delay: 0.25s; }
      `}</style>

      <div className='max-w-6xl mx-auto px-6 py-16 md:py-20 lg:py-24 text-center'>
        <div className='relative'>
          <FloatingSketch />
        </div>

        <div className='space-y-6 md:space-y-8'>
          <div className={isVisible ? 'visible' : ''}>
            <PromoBadge />
          </div>

          <div className={`fade-up ${isVisible ? 'visible' : ''} stagger-1`}>
            <MainHeading />
          </div>

          <div className={`fade-up ${isVisible ? 'visible' : ''} stagger-2`}>
            <Description />
          </div>

          {/* Search Bar (conditionally visible) */}
          <div 
            className={`pt-4 flex justify-center transition-all duration-300 ${
              isNavSearchVisible
                ? 'opacity-0 pointer-events-none h-0 overflow-hidden'
                : 'opacity-100'
            }`}
          >
            <div className='w-full max-w-xl'>
              <SearchBar variant='hero' />
            </div>
          </div>

          <div className={`fade-up ${isVisible ? 'visible' : ''} stagger-3`}>
            <CTAButtons 
              onExplore={handleExploreCourses}
              onLearnMore={handleLearnMore}
            />
          </div>

          <div className={`fade-up ${isVisible ? 'visible' : ''} stagger-4`}>
            <StatsRow />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;