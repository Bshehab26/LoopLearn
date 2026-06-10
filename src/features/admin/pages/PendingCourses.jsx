// src/features/admin/pages/PendingCourses.jsx

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiClock, HiCheckCircle, HiXCircle, HiRefresh } from 'react-icons/hi';
import PendingCoursesTable from '../components/PendingCoursesTable';
import useAdminCourses from '../hooks/useAdminCourses';

const PendingCourses = () => {
  const navigate = useNavigate();
  const { courses, loading, approveCourseById, rejectCourseById, fetchCourses } = useAdminCourses();

  const handleViewCourse = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handleApprove = async (courseId) => {
    const result = await approveCourseById(courseId);
    if (!result.success) {
      alert(result.message || 'Failed to approve course');
    }
  };

  const handleReject = async (courseId, reason) => {
    const result = await rejectCourseById(courseId, reason);
    if (!result.success) {
      alert(result.message || 'Failed to reject course');
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pending Reviews</h1>
          <p className="text-gray-500 mt-1">Review and approve course submissions</p>
        </div>
        <button
          onClick={fetchCourses}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          <HiRefresh className={loading ? 'animate-spin' : ''} size={16} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <motion.div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <HiClock size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Reviews</p>
              <p className="text-2xl font-bold text-gray-800">{courses.length}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <HiCheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Approved This Month</p>
              <p className="text-2xl font-bold text-gray-800">0</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <HiXCircle size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Rejected This Month</p>
              <p className="text-2xl font-bold text-gray-800">0</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Courses Awaiting Review</h2>
        </div>
        <PendingCoursesTable
          courses={courses}
          loading={loading}
          onApprove={handleApprove}
          onReject={handleReject}
          onView={handleViewCourse}
        />
      </div>
    </div>
  );
};

export default PendingCourses;