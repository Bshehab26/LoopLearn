import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { useClerk, UserButton, useUser } from '@clerk/react';
import SearchBar from './SearchBar';
import { AppContext } from '../../context/Appcontext';

const Navbar = () => {
  const { isInstructor } = useContext(AppContext);
  const location = useLocation();

  // safer route check
  const isCourseListPage = location.pathname.startsWith("/course-list");

  const { openSignUp } = useClerk();
  const { user } = useUser();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // auto-close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={`sticky w-full top-0 z-50 transition-all ${
        isCourseListPage ? ' bg-white shadow-md' : 'bg-white shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-10 md:px-14 lg:px-3 py-5">

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <h1 className="font-extrabold text-2xl md:text-3xl text-gray-800 tracking-wide">
            LOOP<span className="text-purple-600">LEARN</span>
          </h1>
        </Link>

        {/* Desktop Search */}
        <div className="hidden lg:flex flex-1 mx-8 w-full max-w-2xl">
          <SearchBar />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-gray-600">
          {user && (
            <>
              <Link
  className="hover:text-purple-600 transition duration-300 text-lg"
  to={isInstructor ? "/instructor/instructor" : "/become-instructor"}
>
  {isInstructor ? "Instructor Dashboard" : "Become an Instructor"}
</Link>

              <Link
                className="hover:text-purple-600 transition duration-300 text-lg"
                to="/my-enrollments"
              >
                My Enrollments
              </Link>
            </>
          )}

          {user ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <button
              onClick={openSignUp}
              className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white px-6 py-2 rounded-full text-lg font-medium transition-transform duration-300 transform hover:scale-105"
            >
              Create Account
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <HiX className="w-7 h-7 text-gray-700" />
            ) : (
              <HiMenu className="w-7 h-7 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Overlay) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-[80px] left-0 w-full bg-white shadow-md px-6 py-6 flex flex-col gap-5 z-40">

          {/* Search */}
          <SearchBar onSearchComplete={() => setIsMobileMenuOpen(false)} />

          {user && (
            <>
              <Link
                to={isInstructor ? "/instructor/instructor" : "/become-instructor"}
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-purple-600 text-lg"
              >
                {isInstructor ? "Instructor Dashboard" : "Become an Instructor"}
              </Link>

              <Link
                to="/my-enrollments"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-purple-600 text-lg"
              >
                My Enrollments
              </Link>
            </>
          )}

          {user ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <button
              onClick={openSignUp}
              className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-6 py-2 rounded-full text-lg font-medium"
            >
              Create Account
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;