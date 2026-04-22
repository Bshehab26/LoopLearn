import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../../components/instructor/NavBar";
import SideBar from "../../components/instructor/SideBar";
import Footer from "../../components/instructor/Footer";

const Instructor = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex flex-1">
        <SideBar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Instructor;