/**
 * Navbar.jsx
 * Main navigation component - Responsive with mobile menu.
 * Features: Logo, search (expandable on mobile), auth buttons, mobile menu.
 * 
 * @module shared/components/Navbar
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HiMenu, HiX, HiUser, HiBookOpen, HiAcademicCap, HiLogout, 
  HiChevronDown, HiHome, HiSearch, HiChartBar, HiUsers, 
  HiPlusCircle, HiShoppingBag, HiChatAlt2, HiCog, HiShieldCheck,
  HiOutlineCreditCard, HiOutlineDocumentText, HiOutlineUserGroup
} from 'react-icons/hi';
import { useAuth, useUI } from '../../store/AppProvider';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '../../features/courses/components/SearchBar';
import { ROUTES } from '../constants/routes';
import { ROLES } from '../constants/roles';

// ============================================================================
// Constants
// ============================================================================

const NAV_LINKS = [
  { label: 'Home', path: ROUTES.HOME, icon: HiHome, requiresAuth: false },
  { label: 'Courses', path: ROUTES.COURSE_LIST, icon: HiBookOpen, requiresAuth: false },
];

// ============================================================================
// Helper Components
// ============================================================================

const Logo = () => (
  <Link to={ROUTES.HOME} className="flex-shrink-0">
    <h1 className="text-xl font-bold tracking-wider text-gray-800">
      LOOP<span className="text-purple-600">LEARN</span>
    </h1>
  </Link>
);

// ============================================================================
// Optimized User Menu Dropdown
// ============================================================================

const UserMenu = ({ user, onLogout, navigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const username = user?.username || user?.email?.split('@')[0] || 'User';
  const role = user?.role?.toLowerCase();
  const initials = username.slice(0, 2).toUpperCase();
  
  const isStudent = role === ROLES.STUDENT?.toLowerCase();
  const isInstructor = role === ROLES.INSTRUCTOR?.toLowerCase();
  const isAdmin = role === ROLES.ADMIN?.toLowerCase() || role === 'superadmin';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Memoize menu items to prevent re-renders
  const getMenuItems = useCallback(() => {
    const items = [];
    
    // Profile - always show
    items.push({
      label: 'My Profile',
      icon: HiUser,
      onClick: () => navigate(ROUTES.PROFILE),
      divider: false,
    });
    
    // Student specific
    if (isStudent) {
      items.push({
        label: 'My Enrollments',
        icon: HiShoppingBag,
        onClick: () => navigate(ROUTES.MY_ENROLLMENTS),
        divider: false,
      });
      items.push({
        label: 'Chat Support',
        icon: HiChatAlt2,
        onClick: () => navigate(ROUTES.CHAT),
        divider: false,
      });
      items.push({
        label: 'Payment History',
        icon: HiOutlineCreditCard,
        onClick: () => navigate('/payments'),
        divider: false,
      });
    }
    
    // Instructor specific
    if (isInstructor) {
      items.push({ divider: true, label: 'TEACHING' });
      items.push({
        label: 'Dashboard',
        icon: HiChartBar,
        onClick: () => navigate(ROUTES.INSTRUCTOR_DASHBOARD),
        divider: false,
      });
      items.push({
        label: 'My Courses',
        icon: HiBookOpen,
        onClick: () => navigate(ROUTES.INSTRUCTOR_COURSES),
        divider: false,
      });
      items.push({
        label: 'Add Course',
        icon: HiPlusCircle,
        onClick: () => navigate(ROUTES.INSTRUCTOR_ADD),
        divider: false,
      });
      items.push({
        label: 'My Students',
        icon: HiUsers,
        onClick: () => navigate(ROUTES.INSTRUCTOR_STUDENTS),
        divider: false,
      });
      items.push({
        label: 'Earnings',
        icon: HiOutlineCurrencyDollar,
        onClick: () => navigate('/instructor/earnings'),
        divider: false,
      });
    }
    
    // Admin specific
    if (isAdmin) {
      items.push({ divider: true, label: 'ADMIN' });
      items.push({
        label: 'Dashboard',
        icon: HiChartBar,
        onClick: () => navigate(ROUTES.ADMIN_DASHBOARD),
        divider: false,
      });
      items.push({
        label: 'Users',
        icon: HiOutlineUserGroup,
        onClick: () => navigate(ROUTES.ADMIN_USERS),
        divider: false,
      });
      items.push({
        label: 'Courses',
        icon: HiBookOpen,
        onClick: () => navigate(ROUTES.ADMIN_COURSES),
        divider: false,
      });
      items.push({
        label: 'Categories',
        icon: HiShieldCheck,
        onClick: () => navigate(ROUTES.ADMIN_CATEGORIES),
        divider: false,
      });
      items.push({
        label: 'Reports',
        icon: HiOutlineDocumentText,
        onClick: () => navigate(ROUTES.ADMIN_REPORTS),
        divider: false,
      });
    }
    
    // Settings & Logout
    items.push({ divider: true });
    items.push({
      label: 'Settings',
      icon: HiCog,
      onClick: () => navigate('/settings'),
      divider: false,
    });
    items.push({
      label: 'Logout',
      icon: HiLogout,
      onClick: onLogout,
      divider: false,
      danger: true,
    });
    
    return items;
  }, [isStudent, isInstructor, isAdmin, navigate, onLogout]);

  const menuItems = getMenuItems();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          {initials}
        </div>
        <span className="text-sm font-medium text-gray-700 hidden sm:inline">{username}</span>
        <HiChevronDown 
          size={14} 
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-72 rounded-xl overflow-hidden bg-white border border-gray-100 shadow-xl z-50"
          >
            <div className="py-1">
              {menuItems.map((item, idx) => (
                item.divider ? (
                  <div key={`divider-${idx}`} className="border-t border-gray-100 my-1">
                    {item.label && (
                      <div className="px-4 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                        {item.label}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    key={item.label}
                    onClick={() => {
                      item.onClick();
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors duration-150 flex items-center gap-3 ${
                      item.danger 
                        ? 'text-red-600 hover:bg-red-50' 
                        : 'text-gray-700 hover:bg-purple-50'
                    }`}
                  >
                    <item.icon size={16} className={item.danger ? 'text-red-500' : 'text-gray-400'} />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-medium bg-purple-100 text-purple-600 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                )
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// Auth Buttons (Desktop)
// ============================================================================

const AuthButtons = ({ onSignIn, onSignUp }) => (
  <div className="flex items-center gap-2">
    <button
      onClick={onSignIn}
      className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-purple-50"
      style={{ border: '0.5px solid #534AB7', color: '#534AB7' }}
    >
      Sign in
    </button>
    <button
      onClick={onSignUp}
      className="px-4 py-2 rounded-full text-sm font-medium text-white transition-all hover:opacity-90 shadow-sm"
      style={{ background: 'linear-gradient(135deg, #534AB7 0%, #3C3489 100%)' }}
    >
      Sign up
    </button>
  </div>
);

// ============================================================================
// Desktop Navigation Links
// ============================================================================

const DesktopNavLinks = ({ links, isLoggedIn, location }) => (
  <div className="hidden lg:flex items-center gap-6">
    {links.map((link) => {
      if (link.requiresAuth && !isLoggedIn) return null;
      const isActive = location.pathname === link.path;
      return (
        <Link
          key={link.path}
          to={link.path}
          className={`text-sm font-medium transition-all hover:text-purple-600 flex items-center gap-1.5 ${
            isActive ? 'text-purple-600' : 'text-gray-600'
          }`}
        >
          <link.icon size={16} />
          {link.label}
        </Link>
      );
    })}
  </div>
);

// ============================================================================
// Expandable Search Bar for Mobile
// ============================================================================

const ExpandableSearch = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isExpanded) {
    return (
      <motion.div
        ref={searchRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed top-16 left-4 right-4 z-50 bg-white rounded-xl shadow-xl p-3 border border-gray-200 lg:hidden"
      >
        <div className="relative">
          <SearchBar variant="default" />
          <button
            onClick={() => setIsExpanded(false)}
            className="absolute -top-2 -right-2 p-1 bg-gray-200 rounded-full hover:bg-gray-300 transition"
          >
            <HiX size={12} />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <button
      onClick={() => setIsExpanded(true)}
      className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition"
      aria-label="Search"
    >
      <HiSearch size={18} className="text-gray-600" />
    </button>
  );
};

// ============================================================================
// Mobile Menu Component
// ============================================================================

const MobileMenu = ({ isOpen, onClose, isLoggedIn, user, onLogout, navigate, location }) => {
  const role = user?.role?.toLowerCase();
  const isInstructor = role === ROLES.INSTRUCTOR?.toLowerCase();
  const isAdmin = role === ROLES.ADMIN?.toLowerCase() || role === 'superadmin';

  const getMenuItems = () => {
    const items = [];
    
    items.push(
      { label: 'Home', path: ROUTES.HOME, icon: HiHome },
      { label: 'Courses', path: ROUTES.COURSE_LIST, icon: HiBookOpen }
    );
    
    if (isLoggedIn) {
      items.push({ label: 'My Profile', path: ROUTES.PROFILE, icon: HiUser });
      
      if (!isInstructor && !isAdmin) {
        items.push({ label: 'My Enrollments', path: ROUTES.MY_ENROLLMENTS, icon: HiShoppingBag });
        items.push({ label: 'Chat Support', path: ROUTES.CHAT, icon: HiChatAlt2 });
      }
      
      if (isInstructor) {
        items.push({ label: 'Dashboard', path: ROUTES.INSTRUCTOR_DASHBOARD, icon: HiChartBar });
        items.push({ label: 'My Courses', path: ROUTES.INSTRUCTOR_COURSES, icon: HiBookOpen });
        items.push({ label: 'Add Course', path: ROUTES.INSTRUCTOR_ADD, icon: HiPlusCircle });
        items.push({ label: 'My Students', path: ROUTES.INSTRUCTOR_STUDENTS, icon: HiUsers });
      }
      
      if (isAdmin) {
        items.push({ label: 'Admin Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: HiShieldCheck });
        items.push({ label: 'Users', path: ROUTES.ADMIN_USERS, icon: HiUsers });
        items.push({ label: 'Courses', path: ROUTES.ADMIN_COURSES, icon: HiBookOpen });
        items.push({ label: 'Categories', path: ROUTES.ADMIN_CATEGORIES, icon: HiShieldCheck });
      }
    }
    
    return items;
  };

  const menuItems = getMenuItems();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
          
          {/* Menu Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 left-0 bottom-0 w-80 bg-white shadow-2xl z-50 lg:hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <Logo />
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <HiX size={20} />
              </button>
            </div>
            
            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-4">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-6 py-3 text-sm transition ${
                      isActive 
                        ? 'bg-purple-50 text-purple-600 font-medium' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon size={18} className={isActive ? 'text-purple-600' : 'text-gray-400'} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            
            {/* Footer - Auth Buttons for Visitors */}
            {!isLoggedIn && (
              <div className="p-4 border-t border-gray-100 space-y-2">
                <button
                  onClick={() => { navigate(ROUTES.SIGN_IN); onClose(); }}
                  className="w-full py-2.5 rounded-full text-sm font-medium transition-all hover:bg-purple-50"
                  style={{ border: '0.5px solid #534AB7', color: '#534AB7' }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { navigate(ROUTES.SIGN_UP); onClose(); }}
                  className="w-full py-2.5 rounded-full text-sm font-medium text-white transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #534AB7 0%, #3C3489 100%)' }}
                >
                  Sign Up
                </button>
              </div>
            )}
            
            {/* Footer - Logout for Logged-in Users */}
            {isLoggedIn && (
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={() => { onLogout(); onClose(); }}
                  className="w-full py-2.5 rounded-full text-sm font-medium text-red-600 hover:bg-red-50 transition flex items-center justify-center gap-2"
                >
                  <HiLogout size={16} />
                  Logout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// Main Component
// ============================================================================

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isNavSearchVisible } = useUI();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isLoggedIn = isAuthenticated;
  
  const handleLogout = useCallback(() => {
    logout();
    setIsMobileMenuOpen(false);
  }, [logout]);

  // Close mobile menu on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Logo />
            
            {/* Desktop Navigation Links */}
            <DesktopNavLinks links={NAV_LINKS} isLoggedIn={isLoggedIn} location={location} />
            
            {/* Search Bar - Desktop only */}
            {isNavSearchVisible && (
              <div className="hidden lg:block w-80">
                <SearchBar variant="default" />
              </div>
            )}
            
            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Expandable Search - Mobile/Tablet */}
              {isNavSearchVisible && <ExpandableSearch />}
              
              {/* Desktop Auth or User Menu */}
              {!isLoggedIn ? (
                <AuthButtons 
                  onSignIn={() => navigate(ROUTES.SIGN_IN)} 
                  onSignUp={() => navigate(ROUTES.SIGN_UP)} 
                />
              ) : (
                <UserMenu user={user} onLogout={handleLogout} navigate={navigate} />
              )}
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
                aria-label="Menu"
              >
                <HiMenu size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={handleLogout}
        navigate={navigate}
        location={location}
      />
    </>
  );
};

// Need to add missing icon
const HiOutlineCurrencyDollar = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default Navbar;