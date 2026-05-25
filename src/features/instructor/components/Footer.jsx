/**
 * InstructorFooter.jsx
 * Footer component for the instructor panel.
 * Displays copyright information, quick links, and support contact.
 * 
 * @module features/instructor/components/Footer
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { HiHeart, HiMail, HiQuestionMarkCircle } from 'react-icons/hi';

// ============================================================================
// Constants
// ============================================================================

/** Current year for copyright */
const CURRENT_YEAR = new Date().getFullYear();

/** Quick links for instructor panel */
const QUICK_LINKS = [
  { label: 'Dashboard', path: '/instructor' },
  { label: 'My Courses', path: '/instructor/my-courses' },
  { label: 'Add Course', path: '/instructor/add-course' },
  { label: 'Students', path: '/instructor/student-enrolled' },
];

// ============================================================================
// Subcomponents
// ============================================================================

/**
 * Copyright section with heart icon
 */
const CopyrightSection = () => (
  <div className="flex items-center justify-center gap-2 flex-wrap">
    <span>© {CURRENT_YEAR} LoopLearn</span>
    <span className="hidden sm:inline text-gray-400">•</span>
    <span className="flex items-center gap-1">
      Made with <HiHeart className="text-red-500 w-4 h-4 animate-pulse" /> for instructors
    </span>
  </div>
);

/**
 * Quick links section
 */
const QuickLinks = () => (
  <div className="flex flex-wrap items-center justify-center gap-4">
    {QUICK_LINKS.map((link) => (
      <Link
        key={link.path}
        to={link.path}
        className="text-xs text-gray-500 hover:text-purple-600 transition-colors duration-200"
      >
        {link.label}
      </Link>
    ))}
  </div>
);

/**
 * Support section with contact info
 */
const SupportSection = () => (
  <div className="flex items-center justify-center gap-4">
    <a
      href="mailto:instructor-support@looplearn.com"
      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-purple-600 transition-colors duration-200"
    >
      <HiMail size={14} />
      <span>Support</span>
    </a>
    <a
      href="/help"
      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-purple-600 transition-colors duration-200"
    >
      <HiQuestionMarkCircle size={14} />
      <span>Help Center</span>
    </a>
  </div>
);

// ============================================================================
// Main Component
// ============================================================================

/**
 * InstructorFooter - Footer for instructor panel
 * @returns {React.ReactElement} Instructor footer component
 */
const InstructorFooter = () => {
  return (
    <footer className="w-full mt-auto border-t border-gray-200 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Divider with gradient */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-6" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Copyright */}
          <CopyrightSection />
          
          {/* Center: Quick Links */}
          <QuickLinks />
          
          {/* Right: Support */}
          <SupportSection />
        </div>
        
        {/* Additional info */}
        <div className="text-center mt-4">
          <p className="text-xs text-gray-400">
            LoopLearn Instructor Platform — Empowering educators to share knowledge
          </p>
        </div>
      </div>
    </footer>
  );
};

export default InstructorFooter;