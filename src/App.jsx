import React from "react";
import { Routes, Route, useMatch } from "react-router-dom";
import "./App.css";

import SignIn from "./pages/auth/SignIn";
import SignUP from "./pages/auth/SignUP";

// STUDENT
import Home from "./pages/student/Home";
import CourseList from "./pages/student/CoursesList";
import CourseDetails from "./pages/student/CourseDetails";
import MyEnrollments from "./pages/student/MyEnrollments";
import WatchWindow from "./pages/student/WatchWindow";
import Loading from "./components/student/Loading";
import Navbar from "./components/student/Navbar";

// INSTRUCTOR
import Instructor from "./pages/instructor/Instructor";
import Dashboard from "./pages/instructor/Dashboard";
import AddCourse from "./pages/instructor/AddCourse";
import EditCourse from "./pages/instructor/EditCourse";
import MyCourses from "./pages/instructor/MyCourses";
import StudentEnrolled from "./pages/instructor/StudentEnrolled";

function App() {
  const isInstructorRoute = useMatch("/instructor/*");

  return (
    <div className="App">
      {!isInstructorRoute && <Navbar />}

      <Routes>
        {/* STUDENT ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUP />} />

        <Route path="/course-list" element={<CourseList />} />
        <Route path="/course-list/:input" element={<CourseList />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/watch/:courseId" element={<WatchWindow />} />
        <Route path="/loading/:path" element={<Loading />} />

        {/* INSTRUCTOR ROUTES */}
        <Route path="/instructor" element={<Instructor />}>
          <Route index element={<Dashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="edit-course/:id" element={<EditCourse />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="student-enrolled" element={<StudentEnrolled />} />
        </Route>

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </div>
  );
}

export default App;