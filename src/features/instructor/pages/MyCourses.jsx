// src/features/instructor/pages/MyCourses.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiPlus, HiTrash, HiPencil, HiEye, HiDocumentAdd, 
  HiPaperAirplane, HiExclamationCircle, HiViewGrid, HiViewList
} from 'react-icons/hi';
import { useInstructorCourses } from '../hooks/useInstructorCourses';
import { submitForReview } from '../api/instructor.api';
import CourseCard from '../components/CourseCard';
import EmptyState from '../components/EmptyState';
import SubmitForReviewModal from '../components/SubmitForReviewModal';
import CourseValidationErrorsModal from '../components/CourseValidationErrorsModal';

// Status configuration
const STATUS_CONFIG = {
  all: { label: 'All Courses', color: 'gray', bgColor: 'bg-gray-100', textColor: 'text-gray-700' },
  draft: { label: 'Draft', color: 'amber', bgColor: 'bg-amber-100', textColor: 'text-amber-700' },
  pending: { label: 'Pending Review', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' },
  published: { label: 'Published', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-700' },
  rejected: { label: 'Rejected', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-700' },
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

  // FIX: Store the full course being submitted separately so courseId and
  // courseTitle remain available even after showSubmitModal is cleared to null.
  const [submittingCourse, setSubmittingCourse] = useState(null);

  const [successMessage, setSuccessMessage] = useState(location.state?.success || null);
  const [viewMode, setViewMode] = useState('grid');

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

 // src/features/instructor/pages/MyCourses.jsx - Updated handleSubmitForReview

const handleSubmitForReview = async (courseId, courseTitle) => {
  // Persist the course info before any async work
  setSubmittingCourse({ id: courseId, title: courseTitle });
  setSubmittingCourseId(courseId);

  const response = await submitForReview(courseId);
  
  console.log('[MyCourses SubmitForReview] Full response:', response);
  console.log('[MyCourses] response.success:', response.success);
  console.log('[MyCourses] response.errors:', response.errors);
  console.log('[MyCourses] response.message:', response.message);
  console.log('[MyCourses] response.data:', response.data);
  
  if (response.success) {
    // Success — refresh courses and show success message
    await fetchCourses();
    setShowSubmitModal(null);
    setSubmittingCourse(null);
    setSuccessMessage(response.message || 'Course submitted for review successfully!');
    setTimeout(() => setSuccessMessage(null), 5000);
  } else {
    // Close the submit modal
    setShowSubmitModal(null);
    
    // Try multiple possible error locations
    let hasErrors = false;
    let errorList = [];
    let errorMessage = response.message || 'Please fix the following issues before submitting:';
    
    // Check various places where errors might be
    if (response.errors && Array.isArray(response.errors) && response.errors.length > 0) {
      hasErrors = true;
      errorList = response.errors;
    } 
    else if (response.data?.errors && Array.isArray(response.data.errors) && response.data.errors.length > 0) {
      hasErrors = true;
      errorList = response.data.errors;
      errorMessage = response.data.message || errorMessage;
    }
    else if (response.validationErrors && Array.isArray(response.validationErrors) && response.validationErrors.length > 0) {
      hasErrors = true;
      errorList = response.validationErrors;
    }
    else if (typeof response.message === 'string' && response.message.length > 10 && 
             (response.message.includes('section') || 
              response.message.includes('lesson') || 
              response.message.includes('thumbnail') ||
              response.message.includes('description'))) {
      // If message contains error-like text but no array, create array from message
      hasErrors = true;
      errorList = [response.message];
    }
    
    if (hasErrors && errorList.length > 0) {
      console.log('[MyCourses] Showing validation errors modal with:', errorList);
      setValidationErrors(errorList);
      setValidationMessage(errorMessage);
      setShowValidationErrors(true);
      // Keep submittingCourse for the modal
    } else {
      console.log('[MyCourses] No structured errors found, raw response:', response);
      
      // Last resort - try to show something helpful
      if (response.message && response.message.length > 10) {
        // Use the modal anyway with the message as the only error
        setValidationErrors([response.message]);
        setValidationMessage('Course validation failed:');
        setShowValidationErrors(true);
      } else {
        // Fallback to browser alert
        alert(response.message || 'Failed to submit for review. Please check your course content and try again.');
        setSubmittingCourse(null);
      }
    }
  }

  setSubmittingCourseId(null);
};

  // Called when the validation errors modal is closed — safe to clear now.
  const handleValidationModalClose = () => {
    setShowValidationErrors(false);
    setSubmittingCourse(null);
    setValidationErrors([]);
    setValidationMessage('');
  };

  const handleCreateNew = () => {
    navigate('/instructor/courses/add');
  };

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // The course currently shown in the submit-confirmation modal.
  // Only valid while showSubmitModal !== null.
  const selectedCourseForSubmit = showSubmitModal 
    ? courses.find(c => c.id === showSubmitModal) 
    : null;

  // Status filter tabs
  const StatusTabs = () => (
    <div className="flex flex-wrap gap-2 mb-6">
      {Object.entries(STATUS_CONFIG).map(([key, config]) => (
        <button
          key={key}
          onClick={() => setActiveFilter(key)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            activeFilter === key
              ? `${config.bgColor} ${config.textColor} shadow-sm`
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {config.label}
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            activeFilter === key ? 'bg-white/50' : 'bg-gray-200'
          }`}>
            {statusCounts[key]}
          </span>
        </button>
      ))}
    </div>
  );

  // View toggle buttons
  const ViewToggle = () => (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => setViewMode('grid')}
        className={`p-2 rounded-md transition ${
          viewMode === 'grid' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500'
        }`}
        title="Grid view"
      >
        <HiViewGrid size={18} />
      </button>
      <button
        onClick={() => setViewMode('list')}
        className={`p-2 rounded-md transition ${
          viewMode === 'list' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500'
        }`}
        title="List view"
      >
        <HiViewList size={18} />
      </button>
    </div>
  );

  // List view component
  const CourseListItem = ({ course, onEdit, onDelete, onSubmit, onView, isSubmitting }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-4">
        {/* Thumbnail */}
        <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
          {course.thumbnailUrl ? (
            <img 
              src={course.thumbnailUrl} 
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <HiDocumentAdd size={24} />
            </div>
          )}
        </div>
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-800 truncate">{course.title}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              STATUS_CONFIG[course.status]?.bgColor || 'bg-gray-100'
            } ${STATUS_CONFIG[course.status]?.textColor || 'text-gray-600'}`}>
              {STATUS_CONFIG[course.status]?.label || course.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 truncate">{course.subtitle || 'No subtitle'}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
            <span>📊 {course.enrollmentCount || 0} students</span>
            <span>⭐ {course.averageRating || 0}/5</span>
            <span>💰 {course.isFree ? 'Free' : `$${course.price}`}</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView()}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition"
            title="View Course"
          >
            <HiEye size={18} />
          </button>
          <button
            onClick={() => onEdit()}
            className="p-2 rounded-lg hover:bg-gray-100 text-blue-600 transition"
            title="Edit Course"
          >
            <HiPencil size={18} />
          </button>
          {course.status === 'draft' && (
            <button
              onClick={() => onSubmit()}
              disabled={isSubmitting}
              className="p-2 rounded-lg hover:bg-gray-100 text-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              title="Submit for Review"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <HiPaperAirplane size={18} />
              )}
            </button>
          )}
          <button
            onClick={() => onDelete()}
            className="p-2 rounded-lg hover:bg-gray-100 text-red-600 transition"
            title="Delete Course"
          >
            <HiTrash size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>
          <p className="text-gray-500 mt-1">Manage and track your courses across all stages</p>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle />
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition shadow-sm"
          >
            <HiPlus size={18} />
            New Course
          </button>
        </div>
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

      {/* Status Filter Tabs */}
      <StatusTabs />

      {/* Courses Display */}
      {courses.length === 0 ? (
        <EmptyState
          icon={<HiDocumentAdd size={48} className="text-purple-300" />}
          title={`No ${activeFilter === 'all' ? '' : STATUS_CONFIG[activeFilter]?.label + ' '}courses yet`}
          description="Get started by creating your first course"
          buttonText="Create New Course"
          onButtonClick={handleCreateNew}
        />
      ) : (
        <>
          {/* Results count */}
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Showing {courses.length} {courses.length === 1 ? 'course' : 'courses'}
            </p>
          </div>

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
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
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="space-y-3">
              {courses.map((course) => (
                <CourseListItem
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
          )}
        </>
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

      {/* Submit for Review Confirmation Modal */}
      <SubmitForReviewModal
        isOpen={showSubmitModal !== null}
        onClose={() => setShowSubmitModal(null)}
        onSubmit={() => handleSubmitForReview(showSubmitModal, selectedCourseForSubmit?.title)}
        courseTitle={selectedCourseForSubmit?.title || ''}
        submitting={submittingCourseId !== null}
      />

      {/* Validation Errors Modal
          FIX: Uses submittingCourse (persisted state) instead of showSubmitModal
          so courseId and courseTitle are never null when this modal opens. */}
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