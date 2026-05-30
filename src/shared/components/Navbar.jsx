/**
 * Navbar.jsx
 * Main navigation component - Fully Responsive with mobile-first design.
 * Refactored: eliminated all duplicated logic via shared hooks and helpers.
 *
 * @module shared/components/Navbar
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HiMenu, HiX, HiUser, HiBookOpen, HiAcademicCap, HiLogout,
  HiChevronDown, HiHome, HiSearch, HiChartBar,
  HiShoppingBag, HiChatAlt2, HiShieldCheck
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
  { label: 'Home',    path: ROUTES.HOME,        icon: HiHome,     requiresAuth: false },
  { label: 'Courses', path: ROUTES.COURSE_LIST,  icon: HiBookOpen, requiresAuth: false },
];

// ============================================================================
// Shared hook – avatar key that refreshes on upload events
// ============================================================================

function useAvatarKey(avatarUrl) {
  const [avatarKey, setAvatarKey] = useState(Date.now());

  useEffect(() => {
    if (avatarUrl) setAvatarKey(Date.now());
  }, [avatarUrl]);

  useEffect(() => {
    const refresh = () => setAvatarKey(Date.now());
    window.addEventListener('avatar-updated', refresh);
    return () => window.removeEventListener('avatar-updated', refresh);
  }, []);

  return avatarKey;
}

// ============================================================================
// Shared helper – build role-aware menu items (single source of truth)
// ============================================================================

function buildMenuItems({ role, navigate, onClose, onLogout }) {
  const close = (fn) => () => { onClose?.(); fn(); };

  const go = (path) => close(() => navigate(path));

  const isStudent    = role === ROLES.STUDENT?.toLowerCase();
  const isInstructor = role === ROLES.INSTRUCTOR?.toLowerCase();
  const isAdmin      = role === ROLES.ADMIN?.toLowerCase() || role === 'superadmin';

  const items = [
    { label: 'My Profile', icon: HiUser, onClick: go(ROUTES.PROFILE) },
  ];

  if (isStudent || isInstructor) {
    items.push(
      { label: 'My Enrollments', icon: HiShoppingBag, onClick: go(ROUTES.MY_ENROLLMENTS) },
      { label: 'Chat Support',   icon: HiChatAlt2,    onClick: go(ROUTES.CHAT) },
    );
  }

  if (isInstructor || isAdmin) {
    items.push({
      label: 'Instructor Dashboard',
      icon: HiChartBar,
      onClick: go(ROUTES.INSTRUCTOR_DASHBOARD),
    });
  }

  if (isAdmin) {
    items.push(
      {
        label: 'Admin Dashboard',
        icon: HiShieldCheck,
        onClick: go(ROUTES.ADMIN_DASHBOARD),
      },
      // Admin also keeps Instructor Dashboard link – already pushed above
    );
  }

  items.push({ label: 'Logout', icon: HiLogout, onClick: close(onLogout), danger: true });

  return items;
}

// ============================================================================
// Shared Avatar component
// ============================================================================

const Avatar = ({ avatarUrl, initials, size = 8 }) => {
  const avatarKey = useAvatarKey(avatarUrl);
  const cls = `w-${size} h-${size} rounded-full`;

  if (avatarUrl) {
    return (
      <img
        key={avatarKey}
        src={`${avatarUrl}?t=${avatarKey}`}
        alt={initials}
        className={`${cls} object-cover`}
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
    );
  }

  return (
    <div className={`${cls} flex items-center justify-center text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white`}>
      {initials}
    </div>
  );
};

// ============================================================================
// Logo
// ============================================================================

const Logo = () => (
  <Link to={ROUTES.HOME} className="flex-shrink-0">
    <h1 className="text-lg sm:text-xl font-bold tracking-wider text-gray-800">
      LOOP<span className="text-purple-600">LEARN</span>
    </h1>
  </Link>
);

// ============================================================================
// Auth Buttons  (visitor state – desktop & mobile footer)
// ============================================================================

const AuthButtons = ({ onSignIn, onSignUp, stacked = false }) => (
  <div className={stacked ? 'space-y-2' : 'flex items-center gap-1 sm:gap-2'}>
    <button
      onClick={onSignIn}
      className={`${stacked ? 'w-full' : 'px-3 sm:px-4'} py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all hover:bg-purple-50 whitespace-nowrap`}
      style={{ border: '0.5px solid #534AB7', color: '#534AB7' }}
    >
      Sign In
    </button>
    <button
      onClick={onSignUp}
      className={`${stacked ? 'w-full' : 'px-3 sm:px-4'} py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium text-white transition-all hover:opacity-90 shadow-sm whitespace-nowrap`}
      style={{ background: 'linear-gradient(135deg, #534AB7 0%, #3C3489 100%)' }}
    >
      Sign Up
    </button>
  </div>
);

// ============================================================================
// Desktop Navigation Links  (hidden on mobile)
// ============================================================================

const DesktopNavLinks = ({ links, isLoggedIn, location }) => (
  <div className="hidden md:flex items-center gap-4 lg:gap-6">
    {links.map((link) => {
      if (link.requiresAuth && !isLoggedIn) return null;
      const isActive = location.pathname === link.path;
      return (
        <Link
          key={link.path}
          to={link.path}
          className={`text-sm font-medium transition-all hover:text-purple-600 flex items-center gap-1.5 whitespace-nowrap ${
            isActive ? 'text-purple-600' : 'text-gray-600'
          }`}
        >
          <link.icon size={16} />
          <span className="hidden lg:inline">{link.label}</span>
        </Link>
      );
    })}
  </div>
);

// ============================================================================
// Profile Dropdown  (desktop – authenticated users only)
// ============================================================================

const ProfileDropdown = ({ user, onLogout, navigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const username = user?.username || user?.email?.split('@')[0] || 'User';
  const role     = user?.role?.toLowerCase();
  const initials = username.slice(0, 2).toUpperCase();

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const menuItems = buildMenuItems({
    role,
    navigate,
    onClose: () => setIsOpen(false),
    onLogout,
  });

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="flex items-center gap-1 sm:gap-2 px-1.5 sm:px-2 py-1.5 rounded-full hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
        aria-label="Profile menu"
        aria-expanded={isOpen}
      >
        <Avatar avatarUrl={user?.avatar} initials={initials} size={8} />
        <span className="text-sm font-medium text-gray-700 hidden sm:inline-block">{username}</span>
        <HiChevronDown
          size={14}
          className={`text-gray-400 transition-transform duration-200 hidden sm:block ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,   scale: 1    }}
            exit={{    opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 sm:w-64 rounded-xl overflow-hidden bg-white border border-gray-100 shadow-xl z-50"
          >
            {/* User header */}
            <div className="px-3 sm:px-4 py-3 border-b border-gray-100 bg-gray-50">
              <p className="text-sm font-semibold text-gray-800 truncate">{username}</p>
              <p className="text-xs text-gray-500 capitalize">{role || 'User'}</p>
            </div>

            {/* Menu items */}
            <div className="py-1 max-h-96 overflow-y-auto">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className={`w-full px-3 sm:px-4 py-2.5 text-left text-sm transition-colors duration-150 flex items-center gap-3 ${
                    item.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-purple-50'
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
// Mobile Search
// ============================================================================

const MobileSearchButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="md:hidden p-2 rounded-full hover:bg-gray-100 transition"
    aria-label="Search"
  >
    <HiSearch size={18} className="text-gray-600" />
  </button>
);

const MobileSearchOverlay = ({ isOpen, onClose }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{    opacity: 0, y: -20 }}
      className="absolute top-full left-0 right-0 bg-white shadow-lg p-4 border-t border-gray-100 md:hidden z-50"
    >
      <div className="relative">
        <SearchBar variant="mobile" />
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 p-1 bg-gray-200 rounded-full hover:bg-gray-300 transition"
        >
          <HiX size={12} />
        </button>
      </div>
    </motion.div>
  );
};

// ============================================================================
// Mobile Menu  (slide-in drawer)
// ============================================================================

const MobileMenu = ({ isOpen, onClose, isLoggedIn, user, onLogout, onSignIn, onSignUp, navigate, location }) => {
  const username = user?.username || user?.email?.split('@')[0] || 'User';
  const role     = user?.role?.toLowerCase();
  const initials = username.slice(0, 2).toUpperCase();

  // Static nav links always shown at top
  const staticLinks = [
    { label: 'Home',    path: ROUTES.HOME,        icon: HiHome     },
    { label: 'Courses', path: ROUTES.COURSE_LIST,  icon: HiBookOpen },
  ];

  // Role-aware items reuse the same builder (minus Logout – handled in footer)
  const authItems = isLoggedIn
    ? buildMenuItems({ role, navigate, onClose, onLogout }).filter((i) => !i.danger)
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{    opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{    x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 left-0 bottom-0 w-72 sm:w-80 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <Logo />
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition">
                <HiX size={20} />
              </button>
            </div>

            {/* User info (authenticated only) */}
            {isLoggedIn && user && (
              <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-gray-50">
                <div className="flex-shrink-0 overflow-hidden rounded-full">
                  <Avatar avatarUrl={user.avatar} initials={initials} size={10} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{username}</p>
                  <p className="text-xs text-gray-500 capitalize truncate">{user.role || 'User'}</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
              {/* Static links – always visible */}
              {staticLinks.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.label}
                    onClick={() => { onClose(); navigate(item.path); }}
                    className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition ${
                      isActive ? 'bg-purple-50 text-purple-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon size={18} className={isActive ? 'text-purple-600' : 'text-gray-400'} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* Auth-only links – reused from buildMenuItems */}
              {authItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition ${
                      isActive ? 'bg-purple-50 text-purple-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon size={18} className={isActive ? 'text-purple-600' : 'text-gray-400'} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Footer – Auth buttons (visitor) OR Logout (authenticated) */}
            <div className="p-4 border-t border-gray-100">
              {!isLoggedIn ? (
                <AuthButtons
                  onSignIn={() => { onClose(); onSignIn(); }}
                  onSignUp={() => { onClose(); onSignUp(); }}
                  stacked
                />
              ) : (
                <button
                  onClick={() => { onLogout(); onClose(); }}
                  className="w-full py-2.5 rounded-full text-sm font-medium text-red-600 hover:bg-red-50 transition flex items-center justify-center gap-2"
                >
                  <HiLogout size={16} />
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// Main Navbar
// ============================================================================

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isNavSearchVisible }            = useUI();
  const location  = useLocation();
  const navigate  = useNavigate();

  const [isMobileMenuOpen,   setIsMobileMenuOpen]   = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleLogout  = useCallback(() => { logout(); setIsMobileMenuOpen(false); navigate(ROUTES.HOME); }, [logout, navigate]);
  const handleSignIn  = useCallback(() => { setIsMobileMenuOpen(false); navigate(ROUTES.SIGN_IN); },        [navigate]);
  const handleSignUp  = useCallback(() => { setIsMobileMenuOpen(false); navigate(ROUTES.SIGN_UP); },        [navigate]);

  // Close drawers/overlays on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">

            <Logo />

            <DesktopNavLinks links={NAV_LINKS} isLoggedIn={isAuthenticated} location={location} />

            {/* Right section */}
            <div className="flex items-center gap-1 sm:gap-2">

              {/* Search */}
              {isNavSearchVisible && (
                <>
                  <MobileSearchButton onClick={() => setIsMobileSearchOpen(true)} />
                  <div className="hidden md:block w-64 lg:w-80">
                    <SearchBar variant="default" />
                  </div>
                </>
              )}

              {/* Desktop: Profile dropdown (auth) OR Auth buttons (visitor) */}
              <div className="hidden md:block">
                {isAuthenticated ? (
                  <ProfileDropdown user={user} onLogout={handleLogout} navigate={navigate} />
                ) : (
                  <AuthButtons onSignIn={handleSignIn} onSignUp={handleSignUp} />
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
                aria-label="Menu"
              >
                <HiMenu size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <MobileSearchOverlay isOpen={isMobileSearchOpen} onClose={() => setIsMobileSearchOpen(false)} />
      </nav>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isLoggedIn={isAuthenticated}
        user={user}
        onLogout={handleLogout}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        navigate={navigate}
        location={location}
      />
    </>
  );
};

export default Navbar;