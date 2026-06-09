// src/features/instructor/components/CourseValidationErrorsModal.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiX, HiExclamationCircle, HiBookOpen, HiVideoCamera, 
  HiCurrencyDollar, HiPhotograph, HiExternalLink,
  HiChevronRight, HiAcademicCap, HiPresentationChartLine,
  HiEmojiSad, HiCheckCircle, HiXCircle, HiClock
} from 'react-icons/hi';

const CourseValidationErrorsModal = ({ isOpen, onClose, errors, message, courseTitle, courseId }) => {
  const navigate = useNavigate();
  const [expandedCategory, setExpandedCategory] = useState(null);

  if (!isOpen) return null;

  // ✅ IMPORTANT: Use the ACTUAL errors from backend, not hardcoded list
  let actualErrors = Array.isArray(errors) ? errors : [];
  
  // If no errors array but message exists, use message as error
  if (actualErrors.length === 0 && message && message !== 'Course not ready for review') {
    actualErrors = [message];
  }
  
  // Also check if errors might be in a different format
  if (actualErrors.length === 0 && message && message.includes('section')) {
    actualErrors = [message];
  }

  console.log('[ValidationModal] Actual errors from backend:', actualErrors);

  // Parse each backend error into user-friendly format
  const parseError = (errorText) => {
    const text = errorText.toLowerCase();
    
    // Map backend error messages to user-friendly text
    if (text.includes('thumbnail') || text.includes('image')) {
      return {
        original: errorText,
        friendly: 'Course thumbnail is required',
        detail: 'Upload a thumbnail image for your course',
        section: 'landing',
        priority: 'high'
      };
    }
    if (text.includes('section') && text.includes('empty')) {
      return {
        original: errorText,
        friendly: 'Course needs at least one section',
        detail: 'Add a section with lessons to your course',
        section: 'structure',
        priority: 'high'
      };
    }
    if (text.includes('lesson') && (text.includes('empty') || text.includes('no lessons'))) {
      return {
        original: errorText,
        friendly: 'Sections must have lessons',
        detail: 'Each section needs at least one lesson with video content',
        section: 'structure',
        priority: 'high'
      };
    }
    if (text.includes('lesson title') || (text.includes('lesson') && text.includes('title'))) {
      return {
        original: errorText,
        friendly: 'Lesson title is missing',
        detail: 'Every lesson needs a descriptive title',
        section: 'structure',
        priority: 'high'
      };
    }
    if (text.includes('video') || (text.includes('lesson') && text.includes('content'))) {
      return {
        original: errorText,
        friendly: 'Lesson video is missing',
        detail: 'Upload a video for each lesson in your course',
        section: 'structure',
        priority: 'high'
      };
    }
    if (text.includes('description')) {
      return {
        original: errorText,
        friendly: 'Course description is required',
        detail: 'Write a detailed description of what students will learn',
        section: 'landing',
        priority: 'medium'
      };
    }
    if (text.includes('learning outcome') || text.includes('objective')) {
      return {
        original: errorText,
        friendly: 'Learning outcomes are missing',
        detail: 'Add 3-5 learning outcomes that students will achieve',
        section: 'plan',
        priority: 'medium'
      };
    }
    if (text.includes('price')) {
      return {
        original: errorText,
        friendly: 'Course price is not set',
        detail: 'Set a price for your course or mark it as free',
        section: 'pricing',
        priority: 'medium'
      };
    }
    if (text.includes('subtitle')) {
      return {
        original: errorText,
        friendly: 'Course subtitle is missing',
        detail: 'Add a compelling subtitle that describes your course',
        section: 'landing',
        priority: 'low'
      };
    }
    if (text.includes('tag')) {
      return {
        original: errorText,
        friendly: 'Tags are recommended',
        detail: 'Add relevant tags to help students find your course',
        section: 'landing',
        priority: 'low'
      };
    }
    
    // Default - show original error
    return {
      original: errorText,
      friendly: errorText,
      detail: 'Please check your course content',
      section: 'general',
      priority: 'medium'
    };
  };

  // Parse all actual errors
  const parsedErrors = actualErrors.map(err => parseError(err));
  
  // Group errors by section
  const groupedErrors = {
    plan: { title: '📋 Plan Your Course', errors: [], color: 'purple' },
    landing: { title: '🎨 Course Landing Page', errors: [], color: 'blue' },
    structure: { title: '📚 Course Structure', errors: [], color: 'green' },
    pricing: { title: '💰 Pricing', errors: [], color: 'yellow' },
    general: { title: '⚠️ General Issues', errors: [], color: 'gray' }
  };
  
  parsedErrors.forEach(error => {
    if (groupedErrors[error.section]) {
      groupedErrors[error.section].errors.push(error);
    } else {
      groupedErrors.general.errors.push(error);
    }
  });

  // Only show sections that have errors
  const sectionsWithErrors = Object.entries(groupedErrors).filter(([_, data]) => data.errors.length > 0);
  const totalIssues = parsedErrors.length;
  const highPriorityCount = parsedErrors.filter(e => e.priority === 'high').length;

  const handleNavigateToEdit = () => {
    onClose();
    navigate(`/instructor/courses/edit/${courseId}`);
  };

  // If no specific errors, show helpful message
  if (totalIssues === 0) {
    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-5">
                <div className="flex items-center gap-3">
                  <HiExclamationCircle size={24} className="text-white" />
                  <h2 className="text-xl font-bold text-white">Unable to Validate</h2>
                </div>
              </div>
              <div className="p-6 text-center">
                <p className="text-gray-600 mb-4">Could not retrieve specific validation errors from the server.</p>
                <button
                  onClick={handleNavigateToEdit}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition"
                >
                  Go to Course Editor
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-orange-500 px-6 py-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <HiEmojiSad size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Course Cannot Be Submitted</h2>
                    <p className="text-white/80 text-sm mt-0.5">
                      Fix the following {totalIssues} issue{totalIssues !== 1 ? 's' : ''} to continue
                    </p>
                  </div>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20 transition text-white">
                  <HiX size={20} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
              {/* Error Summary */}
              <div className="bg-red-50 rounded-xl p-4 border border-red-200 mb-6">
                <p className="text-red-800 font-medium flex items-center gap-2">
                  <HiExclamationCircle size={18} className="text-red-600" />
                  {message || 'Please fix the issues below before submitting for review'}
                </p>
              </div>

              {/* Errors by section - SHOW ACTUAL BACKEND ERRORS */}
              <div className="space-y-4">
                {sectionsWithErrors.map(([sectionKey, section]) => (
                  <motion.div
                    key={sectionKey}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
                  >
                    {/* Section header */}
                    <button
                      onClick={() => setExpandedCategory(expandedCategory === sectionKey ? null : sectionKey)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{section.title.split(' ')[0]}</span>
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-800">{section.title}</h3>
                          <p className="text-xs text-gray-400">
                            {section.errors.length} {section.errors.length === 1 ? 'issue' : 'issues'}
                          </p>
                        </div>
                      </div>
                      <HiChevronRight className={`text-gray-400 transition-transform ${expandedCategory === sectionKey ? 'rotate-90' : ''}`} size={18} />
                    </button>

                    {/* Expanded errors - SHOW ACTUAL ERRORS */}
                    {expandedCategory === sectionKey && (
                      <div className="border-t border-gray-100 bg-gray-50/50 p-4 space-y-3">
                        {section.errors.map((error, idx) => (
                          <div
                            key={idx}
                            className={`flex items-start gap-3 p-3 rounded-lg ${
                              error.priority === 'high' 
                                ? 'bg-red-50 border border-red-200' 
                                : error.priority === 'medium'
                                ? 'bg-orange-50 border border-orange-200'
                                : 'bg-blue-50 border border-blue-200'
                            }`}
                          >
                            <div className="mt-0.5">
                              {error.priority === 'high' ? (
                                <HiXCircle className="text-red-500" size={18} />
                              ) : (
                                <HiExclamationCircle className="text-orange-500" size={18} />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${
                                error.priority === 'high' ? 'text-red-800' : 'text-gray-800'
                              }`}>
                                {error.friendly}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {error.detail}
                              </p>
                              {/* Show original backend error for debugging */}
                              {error.original !== error.friendly && (
                                <p className="text-xs text-gray-400 mt-1 font-mono">
                                  {error.original}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Help Tip */}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <HiClock size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-800 mb-1">Need help?</h4>
                    <p className="text-xs text-blue-700">
                      Fix the issues above, save your changes, then try submitting again.
                      Each issue must be resolved before the course can be reviewed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-5 bg-white border-t border-gray-200">
              <button
                onClick={onClose}
                className="flex-1 px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
              >
                Close
              </button>
              <button
                onClick={handleNavigateToEdit}
                className="flex-1 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 transition flex items-center justify-center gap-2 shadow-md"
              >
                Fix Issues
                <HiExternalLink size={16} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CourseValidationErrorsModal;