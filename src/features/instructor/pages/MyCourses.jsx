/**
 * MyCourses.jsx
 * List of instructor's courses with draft and published status
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiTrash, HiPencil, HiEye, HiDocumentAdd } from 'react-icons/hi';
import { useInstructorCourses } from '../hooks/useInstructorCourses';
import CourseCard from '../components/CourseCard';
import EmptyState from '../components/EmptyState';

const MyCourses = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { courses, loading, deleteCourse, publishCourse, fetchCourses } = useInstructorCourses();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [successMessage, setSuccessMessage] = useState(location.state?.success || null);

  // Filter courses by status
  const drafts = courses.filter(c => c.status === 'draft');
  const published = courses.filter(c => c.status === 'published');

  const handleDelete = async (courseId) => {
    const success = await deleteCourse(courseId);
    if (success) {
      setShowDeleteConfirm(null);
    }
  };

  const handleEdit = (courseId) => {
    navigate(`/instructor/edit-course/${courseId}`);
  };

  const handlePublish = async (courseId) => {
    await publishCourse(courseId);
  };

  const handleCreateNew = () => {
    navigate('/instructor/add-course');
  };

  // Clear success message after 5 seconds
  React.useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
          <p className="text-gray-500 mt-1">Manage your courses and drafts</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition shadow-sm"
        >
          <HiPlus size={18} />
          New Course
        </button>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700"
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drafts Section */}
      {drafts.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-6 bg-amber-500 rounded-full" />
            <h2 className="text-lg font-semibold text-gray-800">Drafts ({drafts.length})</h2>
            <span className="text-xs text-gray-400">Complete these to publish</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {drafts.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                type="draft"
                onEdit={() => handleEdit(course.id)}
                onDelete={() => setShowDeleteConfirm(course.id)}
                onPublish={() => handlePublish(course.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Published Courses Section */}
      {published.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-6 bg-green-500 rounded-full" />
            <h2 className="text-lg font-semibold text-gray-800">Published ({published.length})</h2>
            <span className="text-xs text-gray-400">Live on the platform</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {published.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                type="published"
                onEdit={() => handleEdit(course.id)}
                onDelete={() => setShowDeleteConfirm(course.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {courses.length === 0 && (
        <EmptyState
          icon={<HiDocumentAdd size={48} className="text-purple-300" />}
          title="No courses yet"
          description="Get started by creating your first course"
          buttonText="Create New Course"
          onButtonClick={handleCreateNew}
        />
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                  <HiTrash size={24} className="text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Delete Course?</h3>
                <p className="text-gray-500 mb-6">
                  This action cannot be undone. This course will be permanently deleted.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(showDeleteConfirm)}
                    className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyCourses;