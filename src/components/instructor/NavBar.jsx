import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserButton } from "@clerk/react";
import { HiMenu } from "react-icons/hi";

const InstructorNavbar = ({ onMenuClick }) => {
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-white border-b px-4 sm:px-6 py-4 flex items-center justify-between">
      
      {/* LEFT */}
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          className="md:hidden text-gray-600"
        >
          <HiMenu size={24} />
        </button>

        <Link to="/" className="text-xl sm:text-2xl font-extrabold text-gray-800">
          LOOP<span className="text-purple-600">LEARN</span>
        </Link>

        <span className="hidden sm:inline-block px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
          Instructor
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="hidden sm:block text-gray-600 hover:text-purple-600 text-sm font-medium"
        >
          Back to Home
        </button>

        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
};

export default InstructorNavbar;