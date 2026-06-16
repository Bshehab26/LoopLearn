// src/features/student/pages/MyEnrollments.jsx
//
// CHANGED: replaced fake setTimeout data with real API via useEnrollments hook.
// Data now comes from GET /api/enrollment/courses → EnrolledCourseDTO[].
// EnrolledCourseDTO: { courseId, title, subtitle, thumbnailUrl, instructorName,
//                      progressPercentage, isCourseAvailable, isCompleted,
//                      enrolledAt, lastAccessAt, completedAt }

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useEnrollments from '../hooks/useEnrollments';

// ── Skeleton ────────────────────────────────────────────────────────────────
const Shimmer = ({ style = {} }) => (
  <div
    style={{
      background: '#EEEDFE',
      borderRadius: 8,
      overflow: 'hidden',
      position: 'relative',
      ...style,
    }}
  >
    <div
      style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
        animation: 'shimmer 1.5s infinite',
      }}
    />
  </div>
);

const Skeleton = () => (
  <div className="md:px-36 px-4 py-10 bg-gray-50 min-h-screen">
    <style>{`@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>
    <div className="mb-8 flex flex-col gap-2.5">
      <Shimmer style={{ height: 32, width: 220 }} />
      <Shimmer style={{ height: 16, width: 180 }} />
    </div>
    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
      <div className="bg-gray-50 px-6 py-4 grid grid-cols-4 gap-4">
        {['Course', 'Instructor', 'Progress', 'Status'].map((h) => (
          <Shimmer key={h} style={{ height: 14, width: '60%' }} />
        ))}
      </div>
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-4 gap-4 px-6 py-4 border-b border-gray-50 items-center"
        >
          <div className="flex items-center gap-3">
            <Shimmer style={{ width: 64, height: 48, flexShrink: 0 }} />
            <div className="flex-1 flex flex-col gap-1.5">
              <Shimmer style={{ height: 13, width: '90%' }} />
              <Shimmer style={{ height: 11, width: '60%' }} />
            </div>
          </div>
          <Shimmer style={{ height: 13, width: '70%' }} />
          <div className="flex flex-col gap-1.5">
            <Shimmer style={{ height: 11, width: '50%' }} />
            <Shimmer style={{ height: 7, width: '100%', borderRadius: 99 }} />
          </div>
          <Shimmer style={{ height: 34, width: 90, borderRadius: 8 }} />
        </div>
      ))}
    </div>
  </div>
);

// ── Progress bar ────────────────────────────────────────────────────────────
const ProgressBar = ({ pct }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs text-gray-500">{Math.round(pct)}% complete</span>
    <div className="w-full bg-gray-100 rounded-full h-1.5">
      <div
        className="h-1.5 rounded-full transition-all"
        style={{
          width: `${pct}%`,
          background: pct >= 100 ? '#10B981' : '#7C3AED',
        }}
      />
    </div>
  </div>
);

// ── Main ────────────────────────────────────────────────────────────────────
const MyEnrollments = () => {
  const navigate = useNavigate();
  const {
    currentCourses,
    currentPage,
    totalPages,
    loading,
    goToPage,
    isEmpty,
  } = useEnrollments();

  if (loading) return <Skeleton />;

  return (
    <div className="md:px-36 px-4 py-10 bg-gray-50 min-h-screen">
      <style>{`@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Enrollments</h1>
        <p className="text-gray-500 mt-2 text-sm flex items-center gap-1.5">
          <Link to="/" className="text-purple-600 hover:underline">Home</Link>
          <span>/</span>
          My Enrollments
        </p>
      </div>

      {/* Empty state */}
      {isEmpty && (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-5xl mb-4">📚</p>
          <p className="text-xl font-semibold text-gray-700 mb-2">No courses yet</p>
          <p className="text-gray-400 text-sm mb-6">
            Enroll in a course to start learning.
          </p>
          <button
            onClick={() => navigate('/courses')}
            className="px-6 py-2.5 bg-purple-600 text-white rounded-full text-sm font-medium hover:bg-purple-700 transition"
          >
            Browse Courses
          </button>
        </div>
      )}

      {/* Table */}
      {!isEmpty && (
        <>
          <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
            <table className="w-full">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-6 py-3.5 text-left font-medium">Course</th>
                  <th className="px-6 py-3.5 text-left font-medium max-sm:hidden">Instructor</th>
                  <th className="px-6 py-3.5 text-left font-medium max-sm:hidden">Progress</th>
                  <th className="px-6 py-3.5 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {currentCourses.map((course) => {
                  const pct = course.progressPercentage ?? 0;
                  const done = course.isCompleted || pct >= 100;

                  return (
                    <tr
                      key={course.courseId}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      {/* Course */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {course.thumbnailUrl ? (
                            <img
                              src={course.thumbnailUrl}
                              alt={course.title}
                              className="w-16 h-12 object-cover rounded-md shadow-sm flex-shrink-0"
                            />
                          ) : (
                            <div className="w-16 h-12 rounded-md bg-purple-50 flex items-center justify-center text-xl flex-shrink-0">
                              📚
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-gray-800 text-sm leading-tight truncate max-w-[180px]">
                              {course.title}
                            </p>
                            {course.subtitle && (
                              <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[180px]">
                                {course.subtitle}
                              </p>
                            )}
                            {!course.isCourseAvailable && (
                              <span className="inline-block text-[10px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded-full mt-1">
                                Course unavailable
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Instructor */}
                      <td className="px-6 py-4 max-sm:hidden">
                        <span className="text-sm text-gray-600">{course.instructorName || '—'}</span>
                      </td>

                      {/* Progress */}
                      <td className="px-6 py-4 max-sm:hidden min-w-[140px]">
                        <ProgressBar pct={pct} />
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => navigate(`/watch/${course.courseId}`)}
                          disabled={!course.isCourseAvailable}
                          className={`px-4 py-2 rounded-lg text-white text-xs font-medium transition
                            disabled:opacity-40 disabled:cursor-not-allowed ${
                            done
                              ? 'bg-green-500 hover:bg-green-600'
                              : 'bg-purple-500 hover:bg-purple-600'
                          }`}
                        >
                          {done ? '✓ Completed' : pct > 0 ? 'Continue' : 'Start'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 gap-2 flex-wrap">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-40 text-sm"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  className={`px-4 py-2 rounded-lg text-sm transition ${
                    currentPage === i + 1
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-40 text-sm"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyEnrollments;