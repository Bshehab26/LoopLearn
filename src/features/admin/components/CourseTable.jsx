// src/features/admin/components/CourseTable.jsx

import { useState } from 'react';
import { HiDotsVertical, HiTrash, HiEye } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const CourseTable = ({ courses, loading, onDelete, onView }) => {
  const [openMenu, setOpenMenu] = useState(null);

  const getStatusBadge = (status) => {
    const styles = {
      Published: 'bg-green-100 text-green-700',
      Pending: 'bg-yellow-100 text-yellow-700',
      Draft: 'bg-gray-100 text-gray-700',
      Rejected: 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!courses?.length) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-3xl">📚</span>
        </div>
        <p className="text-gray-500">No courses found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Instructor</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Enrolled</th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {courses.map((course, index) => (
            <motion.tr
              key={course.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="hover:bg-gray-50 transition"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-10 bg-gray-100 rounded-md flex items-center justify-center text-xs">
                    📘
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{course.title}</p>
                    <p className="text-xs text-gray-400">ID: {course.id}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{course.instructor}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{course.category}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-800">
                {course.price === 0 ? 'Free' : `$${course.price}`}
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusBadge(course.status)}`}>
                  {course.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{course.enrolled || 0}</td>
              <td className="px-6 py-4 text-right relative">
                <button
                  onClick={() => setOpenMenu(openMenu === course.id ? null : course.id)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <HiDotsVertical size={16} className="text-gray-400" />
                </button>
                
                <AnimatePresence>
                  {openMenu === course.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-6 top-12 z-10 w-36 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden"
                    >
                      <button
                        onClick={() => { onView(course.id); setOpenMenu(null); }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <HiEye size={14} /> View Details
                      </button>
                      <button
                        onClick={() => { onDelete(course.id); setOpenMenu(null); }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100"
                      >
                        <HiTrash size={14} /> Delete
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseTable;