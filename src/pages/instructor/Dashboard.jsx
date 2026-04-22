import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const Dashboard = () => {
  const { allCourses, currency } = useContext(AppContext);

  const totalCourses = allCourses.length;
  const totalStudents = 128;
  const totalRevenue = 2450;

  return (
    <div className="space-y-8">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
        Instructor Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Stat title="Total Courses" value={totalCourses} />
        <Stat title="Total Students" value={totalStudents} />
        <Stat title="Total Revenue" value={`${currency}${totalRevenue}`} />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow">
        <div className="p-4 sm:p-6 border-b">
          <h2 className="font-semibold text-gray-800">Recent Courses</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-4 text-left">Course</th>
                <th className="px-6 py-4">Students</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {allCourses.slice(0, 5).map((course, index) => (
                <tr key={index} className="border-t">
                  <td className="px-6 py-4 font-medium">
                    {course.courseTitle}
                  </td>
                  <td className="px-6 py-4 text-center">—</td>
                  <td className="px-6 py-4 text-center">
                    {currency}{course.coursePrice}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                      Published
                    </span>
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

const Stat = ({ title, value }) => (
  <div className="bg-white rounded-xl p-6 shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <h2 className="text-3xl font-bold text-gray-800 mt-1">{value}</h2>
  </div>
);

export default Dashboard;