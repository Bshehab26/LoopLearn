// src/layouts/AdminLayout.jsx - DARK SIDEBAR ONLY, NO TOP NAVIGATION

import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiChartBar, HiUsers, HiBookOpen, HiTag, HiLogout, HiHome,
  HiMenuAlt2, HiChevronLeft, HiChevronRight, HiSparkles, HiClock,
  HiViewGrid, HiUserAdd, HiFolder,
} from 'react-icons/hi';
import { useAuth, useProfile } from '../store/AppProvider';
import { ROUTES } from '../shared/constants/routes';

// ============================================================================
// Avatar (same pattern as Navbar.jsx: shows profile.avatar if present, else initials)
// ============================================================================

function useAvatarKey(avatarUrl) {
  const [avatarKey, setAvatarKey] = useState(Date.now());
  useEffect(() => { if (avatarUrl) setAvatarKey(Date.now()); }, [avatarUrl]);
  useEffect(() => {
    const refresh = () => setAvatarKey(Date.now());
    window.addEventListener('avatar-updated', refresh);
    return () => window.removeEventListener('avatar-updated', refresh);
  }, []);
  return avatarKey;
}

const Avatar = ({ avatarUrl, initials, sizeClass = 'w-10 h-10' }) => {
  const avatarKey = useAvatarKey(avatarUrl);
  if (avatarUrl) {
    return (
      <img
        key={avatarKey}
        src={`${avatarUrl}?t=${avatarKey}`}
        alt={initials}
        className={`${sizeClass} rounded-xl object-cover flex-shrink-0`}
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
    );
  }
  return (
    <div className={`${sizeClass} rounded-xl flex items-center justify-center text-sm font-medium bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg flex-shrink-0`}>
      {initials}
    </div>
  );
};

// Icon aliases for clarity
const HiOutlineLayoutDashboard = HiViewGrid;
const HiOutlineClock = HiClock;
const HiOutlineBookOpen = HiBookOpen;
const HiOutlineUsers = HiUsers;
const HiOutlineTag = HiTag;
const HiOutlineChartBar = HiChartBar;
const HiOutlineLogout = HiLogout;
const HiOutlineHome = HiHome;
const HiOutlineMenuAlt2 = HiMenuAlt2;
const HiOutlineUserAdd = HiUserAdd;
const HiOutlineFolder = HiFolder;

// ============================================================================
// Sidebar Navigation Configuration - INCLUDES CATEGORIES & TAGS
// ============================================================================

const NAVIGATION = {
  main: [
    { 
      path: ROUTES.ADMIN_DASHBOARD,
      label: 'Dashboard', 
      icon: HiOutlineLayoutDashboard,
      description: 'Overview & key metrics',
      badge: null
    },
  ],
  courses: [
    { 
      path: ROUTES.ADMIN_PENDING_COURSES,
      label: 'Pending Reviews', 
      icon: HiOutlineClock,
      description: 'Courses awaiting approval',
      badge: 'pending'
    },
    { 
      path: ROUTES.ADMIN_ALL_COURSES,
      label: 'All Courses', 
      icon: HiOutlineBookOpen,
      description: 'Manage all courses',
      badge: null
    },
  ],
  content: [
    { 
      path: ROUTES.ADMIN_CATEGORIES,
      label: 'Categories', 
      icon: HiOutlineFolder,
      description: 'Manage course categories',
      badge: null
    },
    { 
      path: ROUTES.ADMIN_TAGS,
      label: 'Tags', 
      icon: HiOutlineTag,
      description: 'Manage course tags',
      badge: null
    },
  ],
  users: [
    { 
      path: ROUTES.ADMIN_USERS,
      label: 'Users', 
      icon: HiOutlineUsers,
      description: 'Manage platform users',
      badge: null
    },
    { 
      path: ROUTES.ADMIN_INSTRUCTOR_APPLICATIONS,
      label: 'Instructor Apps', 
      icon: HiOutlineUserAdd,
      description: 'Review instructor applications',
      badge: 'new'
    },
  ],
};

// ============================================================================
// Sidebar Component - DARK VERSION ONLY
// ============================================================================

const AdminSidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const { user, logout } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.SIGN_IN);
  };

  const username = user?.username || user?.email?.split('@')[0] || 'Admin';
  const initials = username.slice(0, 2).toUpperCase();
  const userRole = user?.role || 'Administrator';

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const NavSection = ({ title, items }) => (
    <div className="mb-6">
      {!isCollapsed && (
        <div className="px-3 mb-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {title}
          </p>
        </div>
      )}
      <div className="space-y-1">
        {items.map((item) => {
          const isActive = isActivePath(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => onClose()}
              className={({ isActive: navIsActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 group relative
                ${isActive || navIsActive
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-600/30' 
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }
                ${isCollapsed ? 'justify-center' : ''}
              `}
              title={isCollapsed ? item.label : ''}
            >
              <item.icon size={18} className="transition-colors" />
              {!isCollapsed && <span>{item.label}</span>}
              {item.badge === 'pending' && !isCollapsed && (
                <span className="ml-auto px-1.5 py-0.5 text-xs bg-yellow-500 text-yellow-900 rounded-full animate-pulse">
                  New
                </span>
              )}
              {item.badge === 'new' && !isCollapsed && (
                <span className="ml-auto px-1.5 py-0.5 text-xs bg-blue-500 text-white rounded-full animate-pulse">
                  New
                </span>
              )}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-700">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.description}</p>
                </div>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        className={`
          fixed md:sticky top-0 left-0 z-40
          h-screen bg-gradient-to-b from-gray-900 to-gray-800
          shadow-2xl transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          flex-shrink-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className={`p-5 border-b border-gray-700/50 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!isCollapsed ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <HiSparkles className="text-white" size={18} />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">LOOP<span className="text-purple-400">LEARN</span></h1>
                  <p className="text-xs text-gray-500">Admin Portal</p>
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                <HiSparkles className="text-white" size={20} />
              </div>
            )}
            
            <button
              onClick={onToggleCollapse}
              className="hidden md:flex p-1 rounded-lg hover:bg-gray-700 transition text-gray-400 hover:text-white"
            >
              {isCollapsed ? <HiChevronRight size={16} /> : <HiChevronLeft size={16} />}
            </button>
          </div>

          {/* User Profile */}
          <div className={`p-4 border-b border-gray-700/50 ${isCollapsed ? 'text-center' : ''}`}>
            <div className={`flex ${isCollapsed ? 'flex-col' : 'items-center gap-3'}`}>
              <div className={isCollapsed ? 'mx-auto' : ''}>
                <Avatar avatarUrl={profile?.avatar} initials={initials} sizeClass="w-10 h-10" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{username}</p>
                  <p className="text-xs text-gray-400 capitalize">{userRole}</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Sections */}
          <nav className="flex-1 p-3 overflow-y-auto">
            <NavSection title="MAIN" items={NAVIGATION.main} />
            <NavSection title="COURSE MANAGEMENT" items={NAVIGATION.courses} />
            <NavSection title="CONTENT" items={NAVIGATION.content} />
            <NavSection title="USER MANAGEMENT" items={NAVIGATION.users} />
          </nav>

          {/* Footer Actions */}
          <div className="border-t border-gray-700/50 p-3 space-y-1">
            <button
              onClick={() => navigate('/')}
              className={`
                flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium 
                text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-200
                ${isCollapsed ? 'justify-center' : ''}
              `}
              title={isCollapsed ? 'Back to Home' : ''}
            >
              <HiOutlineHome size={18} />
              {!isCollapsed && <span>Back to Home</span>}
            </button>
            <button
              onClick={handleLogout}
              className={`
                flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium 
                text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200
                ${isCollapsed ? 'justify-center' : ''}
              `}
              title={isCollapsed ? 'Logout' : ''}
            >
              <HiOutlineLogout size={18} />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-30 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// ============================================================================
// Main Layout Component - NO TOP NAVIGATION BAR
// ============================================================================

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('adminSidebarCollapsed');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('adminSidebarCollapsed', isCollapsed);
  }, [isCollapsed]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  const location = useLocation();
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === ROUTES.ADMIN_DASHBOARD) return 'Dashboard';
    if (path === ROUTES.ADMIN_PENDING_COURSES) return 'Pending Reviews';
    if (path === ROUTES.ADMIN_ALL_COURSES) return 'All Courses';
    if (path === ROUTES.ADMIN_USERS) return 'User Management';
    if (path === ROUTES.ADMIN_INSTRUCTOR_APPLICATIONS) return 'Instructor Applications';
    if (path === ROUTES.ADMIN_CATEGORIES) return 'Categories';
    if (path === ROUTES.ADMIN_TAGS) return 'Tags';
    return 'Admin Panel';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AdminSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(prev => !prev)}
      />

      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed bottom-4 right-4 z-30 md:hidden p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition"
      >
        <HiOutlineMenuAlt2 size={20} />
      </button>

      {/* Main Content Area - Fixed height */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header - Fixed height */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-800">{getPageTitle()}</h1>
        </div>

        {/* Content - Scrollable */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;