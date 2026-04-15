import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";

const MyCourses = () => {
  const { allCourses, calculateCourseDuration } = useContext(AppContext);

  // later you can filter by instructorId
  const instructorCourses = allCourses;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          My Courses
        </h1>

        <Link
          to="/instructor/add-course"
          className="bg-purple-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
        >
          + Add New Course
        </Link>
      </div>

      {/* Courses List */}
      {instructorCourses.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow text-center">
          <p className="text-gray-500">
            You haven’t created any courses yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructorCourses.map((course, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              {/* Thumbnail */}
              <img
                src={course.courseThumbnail}
                alt={course.courseTitle}
                className="h-40 w-full object-cover"
              />

              {/* Content */}
              <div className="p-4 space-y-2">
                <h2 className="font-semibold text-gray-800 line-clamp-2">
                  {course.courseTitle}
                </h2>

                <p className="text-sm text-gray-500">
                  {calculateCourseDuration(course)}
                </p>

                <div className="flex justify-between items-center pt-3">
                  <span className="text-purple-600 font-semibold">
                    ${course.coursePrice}
                  </span>

                  <Link
                    to={`/instructor/edit-course/${course._id}`}
                    className="text-purple-600 hover:underline"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;