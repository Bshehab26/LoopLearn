import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const Dashboard = () => {
  const { allCourses, currency } = useContext(AppContext);

  // Temporary stats (later connect to real instructor data)
  const totalCourses = allCourses.length;
  const totalStudents = 128; // mock
  const totalRevenue = 2450; // mock

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-800">
        Instructor Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow">
          <p className="text-gray-500 text-sm">Total Courses</p>
          <h2 className="text-3xl font-bold text-gray-800">
            {totalCourses}
          </h2>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <p className="text-gray-500 text-sm">Total Students</p>
          <h2 className="text-3xl font-bold text-gray-800">
            {totalStudents}
          </h2>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <h2 className="text-3xl font-bold text-gray-800">
            {currency}{totalRevenue}
          </h2>
        </div>
      </div>

      {/* Recent Courses */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Recent Courses
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-500 text-sm">
                <th className="py-3">Course</th>
                <th>Students</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {allCourses.slice(0, 5).map((course,index) => (
                <tr key={index} className="border-b last:border-0">
                  <td className="py-3 font-medium text-gray-800">
                    {course.courseTitle}
                  </td>
                  <td className="text-gray-600">—</td>
                  <td className="text-gray-600">
                    {currency}{course.coursePrice}
                  </td>
                  <td className="text-green-600 font-medium">
                    Published
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;