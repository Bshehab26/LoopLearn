// src/features/instructor/components/SubmitForReviewModal.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiClock, HiCheckCircle, HiExclamationCircle, HiShieldCheck, HiMail, HiArrowRight } from 'react-icons/hi';

const SubmitForReviewModal = ({ isOpen, onClose, onSubmit, courseTitle, submitting }) => {
  const [acknowledged, setAcknowledged] = useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-yellow-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shadow-inner">
                  <HiClock size={20} className="text-amber-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Submit for Review</h2>
                  <p className="text-xs text-gray-500">Confirm course submission</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/50 transition"
              >
                <HiX size={18} className="text-gray-500" />
              </button>
            </div>

            {/* Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Course info */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Submitting</p>
                <p className="font-semibold text-gray-800 text-sm mt-1">{courseTitle || 'Untitled Course'}</p>
              </div>
              
              {/* Pre-submission Checklist */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <HiShieldCheck size={16} className="text-green-600" />
                  Pre-submission Checklist
                </p>
                <div className="space-y-2">
                  {[
                    'Course has at least one section with lessons',
                    'All lessons have titles and video content',
                    'Course thumbnail uploaded',
                    'Learning outcomes defined (3-5 items)',
                    'Course description is complete'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm">
                      <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What happens next */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <HiMail size={16} />
                  What happens next?
                </p>
                <div className="space-y-2">
                  {[
                    'Admin team will review your course within 2-3 business days',
                    'You\'ll receive email notification once reviewed',
                    'If approved, course becomes instantly available to students',
                    'If rejected, you\'ll get specific feedback to improve'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-blue-700">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Acknowledgment */}
              <label className="flex items-start gap-3 cursor-pointer p-3 bg-amber-50 rounded-xl border border-amber-100 hover:bg-amber-100 transition">
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(e) => setAcknowledged(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
                />
                <span className="text-xs text-amber-800 leading-relaxed">
                  I confirm that my course is complete, follows community guidelines, 
                  and is ready for admin review
                </span>
              </label>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-5 border-t border-gray-100 bg-gray-50">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                disabled={!acknowledged || submitting}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit for Review
                    <HiArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SubmitForReviewModal;