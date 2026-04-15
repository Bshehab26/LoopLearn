import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../../components/instructor/NavBar";
import SideBar from "../../components/instructor/SideBar";
import Footer from "../../components/instructor/Footer";

const Instructor = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Navbar */}
      <NavBar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <SideBar />

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Instructor;