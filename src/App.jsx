import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

import SignIn from "./pages/auth/SignIn";
import SignUP from "./pages/auth/SignUP";

import Home from "./pages/student/Home";
import CourseList from "./pages/student/CoursesList";
import CourseDetails from "./pages/student/CourseDetails";
import MyEnrollments from "./pages/student/MyEnrollments";
import WatchWindow from "./pages/student/WatchWindow";
import Profile from "./pages/student/Profile";        // ✅ NEW
import Loading from "./components/student/Loading";

import Navbar from "./components/student/Navbar";

import ChatButton from "./components/chat/ChatButton";
import ChatWindow from "./components/chat/ChatWindow";

import Instructor from "./pages/instructor/Instructor";
import Dashboard from "./pages/instructor/Dashboard";
import AddCourse from "./pages/instructor/AddCourse";
import EditCourse from "./pages/instructor/EditCourse";
import MyCourses from "./pages/instructor/MyCourses";
import StudentEnrolled from "./pages/instructor/StudentEnrolled";

function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const location = useLocation();

  const isAuthRoute =
    location.pathname === "/signin" ||
    location.pathname === "/signup";

  const isInstructorRoute = location.pathname.startsWith("/instructor");

  return (
    <div className="App">

      {!isInstructorRoute && !isAuthRoute && <Navbar />}

      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUP />} />

        <Route path="/" element={<Home />} />
        <Route path="/course-list" element={<CourseList />} />
        <Route path="/course-list/:input" element={<CourseList />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/watch/:courseId" element={<WatchWindow />} />
        <Route path="/loading/:path" element={<Loading />} />
        <Route path="/profile" element={<Profile />} />  {/* ✅ NEW */}

        <Route path="/instructor" element={<Instructor />}>
          <Route index element={<Dashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="edit-course/:id" element={<EditCourse />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="student-enrolled" element={<StudentEnrolled />} />
        </Route>

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>

      {!isInstructorRoute && !isAuthRoute && (
        <>
          {chatOpen && <ChatWindow onClose={() => setChatOpen(false)} />}
          <ChatButton onClick={() => setChatOpen(true)} />
        </>
      )}

    </div>
  );
}

export default App;
