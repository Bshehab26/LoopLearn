import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/Appcontext';

const MyEnrollments = () => {
  const { enrolledCourses, calculateCourseDuration, navigate } = useContext(AppContext);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 5;

  // Progress (mock data)
  const [progressArray] = useState([
    { lectureCompleted: 2, totalLectures: 4 },
    { lectureCompleted: 1, totalLectures: 5 },
    { lectureCompleted: 3, totalLectures: 6 },
    { lectureCompleted: 4, totalLectures: 4 },
    { lectureCompleted: 0, totalLectures: 3 },
    { lectureCompleted: 5, totalLectures: 7 },
    { lectureCompleted: 6, totalLectures: 8 },
    { lectureCompleted: 2, totalLectures: 6 },
    { lectureCompleted: 4, totalLectures: 10 },
    { lectureCompleted: 7, totalLectures: 7 },
    { lectureCompleted: 1, totalLectures: 4 },
    { lectureCompleted: 0, totalLectures: 2 },
    { lectureCompleted: 5, totalLectures: 5 }
  ]);

  // Pagination logic
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = enrolledCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  const totalPages = Math.ceil(enrolledCourses.length / coursesPerPage);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  return (
    <div className='md:px-36 px-4 py-10 bg-gray-50 min-h-screen'>

      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-800'>My Enrollments</h1>
        <p className='text-gray-500 mt-2 text-sm'>
          <span
            className='text-purple-600 cursor-pointer hover:underline'
            onClick={() => navigate('/')}
          >
            Home
          </span>
          <span className='mx-2'>/</span>
          My Enrollments
        </p>
      </div>

      {/* Table */}
      <div className='bg-white shadow-md rounded-xl overflow-hidden'>
        <table className='w-full'>

          {/* Head */}
          <thead className='bg-gray-100 text-gray-700 text-sm max-sm:hidden'>
            <tr>
              <th className='px-6 py-4 text-left font-semibold'>Course</th>
              <th className='px-6 py-4 text-left font-semibold'>Duration</th>
              <th className='px-6 py-4 text-left font-semibold'>Progress</th>
              <th className='px-6 py-4 text-left font-semibold'>Status</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {currentCourses.map((course, index) => {
              const globalIndex = indexOfFirstCourse + index;
              const progress = progressArray[globalIndex];

              const completed =
                progress?.lectureCompleted === progress?.totalLectures;

              const progressPercent = progress
                ? (progress.lectureCompleted / progress.totalLectures) * 100
                : 0;

              return (
                <tr
                  key={course._id}
                  className='border-b last:border-none hover:bg-gray-50 transition'
                >

                  {/* Course */}
                  <td className='px-6 py-4 flex items-center gap-4'>
                    <img
                      src={course.courseThumbnail}
                      alt="course"
                      className='w-16 h-12 object-cover rounded-md shadow-sm'
                    />
                    <p className='font-medium text-gray-800 max-sm:text-sm'>
                      {course.courseTitle}
                    </p>
                  </td>

                  {/* Duration */}
                  <td className='px-6 py-4 text-gray-600 max-sm:hidden'>
                    {calculateCourseDuration(course)}
                  </td>

                  {/* Progress */}
                  <td className='px-6 py-4 max-sm:hidden'>
                    <div className='flex flex-col gap-1'>
                      <span className='text-sm text-gray-700'>
                        {progress?.lectureCompleted || 0}/
                        {progress?.totalLectures || 0} Lectures
                      </span>

                      <div className='w-full bg-gray-200 rounded-full h-2'>
                        <div
                          className='bg-purple-500 h-2 rounded-full transition-all'
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className='px-6 py-4 max-sm:text-right'>
                    <button
                      onClick={() => navigate(`/watch/${course._id}`)}
                      className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition 
                      ${
                        completed
                          ? 'bg-green-500 hover:bg-green-600'
                          : 'bg-purple-500 hover:bg-purple-600'
                      }`}
                    >
                      {completed ? 'Completed' : 'Continue'}
                    </button>
                  </td>

                </tr>
              );
            })}
          </tbody>

        </table>
      </div>

      {/* Pagination */}
      <div className='flex justify-center items-center mt-8 gap-2 flex-wrap'>

        {/* Prev */}
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className='px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50'
        >
          Prev
        </button>

        {/* Numbers */}
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 rounded-lg transition ${
              currentPage === i + 1
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {i + 1}
          </button>
        ))}

        {/* Next */}
        <button
          onClick={() =>
            setCurrentPage(prev => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className='px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50'
        >
          Next
        </button>

      </div>

    </div>
  );
};

export default MyEnrollments;