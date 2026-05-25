// src/shared/components/Navbar.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HiMenu, HiX, HiUser, HiBookOpen, HiAcademicCap, HiLogout, 
  HiChevronDown, HiHome, HiSearch, HiChartBar, HiUsers, 
  HiPlusCircle, HiShoppingBag, HiChatAlt2, HiCog, HiShieldCheck
} from 'react-icons/hi';
import { useAuth, useUI } from '../../store/AppProvider';  // ✅ Changed
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
      divider: false,
    });
    
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
    }
    
    if (isInstructor) {
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
    }
    
    if (isAdmin) {
      items.push({ divider: true, label: 'ADMIN' });
      items.push({
        label: 'Admin Dashboard',
        icon: HiShieldCheck,
        onClick: () => navigate('/admin/dashboard'),
        divider: false,
      });
      items.push({
        label: 'Manage Users',
        icon: HiUsers,
        onClick: () => navigate('/admin/users'),
        divider: false,
      });
      items.push({
        label: 'Manage Courses',
        icon: HiBookOpen,
        onClick: () => navigate('/admin/courses'),
        divider: false,
      });
    }
    
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
  };

  const menuItems = getMenuItems();

  return (
    <div className="relative" ref={dropdownRef}>
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

const MobileBottomNav = ({ isLoggedIn, location, navigate, user }) => {
  const role = user?.role?.toLowerCase();
  
  const mobileNavItems = [
    { label: 'Home', icon: HiHome, path: ROUTES.HOME },
    { label: 'Courses', icon: HiBookOpen, path: ROUTES.COURSE_LIST },
  ];
  
  if (isLoggedIn) {
    mobileNavItems.push({ label: 'Profile', icon: HiUser, path: ROUTES.PROFILE });
    
    if (role === ROLES.INSTRUCTOR?.toLowerCase()) {
      mobileNavItems.push({ label: 'Teach', icon: HiAcademicCap, path: ROUTES.INSTRUCTOR_DASHBOARD });
    }
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-50">
      <div className="flex justify-around items-center py-2">
        {mobileNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition ${
                isActive ? 'text-purple-600' : 'text-gray-500'
              }`}
            >
              <item.icon size={20} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();  // ✅ Changed
  const { isNavSearchVisible } = useUI();  // ✅ Changed
  const location = useLocation();
  const navigate = useNavigate();
  
  const isLoggedIn = isAuthenticated;  // ✅ Changed
  
  const handleLogout = useCallback(() => {
    logout();  // ✅ Changed
  }, [logout]);

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
            
            <div className="flex items-center gap-3">
              {isNavSearchVisible && (
                <div className="lg:hidden">
                  <SearchBar variant="compact" />
                </div>
              )}
              
              {!isLoggedIn ? (
                <AuthButtons 
                  onSignIn={() => navigate(ROUTES.SIGN_IN)} 
                  onSignUp={() => navigate(ROUTES.SIGN_UP)} 
                />
              ) : (
                <UserMenu user={user} onLogout={handleLogout} navigate={navigate} />
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <MobileBottomNav 
        isLoggedIn={isLoggedIn}
        location={location}
        navigate={navigate}
        user={user}
      />
      
      <div className="lg:hidden h-16" />
    </>
  );
};

export default Navbar;