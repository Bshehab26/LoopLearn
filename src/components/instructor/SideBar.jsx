import React from "react";
import { NavLink } from "react-router-dom";
import { HiX } from "react-icons/hi";

const SideBar = ({ isOpen, onClose }) => {
  const linkClass = ({ isActive }) =>
    `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition
    ${
      isActive
        ? "bg-purple-100 text-purple-700"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <>
      {/* Overlay (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:static z-50 w-64 h-full bg-white border-r p-4
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center mb-6">
          <h2 className="font-bold">Instructor</h2>
          <button onClick={onClose}>
            <HiX size={22} />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          <NavLink to="." end className={linkClass}>Dashboard</NavLink>
          <NavLink to="/instructor/my-courses" className={linkClass}>My Courses</NavLink>
          <NavLink to="/instructor/student-enrolled" className={linkClass}>Students</NavLink>
          <NavLink to="/instructor/earnings" className={linkClass}>Earnings</NavLink>
          <NavLink to="/instructor/settings" className={linkClass}>Settings</NavLink>
        </nav>
      </aside>
    </>
  );
};

export default SideBar;