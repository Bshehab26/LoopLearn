/**
 * InstructorNavbar.jsx
 * Navigation bar for the instructor panel.
 * Features responsive design, logout button, and user menu.
 * 
 * @module features/instructor/components/NavBar
 */

import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HiMenu, HiX, HiUser, HiLogout, HiHome, HiChevronDown, HiBell, HiQuestionMarkCircle } from 'react-icons/hi';
import { AppContext } from '../../../store/AppContext';

// ============================================================================
// Constants
// ============================================================================

/** Navigation links for instructor panel */
const NAV_LINKS = [
  { label: 'Dashboard', path: '/instructor', icon: HiUser },
  { label: 'My Courses', path: '/instructor/my-courses', icon: HiUser },
  { label: 'Add Course', path: '/instructor/add-course', icon: HiUser },
  { label: 'Students', path: '/instructor/student-enrolled', icon: HiUser },
];

// ============================================================================
// Subcomponents
// ============================================================================

/**
 * Logo component
 */
const Logo = () => (
  <Link to='/' className='flex items-center gap-2'>
    <h1 className='text-xl font-bold tracking-wide text-gray-800'>
      LOOP<span className='text-purple-600'>LEARN</span>
    </h1>
    <span className='hidden sm:inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700'>
      Instructor
    </span>
  </Link>
);

/**
 * User menu dropdown component
 */
const UserMenu = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = user?.username ? user.username.slice(0, 2).toUpperCase() : 'I';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all duration-200"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white text-sm font-medium">
          {initials}
        </div>
        <span className="hidden sm:inline text-sm font-medium text-gray-700">
          {user?.username || 'Instructor'}
        </span>
        <HiChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
          <button
            onClick={() => {
              navigate('/profile');
              setIsOpen(false);
            }}
            className="w-full px-4 py-3 text-left text-sm hover:bg-purple-50 transition flex items-center gap-3"
          >
            <HiUser className="w-4 h-4 text-purple-600" />
            My Profile
          </button>
          <button
            onClick={() => {
              navigate('/');
              setIsOpen(false);
            }}
            className="w-full px-4 py-3 text-left text-sm hover:bg-purple-50 transition flex items-center gap-3"
          >
            <HiHome className="w-4 h-4 text-green-600" />
            Back to Home
          </button>
          <div className="border-t border-gray-100" />
          <button
            onClick={onLogout}
            className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-3"
          >
            <HiLogout className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Action buttons (notifications, help)
 */
const ActionButtons = () => (
  <div className="flex items-center gap-2">
    <button className="p-2 rounded-lg hover:bg-gray-100 transition relative">
      <HiBell className="w-5 h-5 text-gray-600" />
      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
    </button>
    <button className="hidden sm:flex p-2 rounded-lg hover:bg-gray-100 transition">
      <HiQuestionMarkCircle className="w-5 h-5 text-gray-600" />
    </button>
  </div>
);

// ============================================================================
// Main Component
// ============================================================================

/**
 * InstructorNavbar - Navigation bar for instructor panel
 * @param {Object} props
 * @param {Function} props.onMenuClick - Handler for mobile menu toggle
 * @returns {React.ReactElement} Instructor navbar component
 */
const InstructorNavbar = ({ onMenuClick }) => {
  const { user, logoutUser } = useContext(AppContext);
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (onMenuClick) onMenuClick();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
              >
                {isMobileMenuOpen ? <HiX size={20} /> : <HiMenu size={20} />}
              </button>
              
              <Logo />
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive(link.path)
                      ? 'text-purple-600 border-b-2 border-purple-600 pb-0.5'
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              <ActionButtons />
              <UserMenu user={user} onLogout={handleLogout} />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 z-40 bg-white border-b border-gray-100 shadow-lg">
          <div className="flex flex-col py-4 px-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`py-3 text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'text-purple-600 bg-purple-50 rounded-lg px-3 -mx-3'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-gray-100 my-2"></div>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className="py-3 text-sm text-red-600 text-left flex items-center gap-2"
            >
              <HiLogout size={16} /> Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default InstructorNavbar;