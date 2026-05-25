/**
 * Companies.jsx - Simplified version without Framer Motion
 * Component displaying trusted company logos with hover animations.
 * 
 * @module features/student/components/Companies
 */

import { useEffect, useRef } from 'react';
import { assets } from '../../../assets/assets';

// ============================================================================
// Constants
// ============================================================================

const COMPANY_LOGOS = [
  { src: assets.microsoft_logo, alt: 'Microsoft', delay: 0 },
  { src: assets.walmart_logo, alt: 'Walmart', delay: 0.1 },
  { src: assets.accenture_logo, alt: 'Accenture', delay: 0.2 },
  { src: assets.adobe_logo, alt: 'Adobe', delay: 0.3 },
  { src: assets.paypal_logo, alt: 'PayPal', delay: 0.4 },
];

const OBSERVER_CONFIG = {
  threshold: 0.2,
  rootMargin: '0px',
};

// ============================================================================
// Custom Hook
// ============================================================================

const useScrollAnimation = (ref, options = OBSERVER_CONFIG) => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [ref, options]);
};

// ============================================================================
// Main Component
// ============================================================================

const Companies = () => {
  const sectionRef = useRef(null);
  const logoRefs = useRef([]);

  useScrollAnimation(sectionRef);

  // Animate logos individually with CSS transitions
  useEffect(() => {
    logoRefs.current.forEach((logo, index) => {
      if (logo) {
        logo.style.transitionDelay = `${index * 0.1}s`;
      }
    });
  }, []);

  const setLogoRef = (index) => (el) => {
    logoRefs.current[index] = el;
  };

  return (
    <div 
      ref={sectionRef} 
      className='companies-section fade-up w-full py-12 px-6 bg-white overflow-hidden'
    >
      <style>{`
        .fade-up {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1), 
                      transform 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        }
        .fade-up.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        
        .logo-item {
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1);
          filter: grayscale(100%);
          cursor: pointer;
        }
        .animate-in .logo-item {
          opacity: 0.7;
          transform: scale(1);
        }
        .logo-item:hover {
          filter: grayscale(0%);
          opacity: 1;
          transform: scale(1.1);
        }
        
        @keyframes logoPulse {
          0%, 100% { 
            filter: grayscale(100%); 
            opacity: 0.6; 
            transform: scale(1);
          }
          50% { 
            filter: grayscale(0%); 
            opacity: 1; 
            transform: scale(1.05);
          }
        }
        
        .logo-item:hover {
          animation: logoPulse 0.5s ease-in-out;
        }
      `}</style>

      <p className='text-sm md:text-base text-gray-500 text-center tracking-wide uppercase font-medium'>
        Trusted by learners worldwide
      </p>

      <div className='flex items-center justify-center gap-8 md:gap-16 mt-8 flex-wrap'>
        {COMPANY_LOGOS.map((logo, index) => (
          <img
            key={index}
            ref={setLogoRef(index)}
            src={logo.src}
            alt={logo.alt}
            className='logo-item w-16 md:w-24'
            loading="lazy"
            title={logo.alt}
          />
        ))}
      </div>
    </div>
  );
};

export default Companies;