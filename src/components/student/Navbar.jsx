import { useState, useContext, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import SearchBar from "./SearchBar";
import FilterDropdown from "./FilterDropdown";
import { AppContext } from "../../context/AppContext";

const Navbar = () => {
  const { isInstructor } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 👇 Read auth state from localStorage (set during login)
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role")?.toLowerCase();
  const isLoggedIn = !!token;

  const initials = username
    ? username.slice(0, 2).toUpperCase()
    : "?";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setIsDropdownOpen(false);
    navigate("/signin");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
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

        {/* DESKTOP SEARCH */}
       
       <SearchBar />

        {/* DESKTOP RIGHT */}
        <div className="hidden md:flex items-center gap-3">

          {isLoggedIn ? (
            <>
              {/* Filter button */}
            <FilterDropdown />

              {/* My Enrollments */}
              <Link
                to="/my-enrollments"
                className="text-sm hover:text-purple-600 transition"
                style={{ color: "#5F5E5A" }}
              >
                My Enrollments
              </Link>

              {/* Divider */}
              <div style={{ width: "0.5px", height: "20px", background: "rgba(0,0,0,0.1)" }} />

              {/* Avatar dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full transition"
                  style={{ border: "0.5px solid rgba(0,0,0,0.1)" }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium"
                    style={{ background: "#EEEDFE", color: "#534AB7" }}
                  >
                    {initials}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{username}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {isDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-xl overflow-hidden"
                    style={{
                      background: "white",
                      border: "0.5px solid rgba(0,0,0,0.08)",
                      zIndex: 100,
                      top: "100%"
                    }}
                  >
                    <div className="p-1.5">
                      <button
                        onClick={() => { navigate("/profile"); setIsDropdownOpen(false); }}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-left hover:bg-gray-50 transition"
                        style={{ color: "#444441" }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        Profile
                      </button>

                      <button
                        onClick={() => { navigate("/my-enrollments"); setIsDropdownOpen(false); }}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-left hover:bg-gray-50 transition"
                        style={{ color: "#444441" }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2">
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                        My Enrollments
                      </button>

                      <button
                        onClick={() => {
                          navigate(role === "instructor" ? "/instructor" : "/become-instructor");
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-left hover:bg-gray-50 transition"
                        style={{ color: "#444441" }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="3" />
                          <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                        </svg>
                        {role === "instructor" ? "Instructor Dashboard" : "Become Instructor"}
                      </button>

                      <div style={{ height: "0.5px", background: "rgba(0,0,0,0.06)", margin: "4px 0" }} />

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-left hover:bg-red-50 transition"
                        style={{ color: "#A32D2D" }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/signin")}
                className="px-4 py-2 rounded-full text-sm font-medium transition hover:bg-purple-50"
                style={{ border: "0.5px solid #534AB7", color: "#534AB7" }}
              >
                Sign in
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-4 py-2 rounded-full text-sm font-medium transition hover:bg-purple-700"
                style={{ background: "#534AB7", color: "white" }}
              >
                Sign up
              </button>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen
              ? <HiX className="w-6 h-6 text-gray-700" />
              : <HiMenu className="w-6 h-6 text-gray-700" />
            }
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white px-6 py-5 flex flex-col gap-4"
          style={{ borderTop: "0.5px solid rgba(0,0,0,0.08)" }}>

          <SearchBar onSearchComplete={() => setIsMobileMenuOpen(false)} />

          {isLoggedIn ? (
            <>
              {/* User info */}
              <div className="flex items-center gap-3 pb-3"
                style={{ borderBottom: "0.5px solid rgba(0,0,0,0.08)" }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium"
                  style={{ background: "#EEEDFE", color: "#534AB7" }}>
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{username}</p>
                  <p className="text-xs" style={{ color: "#888780" }}>
                    {role?.charAt(0).toUpperCase() + role?.slice(1)}
                  </p>
                </div>
              </div>

              <Link to="/my-enrollments" className="text-sm text-gray-700 hover:text-purple-600">
                My Enrollments
              </Link>
              <Link
                to={role === "instructor" ? "/instructor" : "/become-instructor"}
                className="text-sm text-gray-700 hover:text-purple-600"
              >
                {role === "instructor" ? "Instructor Dashboard" : "Become Instructor"}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-left font-medium"
                style={{ color: "#A32D2D" }}
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <button
                onClick={() => { navigate("/signin"); setIsMobileMenuOpen(false); }}
                className="w-full py-2 rounded-full text-sm font-medium"
                style={{ border: "0.5px solid #534AB7", color: "#534AB7" }}
              >
                Sign in
              </button>
              <button
                onClick={() => { navigate("/signup"); setIsMobileMenuOpen(false); }}
                className="w-full py-2 rounded-full text-sm font-medium"
                style={{ background: "#534AB7", color: "white" }}
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;