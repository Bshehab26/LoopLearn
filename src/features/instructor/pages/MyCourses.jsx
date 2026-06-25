// src/features/instructor/pages/MyCourses.jsx - Updated with better UI

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiPlus, HiTrash, HiPencil, HiEye, HiDocumentAdd, 
  HiPaperAirplane, HiExclamationCircle, HiViewGrid, HiViewList,
  HiOutlineFilter, HiOutlineSearch
} from 'react-icons/hi';
import { useInstructorCourses } from '../hooks/useInstructorCourses';
import { submitForReview } from '../api/instructor.api';
import CourseCard from '../components/CourseCard';
import EmptyState from '../components/EmptyState';
import SubmitForReviewModal from '../components/SubmitForReviewModal';
import CourseValidationErrorsModal from '../components/CourseValidationErrorsModal';

const STATUS_CONFIG = {
  all: { label: 'All Courses', color: 'gray', countColor: 'bg-gray-100 text-gray-600' },
  draft: { label: 'Draft', color: 'amber', countColor: 'bg-amber-100 text-amber-700' },
  pending: { label: 'Pending', color: 'yellow', countColor: 'bg-yellow-100 text-yellow-700' },
  published: { label: 'Published', color: 'green', countColor: 'bg-green-100 text-green-700' },
  rejected: { label: 'Rejected', color: 'red', countColor: 'bg-red-100 text-red-700' },
};

const MyCourses = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    courses, 
    loading, 
    deleteCourse, 
    fetchCourses,
    activeFilter,
    setActiveFilter,
    statusCounts
  } = useInstructorCourses();
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(null);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [validationMessage, setValidationMessage] = useState('');
  const [submittingCourseId, setSubmittingCourseId] = useState(null);
  const [submittingCourse, setSubmittingCourse] = useState(null);
  const [successMessage, setSuccessMessage] = useState(location.state?.success || null);
  const [errorMessage, setErrorMessage] = useState(location.state?.error || null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter courses by search
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (courseId) => {
    const success = await deleteCourse(courseId);
    if (success) {
      setShowDeleteConfirm(null);
      setSuccessMessage('Course deleted successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleEdit = (courseId) => {
    navigate(`/instructor/courses/edit/${courseId}`);
  };

  const handleView = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handleSubmitForReview = async (courseId, courseTitle) => {
    setSubmittingCourse({ id: courseId, title: courseTitle });
    setSubmittingCourseId(courseId);

    const response = await submitForReview(courseId);
    
    if (response.success) {
      await fetchCourses();
      setShowSubmitModal(null);
      setSubmittingCourse(null);
      setSuccessMessage(response.message || 'Course submitted for review successfully!');
      setTimeout(() => setSuccessMessage(null), 5000);
    } else {
      setShowSubmitModal(null);

      if (response.errors && response.errors.length > 0) {
        setValidationErrors(response.errors);
        setValidationMessage(response.message || 'Please fix the following issues before submitting:');
        setShowValidationErrors(true);
      } else if (response.message && response.message.length > 10) {
        setValidationErrors([response.message]);
        setValidationMessage('Course validation failed:');
        setShowValidationErrors(true);
      } else {
        alert(response.message || 'Failed to submit for review. Please try again.');
        setSubmittingCourse(null);
      }
    }
    setSubmittingCourseId(null);
  };

  const handleValidationModalClose = () => {
    setShowValidationErrors(false);
    setSubmittingCourse(null);
    setValidationErrors([]);
    setValidationMessage('');
  };

  const handleCreateNew = () => {
    navigate('/instructor/courses/add');
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const selectedCourseForSubmit = showSubmitModal 
    ? courses.find(c => c.id === showSubmitModal) 
    : null;

  if (loading && courses.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track your courses</p>
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
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm"
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message (e.g. blocked direct edit-URL access) */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2"
          >
            <HiExclamationCircle size={16} className="flex-shrink-0" />
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and View Toggle Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition"
          />
        </div>
        <div className="flex gap-2 bg-gray-100 rounded-lg p-1 self-start">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition ${viewMode === 'grid' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500'}`}
            title="Grid view"
          >
            <HiViewGrid size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition ${viewMode === 'list' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500'}`}
            title="List view"
          >
            <HiViewList size={18} />
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-3">
        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeFilter === key
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {config.label}
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              activeFilter === key ? 'bg-white/20 text-white' : config.countColor
            }`}>
              {statusCounts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* Courses Display */}
      {filteredCourses.length === 0 ? (
        <EmptyState
          icon={<HiDocumentAdd size={48} className="text-purple-300" />}
          title={`No ${activeFilter === 'all' ? '' : STATUS_CONFIG[activeFilter]?.label + ' '}courses found`}
          description={searchTerm ? "Try a different search term" : "Get started by creating your first course"}
          buttonText="Create New Course"
          onButtonClick={handleCreateNew}
        />
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-500">
            Showing {filteredCourses.length} of {courses.length} courses
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onEdit={() => handleEdit(course.id)}
                  onDelete={() => setShowDeleteConfirm(course.id)}
                  onSubmit={() => setShowSubmitModal(course.id)}
                  onView={() => handleView(course.id)}
                  isSubmitting={submittingCourseId === course.id}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCourses.map((course) => {
                // Mirror the same permission rules used in CourseCard.jsx
                const canEdit = course.status === 'draft' || course.status === 'rejected';
                const canSubmit = course.status === 'draft' || course.status === 'rejected';
                const canDelete = course.status !== 'pending';
                const canView = course.status === 'published';
                const isPending = course.status === 'pending';

                return (
                  <div key={course.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                      {/* Thumbnail */}
                      <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {course.thumbnailUrl ? (
                          <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                            No img
                          </div>
                        )}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-800 truncate">{course.title}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CONFIG[course.status]?.countColor || 'bg-gray-100'}`}>
                            {STATUS_CONFIG[course.status]?.label || course.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{course.subtitle || 'No subtitle'}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                          <span>{course.enrollmentCount || 0} students</span>
                          <span>⭐ {course.averageRating || 0}</span>
                          <span>{course.isFree ? 'Free' : `$${course.price}`}</span>
                        </div>
                        {isPending && (
                          <p className="text-xs text-yellow-600 mt-1">⏳ This course is under review by the admin team</p>
                        )}
                        {course.status === 'rejected' && (
                          <p className="text-xs text-red-600 mt-1">❌ Rejected - Edit and resubmit for review</p>
                        )}
                      </div>
                      {/* Actions - hidden entirely for pending courses, same as CourseCard */}
                      {!isPending && (
                        <div className="flex items-center gap-1">
                          {canView && (
                            <button onClick={() => handleView(course.id)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600" title="View">
                              <HiEye size={16} />
                            </button>
                          )}
                          {canEdit && (
                            <button onClick={() => handleEdit(course.id)} className="p-2 rounded-lg hover:bg-gray-100 text-blue-600" title="Edit">
                              <HiPencil size={16} />
                            </button>
                          )}
                          {canSubmit && (
                            <button onClick={() => setShowSubmitModal(course.id)} className="p-2 rounded-lg hover:bg-gray-100 text-green-600" title="Submit">
                              <HiPaperAirplane size={16} />
                            </button>
                          )}
                          {canDelete && (
                            <button onClick={() => setShowDeleteConfirm(course.id)} className="p-2 rounded-lg hover:bg-gray-100 text-red-500" title="Delete">
                              <HiTrash size={16} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDeleteConfirm(null)}>
            <div className="bg-white rounded-2xl p-6 max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                  <HiTrash size={24} className="text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Delete Course?</h3>
                <p className="text-gray-500 mb-6">This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button>
                  <button onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700">Delete</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Submit Modal */}
      <SubmitForReviewModal
        isOpen={showSubmitModal !== null}
        onClose={() => setShowSubmitModal(null)}
        onSubmit={() => handleSubmitForReview(showSubmitModal, selectedCourseForSubmit?.title)}
        courseTitle={selectedCourseForSubmit?.title || ''}
        submitting={submittingCourseId !== null}
      />

      {/* Validation Modal */}
      <CourseValidationErrorsModal
        isOpen={showValidationErrors}
        onClose={handleValidationModalClose}
        errors={validationErrors}
        message={validationMessage}
        courseTitle={submittingCourse?.title || ''}
        courseId={submittingCourse?.id || null}
      />
    </div>
  );
};

export default MyCourses;