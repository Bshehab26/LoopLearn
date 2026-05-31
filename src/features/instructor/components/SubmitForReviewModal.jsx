import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiClock } from 'react-icons/hi';

const SubmitForReviewModal = ({ isOpen, onClose, onSubmit, courseTitle, submitting }) => {
  const [acknowledged, setAcknowledged] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <HiClock size={20} className="text-yellow-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Submit for Review</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <HiX size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <p className="text-sm text-gray-600">Course: <span className="font-medium">{courseTitle}</span></p>
          
          <div className="p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-blue-700 font-medium mb-2">📋 Before Submitting</p>
            <ul className="text-xs text-blue-600 space-y-1 list-disc pl-4">
              <li>Complete all course sections and lessons</li>
              <li>Add a compelling course description</li>
              <li>Upload a high-quality course thumbnail</li>
              <li>Set an appropriate price</li>
            </ul>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl">
            <p className="text-sm text-amber-700 font-medium mb-2">⏳ What happens next?</p>
            <p className="text-xs text-amber-600">
              Our admin team will review your course within 2-3 business days.
              You will be notified once the review is complete.
            </p>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
            />
            <span className="text-sm text-gray-600">
              I confirm that my course is complete and ready for review
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 border-t border-gray-100 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!acknowledged || submitting}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 transition disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit for Review'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitForReviewModal;