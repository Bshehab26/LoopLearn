import React from "react";
import { Routes, Route, useMatch } from "react-router-dom";
import "./App.css";
import Home from "./pages/student/Home";
import CourseList from "./pages/student/CoursesList";
import CourseDetails from "./pages/student/CourseDetails";
import MyEnrollments from "./pages/student/MyEnrollments";
import WatchWindow from "./pages/student/WatchWindow";
import Loading from "./components/student/Loading";
import Instructor from "./pages/instructor/Instructor";
import Dashboard from "./pages/instructor/Dashboard";
import AddCourse from "./pages/instructor/AddCourse";
import MyCourses from "./pages/instructor/MyCourses";
import StudentEnrolled from "./pages/instructor/StudentEnrolled";
import Navbar from "./components/student/Navbar";
function App() {
  const isInstructorRoute=useMatch("/instructor/*");
  return (
    <div className="App">
      {!isInstructorRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course-list" element={<CourseList />} />
        <Route path="/course-list/:input" element={<CourseList />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/watch/:courseId" element={<WatchWindow />} />
        <Route path="/loading/:path" element={<Loading />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
        <Route path="/instructor" element={<Instructor />}>
          <Route path="instructor" element={<Dashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="student-enrolled" element={<StudentEnrolled />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;