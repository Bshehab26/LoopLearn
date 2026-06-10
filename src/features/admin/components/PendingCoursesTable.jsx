// src/features/admin/components/PendingCoursesTable.jsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCheck, HiX, HiEye, HiClock, HiUser, HiTag, HiCurrencyDollar } from 'react-icons/hi';

const PendingCoursesTable = ({ courses, loading, onApprove, onReject, onView }) => {
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleReject = (courseId) => {
    if (rejectReason.trim() && rejectReason.length >= 10) {
      onReject(courseId, rejectReason);
      setShowRejectModal(null);
      setRejectReason('');
    } else {
      alert('Please provide a rejection reason (minimum 10 characters)');
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
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <HiCheck size={32} className="text-green-600" />
        </div>
        <p className="text-gray-500 font-medium">No pending courses</p>
        <p className="text-sm text-gray-400 mt-1">All courses have been reviewed</p>
      </div>
    );
  }

  return (
    <>
      <div className="divide-y divide-gray-100">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-5 hover:bg-gray-50 transition"
          >
            <div className="flex flex-col lg:flex-row gap-5">
              {/* Thumbnail */}
              <div className="lg:w-48 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {course.thumbnailUrl ? (
                  <img 
                    src={course.thumbnailUrl} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                    <HiEye size={32} />
                  </div>
                )}
              </div>

              {/* Course Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-lg mb-2">{course.title}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{course.subtitle || 'No subtitle'}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <HiUser size={14} className="text-purple-500" />
                    <span className="truncate">{course.instructorName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <HiTag size={14} className="text-purple-500" />
                    <span>{course.category}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <HiCurrencyDollar size={14} className="text-purple-500" />
                    <span>{course.isFree ? 'Free' : `$${course.price}`}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <HiClock size={14} className="text-purple-500" />
                    <span>Submitted: {course.submittedForReviewAt ? new Date(course.submittedForReviewAt).toLocaleDateString() : 'Unknown'}</span>
                  </div>
                </div>
                
                {course.instructorEmail && (
                  <p className="text-xs text-gray-400 mt-2">
                    📧 {course.instructorEmail}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-row lg:flex-col gap-2 justify-end">
                <button
                  onClick={() => onView(course.id)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition flex items-center gap-2"
                >
                  <HiEye size={16} /> View Details
                </button>
                <button
                  onClick={() => onApprove(course.id)}
                  className="px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition flex items-center gap-2"
                >
                  <HiCheck size={16} /> Approve
                </button>
                <button
                  onClick={() => setShowRejectModal(course.id)}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-2"
                >
                  <HiX size={16} /> Reject
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowRejectModal(null);
              setRejectReason('');
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Reject Course</h3>
              <p className="text-sm text-gray-500 mb-4">Please provide a reason for rejection (minimum 10 characters)</p>
              
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
                autoFocus
              />
              
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    setShowRejectModal(null);
                    setRejectReason('');
                  }}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(showRejectModal)}
                  disabled={rejectReason.length < 10}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reject Course
                </button>
              </div>
              
              {rejectReason.length > 0 && rejectReason.length < 10 && (
                <p className="text-xs text-red-500 mt-2">
                  Please enter at least {10 - rejectReason.length} more characters
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PendingCoursesTable;