import { useState, useContext, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import SearchBar from "./SearchBar";
import FilterDropdown from "./FilterDropdown";
import { AppContext } from "../../context/AppContext";

const Navbar = () => {
  const { user, logoutUser, isInstructor } = useContext(AppContext);

  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  /* =====================
     AUTH (REACTIVE FIX)
  ====================== */
  const isLoggedIn = !!user?.token;
  const username = user?.username;
  const role = user?.role?.toLowerCase();

  const initials = username
    ? username.slice(0, 2).toUpperCase()
    : "?";

  const handleLogout = () => {
    logoutUser();
    setIsDropdownOpen(false);
  };

  /* =====================
     OUTSIDE CLICK
  ====================== */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="sticky w-full top-0 z-50 bg-white"
      style={{ borderBottom: "0.5px solid rgba(0,0,0,0.08)" }}>

      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-10"
        style={{ height: "64px" }}>

        {/* LOGO */}
        <Link to="/" className="flex-shrink-0">
          <h1 className="text-xl font-semibold tracking-wider text-gray-800">
            LOOP<span className="text-purple-600">LEARN</span>
          </h1>
        </Link>

        {/* SEARCH */}
        <SearchBar />

        {/* RIGHT SIDE */}
        <div className="hidden md:flex items-center gap-3">

          {isLoggedIn ? (
            <>
              <FilterDropdown />

              <Link
                to="/my-enrollments"
                className="text-sm hover:text-purple-600 transition"
                style={{ color: "#5F5E5A" }}
              >
                My Enrollments
              </Link>

              <div style={{ width: "0.5px", height: "20px", background: "rgba(0,0,0,0.1)" }} />

              {/* AVATAR */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{ border: "0.5px solid rgba(0,0,0,0.1)" }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium"
                    style={{ background: "#EEEDFE", color: "#534AB7" }}
                  >
                    {initials}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {username}
                  </span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl overflow-hidden bg-white border">

                    <button
                      onClick={() => navigate("/profile")}
                      className="block w-full px-3 py-2 text-left hover:bg-gray-50"
                    >
                      Profile
                    </button>

                    <button
                      onClick={() => navigate("/my-enrollments")}
                      className="block w-full px-3 py-2 text-left hover:bg-gray-50"
                    >
                      My Enrollments
                    </button>

                    <button
                      onClick={() => {
                        navigate(role === "instructor"
                          ? "/instructor"
                          : "/become-instructor"
                        );
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full px-3 py-2 text-left hover:bg-gray-50"
                    >
                      {role === "instructor"
                        ? "Instructor Dashboard"
                        : "Become Instructor"}
                    </button>

                    <div className="border-t" />

                    <button
                      onClick={handleLogout}
                      className="block w-full px-3 py-2 text-left text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>

                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/signin")}
                className="px-4 py-2 rounded-full text-sm"
                style={{ border: "0.5px solid #534AB7", color: "#534AB7" }}
              >
                Sign in
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="px-4 py-2 rounded-full text-sm"
                style={{ background: "#534AB7", color: "white" }}
              >
                Sign up
              </button>
            </>
          )}

        </div>

        {/* MOBILE */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;