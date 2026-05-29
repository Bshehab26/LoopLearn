// src/layouts/AdminLayout.jsx
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiChartBar, HiUsers, HiBookOpen, HiTag, HiChartPie, 
  HiLogout, HiMenu, HiX, HiHome
} from 'react-icons/hi';
import { useAuth } from '../store/AppProvider';
import { ROUTES } from '../shared/constants/routes';

// ============================================================================
// Sidebar Items Configuration
// ============================================================================

const SIDEBAR_ITEMS = [
  { path: ROUTES.ADMIN_DASHBOARD, label: 'Dashboard', icon: HiChartBar, end: true },
  { path: ROUTES.ADMIN_USERS, label: 'Users', icon: HiUsers, end: true },
  { path: ROUTES.ADMIN_COURSES, label: 'Courses', icon: HiBookOpen, end: true },
  { path: ROUTES.ADMIN_CATEGORIES, label: 'Categories', icon: HiTag, end: true },
  { path: ROUTES.ADMIN_REPORTS, label: 'Reports', icon: HiChartPie, end: true },
];

// ============================================================================
// Sidebar Component
// ============================================================================

const AdminSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.SIGN_IN);
  };

  const handleBackToHome = () => {
    navigate(ROUTES.HOME);
    onClose();
  };

  const username = user?.username || user?.email?.split('@')[0] || 'Admin';
  const initials = username.slice(0, 2).toUpperCase();
  const userRole = user?.role || 'Admin';

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-40
        w-64 h-screen bg-gray-900 text-white
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="p-5 border-b border-gray-800">
            <h1 className="text-xl font-bold tracking-wide">
              LOOP<span className="text-purple-400">LEARN</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">Admin Portal</p>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{username}</p>
                <p className="text-xs text-gray-400">{userRole}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {SIDEBAR_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => onClose()}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800'
                  }
                `}
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Footer Section */}
          <div className="border-t border-gray-800">
            {/* Back to Home Button */}
            <div className="p-4">
              <button
                onClick={handleBackToHome}
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-blue-600/20 hover:text-blue-400 transition-all duration-200"
              >
                <HiHome size={18} />
                Back to Home
              </button>
            </div>

            {/* Logout Button */}
            <div className="p-4 pt-0">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-red-600/20 hover:text-red-400 transition-all duration-200"
              >
                <HiLogout size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Close Button */}
      {isOpen && (
        <button
          onClick={onClose}
          className="fixed top-4 right-4 z-50 md:hidden p-2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition"
        >
          <HiX size={20} />
        </button>
      )}
    </>
  );
};

// ============================================================================
// Main Layout Component
// ============================================================================

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-900">
      {/* Sidebar */}
      <AdminSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed bottom-4 right-4 z-30 md:hidden p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition"
      >
        <HiMenu size={20} />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-auto bg-gray-50">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;