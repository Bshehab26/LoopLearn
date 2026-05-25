/**
 * InstructorLayout.jsx
 * Layout for instructor dashboard with sidebar navigation
 * 
 * @module layouts/InstructorLayout
 */

import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiChartBar, HiBookOpen, HiUserGroup, HiPlusCircle, 
  HiUser, HiChevronLeft, HiLogout, HiMenu
} from 'react-icons/hi';
import { useAuth } from '../store/AppProvider';  // ✅ Changed
import Navbar from '../shared/components/Navbar';
import Footer from '../shared/components/Footer';
import { ROUTES } from '../shared/constants/routes';

const SIDEBAR_ITEMS = [
  { path: ROUTES.INSTRUCTOR_DASHBOARD, label: 'Dashboard', icon: HiChartBar },
  { path: ROUTES.INSTRUCTOR_COURSES, label: 'My Courses', icon: HiBookOpen },
  { path: ROUTES.INSTRUCTOR_ADD, label: 'Add Course', icon: HiPlusCircle },
  { path: ROUTES.INSTRUCTOR_STUDENTS, label: 'Students', icon: HiUserGroup },
  { path: ROUTES.INSTRUCTOR_PROFILE, label: 'Profile', icon: HiUser },
];

const InstructorSidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();  // ✅ Changed
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.SIGN_IN);
  };

  return (
    <>
      <aside className={`
        fixed md:sticky top-0 left-0 z-40
        w-64 h-screen bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-lg font-bold text-gray-800">
              LOOP<span className="text-purple-600">LEARN</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">Instructor Portal</p>
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
                    ? 'bg-purple-50 text-purple-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <item.icon size={18} className={({ isActive }) => isActive ? 'text-purple-600' : 'text-gray-400'} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200 space-y-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
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
          className="fixed top-4 right-4 z-50 md:hidden p-2 bg-white rounded-full shadow-lg"
        >
          <HiChevronLeft size={20} />
        </button>
      )}
    </>
  );
};

const InstructorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex flex-1 relative">
        <InstructorSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />

        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed bottom-4 left-4 z-30 md:hidden p-3 bg-purple-600 text-white rounded-full shadow-lg"
        >
          <HiMenu size={20} />
        </button>

        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-30 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default InstructorLayout;