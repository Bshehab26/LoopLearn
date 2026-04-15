import React, { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY || "$";

  /* =====================
     USER ROLE
  ====================== */
  const [userRole, setUserRole] = useState("instructor");

  const isStudent = userRole === "student";
  const isInstructor = userRole === "instructor";
  const isAdmin = userRole === "admin";

  /* =====================
     COURSE STATE
  ====================== */
  const [allCourses, setAllCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [instructorCourses, setInstructorCourses] = useState([]);

  /* =====================
     FETCH
  ====================== */
  const fetchAllCourses = () => {
    setAllCourses(dummyCourses);
  };

  const fetchEnrolledCourses = () => {
    setEnrolledCourses(dummyCourses);
  };

  const fetchInstructorCourses = () => {
    setInstructorCourses(
      dummyCourses.filter(
        (course) => course.instructorId === "instructor-1"
      )
    );
  };

  /* =====================
     UPDATE COURSE (EDIT)
  ====================== */
const updateInstructorCourse = (courseId, updatedData) => {
  setInstructorCourses((prev) =>
    prev.map((course) =>
      String(course._id) === String(courseId)
        ? { ...course, ...updatedData }
        : course
    )
  );
};

  /* =====================
     CALCULATIONS
  ====================== */
  const calculateRating = (course) => {
    const ratings = Array.isArray(course?.courseRatings)
      ? course.courseRatings
      : [];

    if (!ratings.length) return 0;

    const total = ratings.reduce(
      (sum, r) => sum + Number(r.rating || 0),
      0
    );

    return Number((total / ratings.length).toFixed(1));
  };

  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.forEach(
      (lecture) => (time += lecture.lectureDuration)
    );

    return humanizeDuration(time * 60 * 1000, {
      units: ["h", "m"],
    });
  };

  const calculateCourseDuration = (course) => {
    let time = 0;

    course.courseContent.forEach((chapter) =>
      chapter.chapterContent.forEach(
        (lecture) => (time += lecture.lectureDuration)
      )
    );

    return humanizeDuration(time * 60 * 1000, {
      units: ["h", "m"],
    });
  };

  const calculateNOfLectures = (course) => {
    let total = 0;
    course.courseContent.forEach(
      (chapter) => (total += chapter.chapterContent.length)
    );
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

        // role
        userRole,
        setUserRole,
        isStudent,
        isInstructor,
        isAdmin,

        // courses
        allCourses,
        enrolledCourses,
        instructorCourses,

        // actions
        updateInstructorCourse,

        // utils
        calculateRating,
        calculateNOfLectures,
        calculateChapterTime,
        calculateCourseDuration,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};