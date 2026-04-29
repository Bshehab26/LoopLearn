import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import Footer from '../../components/student/Footer';

// ─── Skeleton ────────────────────────────────────────────────────────────────
const Shimmer = ({ style = {} }) => (
  <div style={{ background: "#EEEDFE", borderRadius: 8, overflow: "hidden", position: "relative", ...style }}>
    <div style={{
      position: "absolute", inset: 0,
      background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
      animation: "shimmer 1.5s infinite",
    }} />
  </div>
);

const MyEnrollmentsSkeleton = () => (
  <div className="md:px-36 px-4 py-10 bg-gray-50 min-h-screen">
    <style>{`@keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }`}</style>
    <div style={{ marginBottom: 32, display: "flex", flexDirection: "column", gap: 10 }}>
      <Shimmer style={{ height: 32, width: 220 }} />
      <Shimmer style={{ height: 16, width: 180 }} />
    </div>
    <div style={{ background: "white", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
      <div style={{ background: "#F3F4F6", padding: "16px 24px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 16 }}>
        {["Course", "Duration", "Progress", "Status"].map((h) => (
          <Shimmer key={h} style={{ height: 14, width: "60%" }} />
        ))}
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{
          display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 16, padding: "20px 24px",
          borderBottom: "0.5px solid rgba(0,0,0,0.06)",
          alignItems: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Shimmer style={{ width: 64, height: 48, flexShrink: 0 }} />
            <Shimmer style={{ height: 14, flex: 1 }} />
          </div>
          <Shimmer style={{ height: 14, width: "70%" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Shimmer style={{ height: 12, width: "80%" }} />
            <Shimmer style={{ height: 8, width: "100%", borderRadius: 99 }} />
          </div>
          <Shimmer style={{ height: 36, width: 90, borderRadius: 8 }} />
        </div>
      ))}
    </div>
    <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 32 }}>
      {[...Array(3)].map((_, i) => (
        <Shimmer key={i} style={{ height: 36, width: 44, borderRadius: 8 }} />
      ))}
    </div>
  </div>
);
// ────────────────────────────────────────────────────────────────────────────

const MyEnrollments = () => {
  const { enrolledCourses, enrolledLoading, calculateCourseDuration, navigate } = useContext(AppContext);

  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 5;

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
    { lectureCompleted: 5, totalLectures: 5 },
  ]);

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = enrolledCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(enrolledCourses.length / coursesPerPage);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  if (enrolledLoading) return <MyEnrollmentsSkeleton />;

  return (
    <>
      <div className='md:px-36 px-4 py-10 bg-gray-50 min-h-screen'>

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

        <div className='bg-white shadow-md rounded-xl overflow-hidden'>
          <table className='w-full'>
            <thead className='bg-gray-100 text-gray-700 text-sm max-sm:hidden'>
              <tr>
                <th className='px-6 py-4 text-left font-semibold'>Course</th>
                <th className='px-6 py-4 text-left font-semibold'>Duration</th>
                <th className='px-6 py-4 text-left font-semibold'>Progress</th>
                <th className='px-6 py-4 text-left font-semibold'>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentCourses.map((course, index) => {
                const globalIndex = indexOfFirstCourse + index;
                const progress = progressArray[globalIndex];
                const completed = progress?.lectureCompleted === progress?.totalLectures;
                const progressPercent = progress
                  ? (progress.lectureCompleted / progress.totalLectures) * 100
                  : 0;

                return (
                  <tr key={course._id} className='border-b last:border-none hover:bg-gray-50 transition'>
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
                    <td className='px-6 py-4 text-gray-600 max-sm:hidden'>
                      {calculateCourseDuration(course)}
                    </td>
                    <td className='px-6 py-4 max-sm:hidden'>
                      <div className='flex flex-col gap-1'>
                        <span className='text-sm text-gray-700'>
                          {progress?.lectureCompleted || 0}/{progress?.totalLectures || 0} Lectures
                        </span>
                        <div className='w-full bg-gray-200 rounded-full h-2'>
                          <div
                            className='bg-purple-500 h-2 rounded-full transition-all'
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 max-sm:text-right'>
                      <button
                        onClick={() => navigate(`/watch/${course._id}`)}
                        className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition
                          ${completed ? 'bg-green-500 hover:bg-green-600' : 'bg-purple-500 hover:bg-purple-600'}`}
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

        <div className='flex justify-center items-center mt-8 gap-2 flex-wrap'>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className='px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50'
          >
            Prev
          </button>
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
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className='px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50'
          >
            Next
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyEnrollments;
