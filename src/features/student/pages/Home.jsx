/**
 * Home.jsx
 * Landing page component for the application.
 * 
 * @module features/student/pages/Home
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useCourseContext } from '../../../store/AppProvider';  // ✅ Changed
import Loading from '../../../shared/components/Loading';
import Hero from '../components/Hero';
import Companies from '../components/Companies';
import CoursesSection from '../../courses/components/CourseSection';
import TestimonialSection from '../components/TestimonialSection';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// Constants
// ============================================================================

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5, ease: 'easeOut' }
};

const CONTENT_SHOW_DELAY = 100;

// ============================================================================
// Subcomponents
// ============================================================================

const SectionWrapper = ({ children, sectionName, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasRendered, setHasRendered] = useState(false);
  const sectionRef = React.useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasRendered) {
            setIsVisible(true);
            setHasRendered(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasRendered]);

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      data-section={sectionName}
    >
      {children}
    </motion.div>
  );
};

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 500);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className='fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 transition-all duration-300 flex items-center justify-center group'
          aria-label='Back to top'
        >
          <svg className='w-5 h-5 transform group-hover:-translate-y-1 transition-transform duration-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 10l7-7m0 0l7 7m-7-7v18' />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrolled = window.scrollY;
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = (scrolled / maxHeight) * 100;
      setProgress(percent);
    };
    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <motion.div
      className='fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 origin-left z-50'
      style={{ scaleX: progress / 100 }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: progress / 100 }}
      transition={{ duration: 0.1 }}
    />
  );
};

// ============================================================================
// Main Component
// ============================================================================

const Home = () => {
  const { loading: coursesLoading } = useCourseContext();  // ✅ Changed
  const [showContent, setShowContent] = useState(false);
  const [isPageReady, setIsPageReady] = useState(false);

  useEffect(() => {
    if (!coursesLoading) {
      const timer = setTimeout(() => {
        setShowContent(true);
        setTimeout(() => setIsPageReady(true), 500);
      }, CONTENT_SHOW_DELAY);
      return () => clearTimeout(timer);
    }
  }, [coursesLoading]);

  if (coursesLoading) {
    return <Loading />;
  }

  return (
    <>
      <ScrollProgress />
      <AnimatePresence mode='wait'>
        {showContent && (
          <motion.div key="home-content" {...pageVariants} className='w-full overflow-x-hidden'>
            <Hero />
            <SectionWrapper sectionName="companies" delay={0.1}>
              <Companies />
            </SectionWrapper>
            <SectionWrapper sectionName="courses" delay={0.15}>
              <CoursesSection />
            </SectionWrapper>
            <SectionWrapper sectionName="testimonials" delay={0.2}>
              <TestimonialSection />
            </SectionWrapper>
            <SectionWrapper sectionName="about" delay={0.25}>
              <AboutSection />
            </SectionWrapper>
            <SectionWrapper sectionName="contact" delay={0.3}>
              <ContactSection />
            </SectionWrapper>
          </motion.div>
        )}
      </AnimatePresence>
      <BackToTopButton />
      {isPageReady && <div className="hidden" data-page-ready="true" />}
    </>
  );
};

export default Home;