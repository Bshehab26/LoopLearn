import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserButton } from "@clerk/react";

const InstructorNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <Link to="/" className="text-2xl font-extrabold text-gray-800">
          LOOP<span className="text-purple-600">LEARN</span>
        </Link>

        <span className="hidden sm:inline-block px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-700">
          Instructor
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="text-gray-600 hover:text-purple-600 transition text-sm font-medium"
        >
          Back to Home
        </button>

        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
};

export default InstructorNavbar;