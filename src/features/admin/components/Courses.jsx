// src/features/admin/pages/Courses.jsx - COMPLETE REPLACEMENT (NO PAGINATION)

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiClock, HiCheckCircle, HiXCircle, HiRefresh } from 'react-icons/hi';
import PendingCoursesTable from '../components/PendingCoursesTable';
import useAdminCourses from '../hooks/useAdminCourses';

const Courses = () => {
  const navigate = useNavigate();
  const { courses, loading, approveCourseById, rejectCourseById, fetchCourses } = useAdminCourses();

  const handleViewCourse = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handleApprove = async (courseId) => {
    const result = await approveCourseById(courseId);
    if (result.success) {
      console.log('Course approved:', result.message);
    } else {
      alert(result.message || 'Failed to approve course');
    }
  };

  const handleReject = async (courseId, reason) => {
    const result = await rejectCourseById(courseId, reason);
    if (result.success) {
      console.log('Course rejected:', result.message);
    } else {
      alert(result.message || 'Failed to reject course');
    }
  };

  const pendingCount = courses?.length || 0;

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Course Reviews</h1>
            <p className="text-gray-500 mt-1">Review and manage pending course submissions</p>
          </div>
          <button
            onClick={fetchCourses}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition disabled:opacity-50"
          >
            <HiRefresh className={loading ? 'animate-spin' : ''} size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <HiClock size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Reviews</p>
              <p className="text-2xl font-bold text-gray-800">{pendingCount}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <HiCheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-2xl font-bold text-gray-800">0</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <HiXCircle size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="text-2xl font-bold text-gray-800">0</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Pending Courses Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Courses Awaiting Review</h2>
          {pendingCount > 0 && (
            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
              {pendingCount} pending
            </span>
          )}
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

export default Courses;