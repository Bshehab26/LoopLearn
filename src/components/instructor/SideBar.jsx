import React from "react";
import { NavLink } from "react-router-dom";

const SideBar = () => {
  const linkClass = ({ isActive }) =>
    `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition
     ${
       isActive
         ? "bg-purple-100 text-purple-700"
         : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
     }`;

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 p-4">
      <h2 className="text-lg font-bold text-gray-800 mb-6">
        Instructor Panel
      </h2>

      <nav className="flex flex-col gap-2">
        <NavLink to="." className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/instructor/my-courses" className={linkClass}>
          My Courses
        </NavLink>

        <NavLink to="/instructor/student-enrolled" className={linkClass}>
          Students
        </NavLink>

        <NavLink to="/instructor/earnings" className={linkClass}>
          Earnings
        </NavLink>

        <NavLink to="/instructor/settings" className={linkClass}>
          Settings
        </NavLink>
      </nav>
    </aside>
  );
};

export default SideBar;