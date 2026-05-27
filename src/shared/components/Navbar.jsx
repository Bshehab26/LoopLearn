/**
 * Navbar.jsx
 * Main navigation component - Responsive with mobile menu for visitors.
 * Features: Logo, search (expandable on mobile), auth buttons, mobile menu.
 * 
 * @module shared/components/Navbar
 */

import { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HiMenu, HiX, HiUser, HiBookOpen, HiAcademicCap, HiLogout, 
  HiChevronDown, HiHome, HiSearch, HiChartBar, HiUsers, 
  HiPlusCircle, HiShoppingBag, HiChatAlt2, HiCog, HiShieldCheck
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
// Mobile Menu Component (For Visitors & Logged-in Users)
// ============================================================================

const MobileMenu = ({ isOpen, onClose, isLoggedIn, user, onLogout, navigate, location }) => {
  const role = user?.role?.toLowerCase();
  const isInstructor = role === ROLES.INSTRUCTOR?.toLowerCase();
  const isAdmin = role === ROLES.ADMIN?.toLowerCase();

  // Get menu items based on auth state
  const getMenuItems = () => {
    const items = [];
    
    // Main navigation links (always visible)
    items.push(
      { label: 'Home', path: ROUTES.HOME, icon: HiHome },
      { label: 'Courses', path: ROUTES.COURSE_LIST, icon: HiBookOpen }
    );
    
    if (isLoggedIn) {
      // Profile
      items.push({ label: 'My Profile', path: ROUTES.PROFILE, icon: HiUser });
      
      // Student specific
      if (!isInstructor && !isAdmin) {
        items.push({ label: 'My Enrollments', path: ROUTES.MY_ENROLLMENTS, icon: HiShoppingBag });
        items.push({ label: 'Chat Support', path: ROUTES.CHAT, icon: HiChatAlt2 });
      }
      
      // Instructor specific
      if (isInstructor) {
        items.push({ label: 'Dashboard', path: ROUTES.INSTRUCTOR_DASHBOARD, icon: HiChartBar });
        items.push({ label: 'My Courses', path: ROUTES.INSTRUCTOR_COURSES, icon: HiBookOpen });
        items.push({ label: 'Add Course', path: ROUTES.INSTRUCTOR_ADD, icon: HiPlusCircle });
        items.push({ label: 'My Students', path: ROUTES.INSTRUCTOR_STUDENTS, icon: HiUsers });
      }
      
      // Admin specific
      if (isAdmin) {
        items.push({ label: 'Admin Dashboard', path: '/admin/dashboard', icon: HiShieldCheck });
        items.push({ label: 'Manage Users', path: '/admin/users', icon: HiUsers });
        items.push({ label: 'Manage Courses', path: '/admin/courses', icon: HiBookOpen });
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
            className="absolute -top-2 -right-2 p-1 bg-gray-200 rounded-full"
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
// Desktop User Menu
// ============================================================================

const UserMenu = ({ user, onLogout, navigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const username = user?.username || user?.email?.split('@')[0] || 'User';
  const role = user?.role?.toLowerCase();
  const initials = username.slice(0, 2).toUpperCase();
  
  const isStudent = role === ROLES.STUDENT?.toLowerCase();
  const isInstructor = role === ROLES.INSTRUCTOR?.toLowerCase();
  const isAdmin = role === ROLES.ADMIN?.toLowerCase();

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getMenuItems = () => {
    const items = [];
    
    items.push({
      label: 'My Profile',
      icon: HiUser,
      onClick: () => navigate(ROUTES.PROFILE),
    });
    
    if (isStudent) {
      items.push({
        label: 'My Enrollments',
        icon: HiShoppingBag,
        onClick: () => navigate(ROUTES.MY_ENROLLMENTS),
      });
      items.push({
        label: 'Chat Support',
        icon: HiChatAlt2,
        onClick: () => navigate(ROUTES.CHAT),
      });
    }
    
    if (isInstructor) {
      items.push({
        label: 'Dashboard',
        icon: HiChartBar,
        onClick: () => navigate(ROUTES.INSTRUCTOR_DASHBOARD),
      });
      items.push({
        label: 'My Courses',
        icon: HiBookOpen,
        onClick: () => navigate(ROUTES.INSTRUCTOR_COURSES),
      });
      items.push({
        label: 'Add Course',
        icon: HiPlusCircle,
        onClick: () => navigate(ROUTES.INSTRUCTOR_ADD),
      });
      items.push({
        label: 'My Students',
        icon: HiUsers,
        onClick: () => navigate(ROUTES.INSTRUCTOR_STUDENTS),
      });
    }
    
    if (isAdmin) {
      items.push({ divider: true, label: 'ADMIN' });
      items.push({
        label: 'Admin Dashboard',
        icon: HiShieldCheck,
        onClick: () => navigate('/admin/dashboard'),
      });
      items.push({
        label: 'Manage Users',
        icon: HiUsers,
        onClick: () => navigate('/admin/users'),
      });
      items.push({
        label: 'Manage Courses',
        icon: HiBookOpen,
        onClick: () => navigate('/admin/courses'),
      });
    }
    
    items.push({ divider: true });
    items.push({
      label: 'Settings',
      icon: HiCog,
      onClick: () => navigate('/settings'),
    });
    items.push({
      label: 'Logout',
      icon: HiLogout,
      onClick: onLogout,
      danger: true,
    });
    
    return items;
  };

  const menuItems = getMenuItems();

  return (
    <div className="relative hidden lg:block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-50 transition border border-gray-200"
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-purple-100 text-purple-600">
          {initials}
        </div>
        <span className="text-sm font-medium text-gray-700 hidden sm:inline">{username}</span>
        <HiChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-64 rounded-xl overflow-hidden bg-white border border-gray-100 shadow-xl z-50"
          >
            <div className="py-2">
              {menuItems.map((item, idx) => (
                item.divider ? (
                  <div key={`divider-${idx}`} className="border-t border-gray-100 my-1">
                    {item.label && (
                      <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
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
                    className={`w-full px-4 py-2.5 text-left text-sm transition flex items-center gap-3 ${
                      item.danger 
                        ? 'text-red-600 hover:bg-red-50' 
                        : 'text-gray-700 hover:bg-purple-50'
                    }`}
                  >
                    <item.icon size={16} className={item.danger ? 'text-red-500' : 'text-purple-500'} />
                    {item.label}
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
// Desktop Auth Buttons
// ============================================================================

const AuthButtons = ({ onSignIn, onSignUp }) => (
  <div className="hidden lg:flex items-center gap-2">
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

export default Navbar;