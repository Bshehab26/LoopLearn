// src/features/admin/components/CourseTable.jsx
import { useState } from 'react';
import { HiDotsVertical, HiCheck, HiX, HiTrash, HiEye } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const CourseTable = ({ courses, loading, onApprove, onReject, onDelete, onView }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Published':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Published</span>;
      case 'Pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">Pending</span>;
      case 'Draft':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">Draft</span>;
      case 'Rejected':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">Rejected</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100">{status}</span>;
    }
  };

  const handleReject = (courseId) => {
    if (rejectReason.trim()) {
      onReject(courseId, rejectReason);
      setShowRejectModal(null);
      setRejectReason('');
      setOpenMenu(null);
    }
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
    <>
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
                <td className="px-6 py-4">{getStatusBadge(course.status)}</td>
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
                        className="absolute right-6 top-12 z-10 w-44 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden"
                      >
                        <button
                          onClick={() => { onView(course.id); setOpenMenu(null); }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <HiEye size={14} /> View Details
                        </button>
                        
                        {course.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => { onApprove(course.id); setOpenMenu(null); }}
                              className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                            >
                              <HiCheck size={14} /> Approve
                            </button>
                            <button
                              onClick={() => { setShowRejectModal(course.id); setOpenMenu(null); }}
                              className="w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-orange-50 flex items-center gap-2"
                            >
                              <HiX size={14} /> Reject
                            </button>
                          </>
                        )}
                        
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

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            onClick={() => setShowRejectModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Reject Course</h3>
              <p className="text-sm text-gray-500 mb-4">Please provide a reason for rejection</p>
              
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
              />
              
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowRejectModal(null)}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(showRejectModal)}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
                >
                  Reject Course
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CourseTable;