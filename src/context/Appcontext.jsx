import React, { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY || "$";

  /* =====================
     AUTH STATE
  ====================== */
  const [user, setUser] = useState(null);

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
     LOADING STATES
  ====================== */
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [enrolledLoading, setEnrolledLoading] = useState(true);
  const [instructorLoading, setInstructorLoading] = useState(true);

  /* =====================
     COURSES
  ====================== */
  const [allCourses, setAllCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [instructorCourses, setInstructorCourses] = useState([]);

  const fetchAllCourses = () => {
    setCoursesLoading(true);
    // simulate async — replace with real API call later:
    // const res = await getAllCourses(); setAllCourses(res.data);
    setTimeout(() => {
      setAllCourses(dummyCourses);
      setCoursesLoading(false);
    }, 800);
  };

  const fetchEnrolledCourses = () => {
    setEnrolledLoading(true);
    setTimeout(() => {
      setEnrolledCourses(dummyCourses);
      setEnrolledLoading(false);
    }, 800);
  };

  const fetchInstructorCourses = () => {
    setInstructorLoading(true);
    setTimeout(() => {
      setInstructorCourses(
        dummyCourses.filter((c) => c.instructorId === "instructor-1")
      );
      setInstructorLoading(false);
    }, 800);
  };

  const updateInstructorCourse = (courseId, updatedData) => {
    setInstructorCourses((prev) =>
      prev.map((c) =>
        String(c._id) === String(courseId) ? { ...c, ...updatedData } : c
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
    chapter.chapterContent.forEach((l) => (time += l.lectureDuration));
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  const calculateCourseDuration = (course) => {
    let time = 0;
    course.courseContent.forEach((ch) =>
      ch.chapterContent.forEach((l) => (time += l.lectureDuration))
    );
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  const calculateNOfLectures = (course) => {
    let total = 0;
    course.courseContent.forEach((ch) => (total += ch.chapterContent.length));
    return total;
  };

  /* =====================
     INIT
  ====================== */
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

        /* LOADING */
        coursesLoading,
        enrolledLoading,
        instructorLoading,

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
