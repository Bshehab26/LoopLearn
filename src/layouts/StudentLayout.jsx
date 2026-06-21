// src/layouts/StudentLayout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from '../shared/components/Navbar';
import Footer from '../shared/components/Footer';
import Chat from '../features/chat/pages/Chat'; // ✅ Correct path - Chat is in pages folder

const StudentLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      
      {/* ✅ Chat Widget - Available on all pages */}
      <Chat />
    </div>
  );
};

export default StudentLayout;