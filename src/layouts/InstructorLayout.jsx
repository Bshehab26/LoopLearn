/**
 * InstructorLayout.jsx
 *
 * Design: "Creator Studio" — warm white/slate light theme with an purple accent.
 * Completely different from AdminLayout which uses dark bg-gray-900 + purple accent.
 *
 * Admin  → dark sidebar, gray-900 bg, purple active, control-room feel
 * Instructor → light sidebar, white bg, purple/orange accent, studio/workshop feel
 *
 * Structure: sticky top header bar + left collapsible sidebar + content area
 *
 * Fixes:
 *  - "My Profile" nav item now routes to ROUTES.PROFILE (shared route used by the
 *    student navbar) so both panels land on the same profile page.
 */

import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineViewGrid, HiOutlineBookOpen, HiOutlineUserGroup,
  HiOutlinePlusCircle, HiOutlineUser, HiOutlineLogout,
  HiOutlineHome, HiMenuAlt2, HiX, HiOutlineBell,
  HiOutlineChevronRight,
} from 'react-icons/hi';
import { useAuth, useProfile } from '../store/AppProvider';
import { ROUTES } from '../shared/constants/routes';

// ============================================================================
// Avatar (same pattern as Navbar.jsx: shows profile.avatar if present, else initials)
// ============================================================================

function useAvatarKey(avatarUrl) {
  const [avatarKey, setAvatarKey] = useState(Date.now());
  React.useEffect(() => { if (avatarUrl) setAvatarKey(Date.now()); }, [avatarUrl]);
  React.useEffect(() => {
    const refresh = () => setAvatarKey(Date.now());
    window.addEventListener('avatar-updated', refresh);
    return () => window.removeEventListener('avatar-updated', refresh);
  }, []);
  return avatarKey;
}

const Avatar = ({ avatarUrl, initials, sizeClass = 'w-8 h-8' }) => {
  const avatarKey = useAvatarKey(avatarUrl);
  if (avatarUrl) {
    return (
      <img
        key={avatarKey}
        src={`${avatarUrl}?t=${avatarKey}`}
        alt={initials}
        className={`${sizeClass} rounded-full object-cover flex-shrink-0`}
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
    );
  }
  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
};

// ============================================================================
// Nav config
// ============================================================================

const NAV_ITEMS = [
  {
    group: 'Overview',
    items: [
      { path: ROUTES.INSTRUCTOR_DASHBOARD, label: 'Dashboard',        icon: HiOutlineViewGrid,   end: true  },
    ],
  },
  {
    group: 'Courses',
    items: [
      { path: ROUTES.INSTRUCTOR_COURSES,   label: 'My Courses',       icon: HiOutlineBookOpen,   end: true  },
      { path: ROUTES.INSTRUCTOR_ADD,       label: 'Add New Course',    icon: HiOutlinePlusCircle, end: true  },
    ],
  },
  {
    group: 'Students',
    items: [
      { path: ROUTES.INSTRUCTOR_STUDENTS,  label: 'Enrolled Students', icon: HiOutlineUserGroup,  end: true  },
    ],
  },
  {
    group: 'Account',
    items: [
      // ✅ FIX: routes to the shared /profile page — same as the student navbar
      { path: ROUTES.PROFILE,              label: 'My Profile',        icon: HiOutlineUser,       end: true  },
    ],
  },
];

// ============================================================================
// Sidebar
// ============================================================================

const Sidebar = ({ isOpen, onClose, username, initials, avatarUrl }) => {
  const navigate = useNavigate();

  const handleLogout  = () => { useAuth().logout(); navigate(ROUTES.SIGN_IN); };
  const handleHome    = () => { navigate(ROUTES.HOME); onClose(); };

  return (
    <>
      {/* Sidebar panel */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-40 h-screen
          w-64 flex flex-col
          bg-white border-r border-slate-100
          shadow-[4px_0_24px_rgba(0,0,0,0.04)]
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* ── Logo ── */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center shadow-sm">
            <span className="text-white font-black text-sm">L</span>
          </div>
          <div>
            <p className="text-sm font-black tracking-widest text-slate-800 uppercase leading-none">
              Loop<span className="text-purple-500">Learn</span>
            </p>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5">
              Creator Studio
            </p>
          </div>
          {/* Mobile close */}
          <button
            onClick={onClose}
            className="ml-auto md:hidden p-1 rounded-lg hover:bg-slate-100 transition text-slate-400"
          >
            <HiX size={18} />
          </button>
        </div>

        {/* ── Avatar strip ── */}
        <div className="px-4 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-purple-50 border border-purple-100">
            <Avatar avatarUrl={avatarUrl} initials={initials} sizeClass="w-8 h-8" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{username}</p>
              <p className="text-[11px] text-purple-600 font-medium">Instructor</p>
            </div>
          </div>
        </div>

        {/* ── Nav groups ── */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {NAV_ITEMS.map((group) => (
            <div key={group.group}>
              <p className="px-3 mb-1.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                {group.group}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                      ${isActive
                        ? 'bg-purple-500 text-white shadow-md shadow-purple-200'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon size={17} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'} />
                        <span className="flex-1">{item.label}</span>
                        {isActive && <HiOutlineChevronRight size={13} className="text-white/70" />}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* ── Footer actions ── */}
        <div className="px-3 py-4 border-t border-slate-100 space-y-1">
          <button
            onClick={handleHome}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all"
          >
            <HiOutlineHome size={17} className="text-slate-400" />
            Back to Home
          </button>
          <LogoutButton />
        </div>
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// Separate so it can call useAuth cleanly
const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate   = useNavigate();
  return (
    <button
      onClick={() => { logout(); navigate(ROUTES.SIGN_IN); }}
      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 hover:text-red-600 transition-all"
    >
      <HiOutlineLogout size={17} />
      Logout
    </button>
  );
};

// ============================================================================
// Top Header Bar
// ============================================================================

const TopBar = ({ onMenuClick, username }) => {
  const location = useLocation();

  // Derive page title from current route
  const pageTitle = (() => {
    const p = location.pathname;
    if (p.includes('/add'))      return 'Add New Course';
    if (p.includes('/edit'))     return 'Edit Course';
    if (p.includes('/courses'))  return 'My Courses';
    if (p.includes('/students')) return 'Enrolled Students';
    if (p.includes('/profile'))  return 'My Profile';
    return 'Dashboard';
  })();
// Ask Abdo about this — we can either derive the title from the route like this, or we can pass it down as a prop from each page component. Deriving it here is more centralized and avoids repetition, but passing it as a prop gives more flexibility (e.g. if we want to include dynamic data in the title later). For now, deriving it here seems fine since our titles are pretty static and closely tied to the route structure.
  // return (
  //   <header className="sticky top-0 z-20 h-14 bg-white/90 backdrop-blur border-b border-slate-100 flex items-center justify-between px-4 md:px-6">
  //     {/* Left: hamburger + title */}
  //     <div className="flex items-center gap-3">
  //       <button
  //         onClick={onMenuClick}
  //         className="md:hidden p-2 -ml-1 rounded-lg hover:bg-slate-100 transition text-slate-500"
  //       >
  //         <HiMenuAlt2 size={20} />
  //       </button>
  //       <div>
  //         <h2 className="text-base font-bold text-slate-800 leading-none">{pageTitle}</h2>
  //         <p className="text-[11px] text-slate-400 mt-0.5 hidden sm:block">
  //           {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
  //         </p>
  //       </div>
  //     </div>

  //     {/* Right: notification + avatar */}
  //     <div className="flex items-center gap-2">
  //       <button className="relative p-2 rounded-lg hover:bg-slate-100 transition text-slate-500">
  //         <HiOutlineBell size={19} />
  //         <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-purple-500 rounded-full" />
  //       </button>
  //       <div className="flex items-center gap-2 pl-2 border-l border-slate-100">
  //         <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
  //           {username.slice(0, 2).toUpperCase()}
  //         </div>
  //         <span className="text-sm font-medium text-slate-700 hidden sm:inline">{username}</span>
  //       </div>
  //     </div>
  //   </header>
  // );
};

// ============================================================================
// Layout
// ============================================================================

const InstructorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { profile } = useProfile();

  const username = user?.username || user?.email?.split('@')[0] || 'Instructor';
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        username={username}
        initials={initials}
        avatarUrl={profile?.avatar}
      />

      {/* Right column: topbar + content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <TopBar onMenuClick={() => setSidebarOpen(true)} username={username} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {/* Subtle grid texture on content bg */}
          <div
            className="min-h-full"
            style={{
              backgroundImage: 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          >
            <div className="bg-transparent">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InstructorLayout;