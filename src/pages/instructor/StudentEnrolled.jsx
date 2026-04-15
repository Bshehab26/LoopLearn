import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const StudentEnrolled = () => {
  const { allCourses } = useContext(AppContext);

  // Later: filter by instructorId
  const instructorCourses = allCourses;

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800">
        Enrolled Students
      </h1>

      {instructorCourses.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow text-center">
          <p className="text-gray-500">
            No courses found.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {instructorCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow p-6 space-y-4"
            >
              {/* Course Info */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  {course.courseTitle}
                </h2>

                <span className="text-sm text-gray-500">
                  {course.enrolledStudents?.length || 0} students
                </span>
              </div>

              {/* Students Table */}
              {course.enrolledStudents?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b text-left text-gray-500 text-sm">
                        <th className="py-2">Student</th>
                        <th className="py-2">Email</th>
                        <th className="py-2">Progress</th>
                      </tr>
                    </thead>

                    <tbody>
                      {course.enrolledStudents.map((student, index) => (
                        <tr
                          key={index}
                          className="border-b last:border-none text-sm"
                        >
                          <td className="py-2 font-medium text-gray-800">
                            {student.name}
                          </td>
                          <td className="py-2 text-gray-500">
                            {student.email}
                          </td>
                          <td className="py-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-purple-600 h-2 rounded-full"
                                style={{
                                  width: `${student.progress || 0}%`,
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No students enrolled yet.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentEnrolled;