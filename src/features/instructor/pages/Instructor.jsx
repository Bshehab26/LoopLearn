/**
 * Instructor.jsx - Minimalist version
 */

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/Footer';

const Instructor = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <NavBar onMenuClick={() => setSidebarOpen(true)} />

      <div className='flex flex-1 relative'>
        {/* Sidebar */}
        <SideBar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className='fixed inset-0 bg-black/30 z-40 md:hidden'
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className='flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto'>
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Instructor;