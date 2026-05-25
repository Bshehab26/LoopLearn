// src/layouts/AdminLayout.jsx
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiChartBar, HiUsers, HiBookOpen, HiTag, HiChartPie, 
  HiLogout, HiMenu, HiX 
} from 'react-icons/hi';
import { useAuth } from '../store/AppProvider';  // ✅ Changed
import { ROUTES } from '../shared/constants/routes';

const SIDEBAR_ITEMS = [
  { path: ROUTES.ADMIN_DASHBOARD, label: 'Dashboard', icon: HiChartBar },
  { path: ROUTES.ADMIN_USERS, label: 'Users', icon: HiUsers },
  { path: ROUTES.ADMIN_COURSES, label: 'Courses', icon: HiBookOpen },
  { path: ROUTES.ADMIN_CATEGORIES, label: 'Categories', icon: HiTag },
  { path: ROUTES.ADMIN_REPORTS, label: 'Reports', icon: HiChartPie },
];

const AdminSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();  // ✅ Changed
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.SIGN_IN);
  };

  return (
    <>
      <aside className={`
        fixed md:sticky top-0 left-0 z-40
        w-64 h-screen bg-gray-900 text-white
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-800">
            <h1 className="text-xl font-bold">LoopLearn</h1>
            <p className="text-xs text-gray-400 mt-1">Admin Portal</p>
            <p className="text-xs text-purple-400 mt-2 truncate">{user?.email || user?.username}</p>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {SIDEBAR_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
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

          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 transition-all duration-200"
            >
              <HiLogout size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {isOpen && (
        <button
          onClick={onClose}
          className="fixed top-4 right-4 z-50 md:hidden p-2 bg-gray-800 text-white rounded-full shadow-lg"
        >
          <HiX size={20} />
        </button>
      )}
    </>
  );
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed bottom-4 right-4 z-30 md:hidden p-3 bg-purple-600 text-white rounded-full shadow-lg"
      >
        <HiMenu size={20} />
      </button>

      <main className="flex-1 min-h-screen overflow-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

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
    </div>
  );
};

export default AdminLayout;