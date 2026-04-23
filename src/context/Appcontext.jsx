import React, { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const currency = import.meta.env.VITE_CURRENCY || "$";

  /* =====================
     AUTH STATE (SOURCE OF TRUTH)
  ====================== */
  const [user, setUser] = useState(null);

  // Load user from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const loginUser = (data) => {
    const normalized = {
      token: data.token,
      username: data.username,
      email: data.email,
      role: data.role?.toLowerCase(),
    };

    setUser(normalized);
    localStorage.setItem("user", JSON.stringify(normalized));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/signin");
  };

  /* =====================
     ROLE HELPERS
  ====================== */
  const isStudent = user?.role === "student";
  const isInstructor = user?.role === "instructor";
  const isAdmin = user?.role === "admin";

  /* =====================
     NAV SEARCH
  ====================== */
  const [isNavSearchVisible, setIsNavSearchVisible] = useState(true);

  /* =====================
     COURSES
  ====================== */
  const [allCourses, setAllCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [instructorCourses, setInstructorCourses] = useState([]);

  const fetchAllCourses = () => setAllCourses(dummyCourses);
  const fetchEnrolledCourses = () => setEnrolledCourses(dummyCourses);

  const fetchInstructorCourses = () => {
    setInstructorCourses(
      dummyCourses.filter((c) => c.instructorId === "instructor-1")
    );
  };

  const updateInstructorCourse = (courseId, updatedData) => {
    setInstructorCourses((prev) =>
      prev.map((c) =>
        String(c._id) === String(courseId)
          ? { ...c, ...updatedData }
          : c
      )
    );
  };

  /* =====================
     CALCULATIONS
  ====================== */
  const calculateRating = (course) => {
    const ratings = course?.courseRatings || [];
    if (!ratings.length) return 0;
    const total = ratings.reduce((sum, r) => sum + r.rating, 0);
    return Number((total / ratings.length).toFixed(1));
  };

  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.forEach(
      (lecture) => (time += lecture.lectureDuration)
    );
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  const calculateCourseDuration = (course) => {
    let time = 0;
    course.courseContent.forEach((chapter) =>
      chapter.chapterContent.forEach(
        (lecture) => (time += lecture.lectureDuration)
      )
    );
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  const calculateNOfLectures = (course) => {
    let total = 0;
    course.courseContent.forEach(
      (chapter) => (total += chapter.chapterContent.length)
    );
    return total;
  };

  useEffect(() => {
    fetchAllCourses();
    fetchEnrolledCourses();
    fetchInstructorCourses();
  }, []);

  return (
    <AppContext.Provider
      value={{
        currency,
        navigate,

        /* AUTH */
        user,
        loginUser,
        logoutUser,
        isStudent,
        isInstructor,
        isAdmin,

        /* UI */
        isNavSearchVisible,
        setIsNavSearchVisible,

        /* COURSES */
        allCourses,
        enrolledCourses,
        instructorCourses,
        updateInstructorCourse,

        /* CALCULATIONS */
        calculateRating,
        calculateChapterTime,
        calculateCourseDuration,
        calculateNOfLectures,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};