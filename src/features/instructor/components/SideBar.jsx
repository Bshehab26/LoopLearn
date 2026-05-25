/**
 * SideBar.jsx
 * Sidebar navigation component for instructor panel.
 * Features collapsible menu, active link highlighting, and mobile support.
 * 
 * @module features/instructor/components/SideBar
 */

import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  HiX, HiOutlineChartBar, HiOutlineBookOpen, HiOutlineUserGroup, 
  HiOutlineCurrencyDollar, HiOutlineCog, HiOutlineAcademicCap,
  HiOutlineChat, HiOutlineDocumentText, HiChevronDown, HiChevronUp
} from 'react-icons/hi';

// ============================================================================
// Constants
// ============================================================================

/** Navigation items configuration */
const NAV_ITEMS = [
  { 
    path: '.', 
    label: 'Dashboard', 
    icon: HiOutlineChartBar, 
    end: true,
    description: 'View your teaching analytics'
  },
  { 
    path: '/instructor/my-courses', 
    label: 'My Courses', 
    icon: HiOutlineBookOpen,
    description: 'Manage your courses'
  },
  { 
    path: '/instructor/add-course', 
    label: 'Add Course', 
    icon: HiOutlineAcademicCap,
    description: 'Create a new course'
  },
  { 
    path: '/instructor/student-enrolled', 
    label: 'Students', 
    icon: HiOutlineUserGroup,
    description: 'View enrolled students'
  },
  { 
    path: '/instructor/earnings', 
    label: 'Earnings', 
    icon: HiOutlineCurrencyDollar,
    description: 'Track your revenue'
  },
  { 
    path: '/instructor/chat', 
    label: 'Messages', 
    icon: HiOutlineChat,
    description: 'Communicate with students'
  },
  { 
    path: '/instructor/settings', 
    label: 'Settings', 
    icon: HiOutlineCog,
    description: 'Account preferences'
  },
];

// ============================================================================
// Subcomponents
// ============================================================================

/**
 * Logo / Header component for sidebar
 */
const SidebarHeader = ({ onClose }) => (
  <div className='flex items-center justify-between mb-6 pb-4 border-b border-gray-100'>
    <div className='flex items-center gap-2'>
      <div className='w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center'>
        <HiOutlineAcademicCap className='w-5 h-5 text-white' />
      </div>
      <div>
        <h2 className='font-bold text-gray-800'>Instructor Portal</h2>
        <p className='text-xs text-gray-400'>Teach & Earn</p>
      </div>
    </div>
    <button 
      onClick={onClose} 
      className='md:hidden p-1 rounded-lg hover:bg-gray-100 transition'
    >
      <HiX size={20} />
    </button>
  </div>
);

/**
 * Profile summary component
 */
const ProfileSummary = () => {
  const location = useLocation();
  
  return (
    <NavLink 
      to='/instructor/profile' 
      className='flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 mb-6 hover:from-purple-100 hover:to-indigo-100 transition-all duration-200'
    >
      <div className='w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-semibold'>
        IN
      </div>
      <div className='flex-1'>
        <p className='text-sm font-semibold text-gray-800'>Instructor Name</p>
        <p className='text-xs text-gray-500'>View Profile →</p>
      </div>
    </NavLink>
  );
};

/**
 * Single navigation item component
 */
const NavItem = ({ item, isActive }) => (
  <NavLink
    to={item.path}
    end={item.end}
    className={({ isActive: active }) => `
      group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
      ${active 
        ? 'bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 shadow-sm' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-purple-600'
      }
    `}
    title={item.description}
  >
    <div className='flex items-center gap-3'>
      <item.icon className={`w-5 h-5 ${isActive ? 'text-purple-600' : 'text-gray-400 group-hover:text-purple-500'}`} />
      <span>{item.label}</span>
    </div>
    {isActive && (
      <div className='w-1 h-6 rounded-full bg-purple-600' />
    )}
  </NavLink>
);

/**
 * Footer stats component
 */
const SidebarFooter = () => (
  <div className='mt-auto pt-4 border-t border-gray-100'>
    <div className='p-3 rounded-xl bg-gray-50'>
      <p className='text-xs text-gray-500 text-center'>
        Total Courses
      </p>
      <p className='text-xl font-bold text-center text-purple-600'>0</p>
    </div>
  </div>
);

// ============================================================================
// Main Component
// ============================================================================

/**
 * SideBar - Sidebar navigation for instructor panel
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether sidebar is open on mobile
 * @param {Function} props.onClose - Close handler for mobile
 * @returns {React.ReactElement} Sidebar component
 */
const SideBar = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden animate-fadeIn'
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50 w-72 h-screen bg-white border-r border-gray-100
          flex flex-col transition-transform duration-300 ease-in-out shadow-lg
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <div className='flex-1 overflow-y-auto p-5'>
          {/* Header */}
          <SidebarHeader onClose={onClose} />
          
          {/* Profile Summary */}
          <ProfileSummary />
          
          {/* Navigation */}
          <nav className='flex flex-col gap-1'>
            {NAV_ITEMS.map((item) => (
              <NavItem 
                key={item.path} 
                item={item} 
                isActive={location.pathname === item.path}
              />
            ))}
          </nav>
        </div>
        
        {/* Footer Stats */}
        <SidebarFooter />
      </aside>
    </>
  );
};

export default SideBar;