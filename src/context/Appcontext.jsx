import React, { createContext, useState, useEffect } from 'react';
import { dummyCourses } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import humanizeDuration from 'humanize-duration'; 
export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY || '$';
  const [allCourses, setAllCourses] = useState([]);
  const [isInstructor, setIsInstructor] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const fetchAllCourses = async () => {
    setAllCourses(dummyCourses);
  };

  const calculateRating = (course) => {
    const ratings = course.courseRatings || []; 
    if (ratings.length === 0) return 0;

    let totalRating = 0;
    ratings.forEach(r => (totalRating += r.rating));
    return totalRating / ratings.length;
  };
  // Function to Calculate course chapter Time
  const calculateChapterTime =(chapter)=>{
    let time=0
    chapter.chapterContent.map((lecture)=> time +=lecture.lectureDuration)
    return humanizeDuration(time*60*1000,{units: ["h","m"]})
  }
  //function to Calculate course Duration
  const calculateCourseDuration=(course)=>{
      let time=0
      course.courseContent.map((chapter)=>chapter.chapterContent.map((lecture)=> time +=lecture.lectureDuration))
          return humanizeDuration(time*60*1000,{units: ["h","m"]})

  }

//function to Calculate Total Number of lecture in the course
  const calculateNOfLectures=(course)=>{
   let totalLectures=0;
   course.courseContent.forEach(chapter=>{
    if(Array.isArray(chapter.chapterContent)){
      totalLectures += chapter.chapterContent.length;
    }
   });
   return totalLectures;
  } 
  //fetch user enrolled courses
  const fetchEnrolledCourses = async () => {
   setEnrolledCourses(dummyCourses)
  };

  useEffect(() => {
    fetchAllCourses();
    fetchEnrolledCourses()
  }, []);

  const value = { currency, allCourses, calculateRating,isInstructor, setIsInstructor,navigate,calculateNOfLectures,calculateChapterTime,calculateCourseDuration,enrolledCourses,fetchEnrolledCourses };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};