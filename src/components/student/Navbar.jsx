import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { useClerk, UserButton, useUser } from "@clerk/react";
import SearchBar from "./SearchBar";
import { AppContext } from "../../context/Appcontext";

const Navbar = () => {
  const { isInstructor } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();

  const isCourseListPage = location.pathname.startsWith("/course-list");

  const { user } = useUser();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={`sticky w-full top-0 z-50 transition-all ${
        isCourseListPage ? "bg-white shadow-md" : "bg-white shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-10 md:px-14 lg:px-3 py-5">

        {/* LOGO */}
        <Link to="/" className="flex items-center">
          <h1 className="font-extrabold text-2xl md:text-3xl text-gray-800 tracking-wide">
            LOOP<span className="text-purple-600">LEARN</span>
          </h1>
        </Link>

        {/* DESKTOP SEARCH */}
        <div className="hidden lg:flex flex-1 mx-8 w-full max-w-2xl">
          <SearchBar />
        </div>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-6 text-gray-600">

          {user && (
            <>
              <Link
                className="hover:text-purple-600 transition duration-300 text-lg"
                to={
                  isInstructor
                    ? "/instructor/instructor"
                    : "/become-instructor"
                }
              >
                {isInstructor
                  ? "Instructor Dashboard"
                  : "Become an Instructor"}
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
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/signin")}
                className="px-5 py-2 border border-purple-600 text-purple-700 rounded-full text-lg font-medium hover:bg-purple-50 transition"
              >
                Sign In
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="px-5 py-2 bg-purple-600 text-white rounded-full text-lg font-medium hover:bg-purple-700 transition"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <HiX className="w-7 h-7 text-gray-700" />
            ) : (
              <HiMenu className="w-7 h-7 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-[80px] left-0 w-full bg-white shadow-md px-6 py-6 flex flex-col gap-5 z-40">

          <SearchBar
            onSearchComplete={() => setIsMobileMenuOpen(false)}
          />

          {user && (
            <>
              <Link
                to={
                  isInstructor
                    ? "/instructor/instructor"
                    : "/become-instructor"
                }
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-purple-600 text-lg"
              >
                {isInstructor
                  ? "Instructor Dashboard"
                  : "Become an Instructor"}
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
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  navigate("/signin");
                  setIsMobileMenuOpen(false);
                }}
                className="border border-purple-600 text-purple-700 px-6 py-2 rounded-full text-lg font-medium"
              >
                Sign In
              </button>

              <button
                onClick={() => {
                  navigate("/signup");
                  setIsMobileMenuOpen(false);
                }}
                className="bg-purple-600 text-white px-6 py-2 rounded-full text-lg font-medium"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;