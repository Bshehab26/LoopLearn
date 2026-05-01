// src/context/AppContext.jsx

import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { getAllCourses } from "../services/api/course.api";
import { getUserIdFromToken } from "../services/utils/Parsetoken";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY || "$";

  /* =====================
     AUTH STATE
  ====================== */
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);

      // ✅ Check token expiry on app load — log out if expired
      if (parsed?.token) {
        const payload = JSON.parse(atob(parsed.token.split(".")[1]));
        if (payload.exp * 1000 < Date.now()) {
          logoutUser();
          return;
        }
      }

      setUser(parsed);
    } catch {
      // Corrupt storage — clear it
      localStorage.removeItem("user");
    }
  }, []);

  const loginUser = (data) => {
    // ✅ Extract user ID from JWT so instructor can use it when creating courses
    const id = getUserIdFromToken(data.token);

    const normalized = {
      id,                           // ✅ instructor/student ID from JWT claims
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
    localStorage.removeItem("token"); // ✅ clean up any stale standalone token key
    navigate("/signin");
  };

  /* =====================
     ROLE HELPERS
  ====================== */
  const isStudent    = user?.role === "student";
  const isInstructor = user?.role === "instructor";
  const isAdmin      = user?.role === "admin";

  /* =====================
     NAV SEARCH
  ====================== */
  const [isNavSearchVisible, setIsNavSearchVisible] = useState(true);

  /* =====================
     LOADING STATES
  ====================== */
  const [coursesLoading,    setCoursesLoading]    = useState(true);
  const [enrolledLoading,   setEnrolledLoading]   = useState(false);
  const [instructorLoading, setInstructorLoading] = useState(false);

  /* =====================
     COURSES
  ====================== */
  const [allCourses,        setAllCourses]        = useState([]);
  const [enrolledCourses,   setEnrolledCourses]   = useState([]);
  const [instructorCourses, setInstructorCourses] = useState([]);

  const fetchAllCourses = async () => {
    try {
      setCoursesLoading(true);
      const res = await getAllCourses();
      setAllCourses(res.data);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setAllCourses([]);
    } finally {
      setCoursesLoading(false);
    }
  };

  // ⏳ Wire when enrollment API is ready
  const fetchEnrolledCourses = async () => {
    try {
      setEnrolledLoading(true);
      // const res = await getEnrolledCourses();
      // setEnrolledCourses(res.data);
      setEnrolledCourses([]);
    } catch (err) {
      console.error(err);
    } finally {
      setEnrolledLoading(false);
    }
  };

  // ⏳ Wire when instructor courses API is ready
  const fetchInstructorCourses = async () => {
    try {
      setInstructorLoading(true);
      // const res = await getInstructorCourses();
      // setInstructorCourses(res.data);
      setInstructorCourses([]);
    } catch (err) {
      console.error(err);
    } finally {
      setInstructorLoading(false);
    }
  };

  const updateInstructorCourse = (courseId, updatedData) => {
    setInstructorCourses((prev) =>
      prev.map((c) =>
        String(c.id) === String(courseId) ? { ...c, ...updatedData } : c
      )
    );
  };

  /* =====================
     CALCULATIONS
  ====================== */
  const calculateRating = (course) => {
    if (typeof course?.rating === "number") return Number(course.rating.toFixed(1));
    const ratings = course?.courseRatings || [];
    if (!ratings.length) return 0;
    return Number((ratings.reduce((s, r) => s + r.rating, 0) / ratings.length).toFixed(1));
  };

  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent?.forEach((l) => (time += l.lectureDuration));
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  const calculateCourseDuration = (course) => {
    if (course?.duration) return course.duration;
    let time = 0;
    course?.courseContent?.forEach((ch) =>
      ch.chapterContent?.forEach((l) => (time += l.lectureDuration))
    );
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  const calculateNOfLectures = (course) => {
    if (course?.lessons) return course.lessons.length;
    let total = 0;
    course?.courseContent?.forEach((ch) => (total += ch.chapterContent?.length || 0));
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
        navigate,           // kept for logoutUser redirect — components should use their own useNavigate()
        user,
        loginUser,
        logoutUser,
        isStudent,
        isInstructor,
        isAdmin,
        isNavSearchVisible,
        setIsNavSearchVisible,
        coursesLoading,
        enrolledLoading,
        instructorLoading,
        allCourses,
        enrolledCourses,
        instructorCourses,
        updateInstructorCourse,
        fetchAllCourses,
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