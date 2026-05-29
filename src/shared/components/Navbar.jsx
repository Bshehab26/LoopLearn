/**
 * Navbar.jsx
 * Main navigation component - Responsive with mobile menu.
 * 
 * @module shared/components/Navbar
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HiMenu, HiX, HiUser, HiBookOpen, HiAcademicCap, HiLogout, 
  HiChevronDown, HiHome, HiSearch, HiChartBar, HiUsers, 
  HiPlusCircle, HiShoppingBag, HiChatAlt2, HiShieldCheck
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
  const avatarUrl = user?.avatar;
  const initials = username.slice(0, 2).toUpperCase();
  
  // Get avatar display (image or initials)
  const getAvatarDisplay = () => {
    if (avatarUrl) {
      return (
        <img 
          src={avatarUrl} 
          alt={username}
          className="w-8 h-8 rounded-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = `<div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white">${initials}</div>`;
          }}
        />
      );
    }
    return (
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        {initials}
      </div>
    );
  };
  
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

  // Handle navigation and close dropdown
  const handleNavigation = useCallback((path) => {
    setIsOpen(false);
    setTimeout(() => {
      navigate(path);
    }, 50);
  }, [navigate]);

  // Get menu items based on role
  const getMenuItems = () => {
    const items = [];
    
    // My Profile - ALL roles
    items.push({
      label: 'My Profile',
      icon: HiUser,
      onClick: () => handleNavigation(ROUTES.PROFILE),
    });
    
    // STUDENT only
    if (isStudent) {
      items.push({
        label: 'My Enrollments',
        icon: HiShoppingBag,
        onClick: () => handleNavigation(ROUTES.MY_ENROLLMENTS),
      });
      items.push({
        label: 'Chat Support',
        icon: HiChatAlt2,
        onClick: () => handleNavigation(ROUTES.CHAT),
      });
    }
    
    // INSTRUCTOR only
    if (isInstructor) {
      items.push({
        label: 'Dashboard',
        icon: HiChartBar,
        onClick: () => handleNavigation(ROUTES.INSTRUCTOR_DASHBOARD),
      });
      items.push({
        label: 'My Enrollments',
        icon: HiShoppingBag,
        onClick: () => handleNavigation(ROUTES.MY_ENROLLMENTS),
      });
      items.push({
        label: 'Chat Support',
        icon: HiChatAlt2,
        onClick: () => handleNavigation(ROUTES.CHAT),
      });
    }
    
    // ADMIN only
    if (isAdmin) {
      items.push({
        label: 'Admin Dashboard',
        icon: HiShieldCheck,
        onClick: () => handleNavigation(ROUTES.ADMIN_DASHBOARD),
      });
      items.push({
        label: 'Instructor Dashboard',
        icon: HiAcademicCap,
        onClick: () => handleNavigation(ROUTES.INSTRUCTOR_DASHBOARD),
      });
    }
    
    // Logout - ALL roles
    items.push({
      label: 'Logout',
      icon: HiLogout,
      onClick: () => {
        setIsOpen(false);
        onLogout();
      },
      danger: true,
    });
    
    return items;
  };

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
        {getAvatarDisplay()}
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
            className="absolute right-0 mt-2 w-64 rounded-xl overflow-hidden bg-white border border-gray-100 shadow-xl z-50"
          >
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <p className="text-sm font-semibold text-gray-800">{username}</p>
              <p className="text-xs text-gray-500 capitalize">{role || 'User'}</p>
            </div>
            
            <div className="py-1">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors duration-150 flex items-center gap-3 ${
                    item.danger 
                      ? 'text-red-600 hover:bg-red-50' 
                      : 'text-gray-700 hover:bg-purple-50'
                  }`}
                >
                  <item.icon size={16} className={item.danger ? 'text-red-500' : 'text-gray-400'} />
                  <span className="flex-1">{item.label}</span>
                </button>
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
  const isStudent = role === ROLES.STUDENT?.toLowerCase();
  const isInstructor = role === ROLES.INSTRUCTOR?.toLowerCase();
  const isAdmin = role === ROLES.ADMIN?.toLowerCase() || role === 'superadmin';

  const getMenuItems = () => {
    const items = [];
    
    // Main nav
    items.push(
      { label: 'Home', path: ROUTES.HOME, icon: HiHome },
      { label: 'Courses', path: ROUTES.COURSE_LIST, icon: HiBookOpen }
    );
    
    if (isLoggedIn) {
      items.push({ label: 'My Profile', path: ROUTES.PROFILE, icon: HiUser });
      
      // Student specific
      if (isStudent) {
        items.push({ label: 'My Enrollments', path: ROUTES.MY_ENROLLMENTS, icon: HiShoppingBag });
        items.push({ label: 'Chat Support', path: ROUTES.CHAT, icon: HiChatAlt2 });
      }
      
      // Instructor specific
      if (isInstructor) {
        items.push({ label: 'Dashboard', path: ROUTES.INSTRUCTOR_DASHBOARD, icon: HiChartBar });
        items.push({ label: 'My Enrollments', path: ROUTES.MY_ENROLLMENTS, icon: HiShoppingBag });
        items.push({ label: 'Chat Support', path: ROUTES.CHAT, icon: HiChatAlt2 });
      }
      
      // Admin specific
      if (isAdmin) {
        items.push({ label: 'Admin Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: HiShieldCheck });
        items.push({ label: 'Instructor Dashboard', path: ROUTES.INSTRUCTOR_DASHBOARD, icon: HiAcademicCap });
      }
    }
    
    return items;
  };

  const menuItems = getMenuItems();

  // Close dropdown and navigate
  const handleNavigation = (path) => {
    onClose();
    setTimeout(() => navigate(path), 50);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
          
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
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition">
                <HiX size={20} />
              </button>
            </div>
            
            {/* User Info (if logged in) */}
            {isLoggedIn && user && (
              <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-gray-50">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                  {user.username?.slice(0, 2).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{user.username}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
            )}
            
            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-4">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition ${
                      isActive 
                        ? 'bg-purple-50 text-purple-600 font-medium' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon size={18} className={isActive ? 'text-purple-600' : 'text-gray-400'} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
            
            {/* Footer - Auth Buttons for Visitors */}
            {!isLoggedIn && (
              <div className="p-4 border-t border-gray-100 space-y-2">
                <button
                  onClick={() => { handleNavigation(ROUTES.SIGN_IN); }}
                  className="w-full py-2.5 rounded-full text-sm font-medium transition-all hover:bg-purple-50"
                  style={{ border: '0.5px solid #534AB7', color: '#534AB7' }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { handleNavigation(ROUTES.SIGN_UP); }}
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
            <Logo />
            
            <DesktopNavLinks links={NAV_LINKS} isLoggedIn={isLoggedIn} location={location} />
            
            {isNavSearchVisible && (
              <div className="hidden lg:block w-80">
                <SearchBar variant="default" />
              </div>
            )}
            
            <div className="flex items-center gap-2">
              {isNavSearchVisible && <ExpandableSearch />}
              
              {!isLoggedIn ? (
                <AuthButtons 
                  onSignIn={() => navigate(ROUTES.SIGN_IN)} 
                  onSignUp={() => navigate(ROUTES.SIGN_UP)} 
                />
              ) : (
                <UserMenu user={user} onLogout={handleLogout} navigate={navigate} />
              )}
              
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