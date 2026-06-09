// src/features/instructor/components/RequestEditModal.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiX, HiFlag, HiExclamationCircle, HiCheckCircle } from 'react-icons/hi';

const RequestEditModal = ({ isOpen, onClose, onSubmit, courseTitle, submitting }) => {
  const [reason, setReason] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!reason.trim()) {
      alert('Please provide a reason for requesting edit access');
      return;
    }
    onSubmit(reason);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <HiFlag size={20} className="text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Request Edit Access</h2>
              <p className="text-xs text-gray-500">Request permission to edit published course</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition"
          >
            <HiX size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Course: <span className="font-medium text-gray-800">{courseTitle}</span>
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-700 font-medium mb-2 flex items-center gap-2">
              <HiExclamationCircle size={16} />
              Why do you need to edit a published course?
            </p>
            <ul className="text-xs text-blue-600 space-y-1.5 list-disc pl-4">
              <li>Fix typos or errors in content</li>
              <li>Update outdated information</li>
              <li>Add new lessons or resources</li>
              <li>Improve course description or thumbnail</li>
            </ul>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for edit request <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="Please explain what changes you need to make and why..."
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              This will be reviewed by our admin team
            </p>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <p className="text-sm text-amber-700 font-medium mb-2 flex items-center gap-2">
              <HiClock size={16} />
              What happens next?
            </p>
            <ul className="text-xs text-amber-600 space-y-1.5 list-disc pl-4">
              <li>Admin will review your request within 2-3 business days</li>
              <li>If approved, you'll be notified and can edit the course</li>
              <li>If rejected, you'll receive feedback</li>
              <li>Course remains published during review</li>
            </ul>
          </div>

          <label className="flex items-start gap-3 cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
            />
            <span className="text-sm text-gray-700">
              I understand that this is a request only, and admin approval is required before I can edit this published course
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!acknowledged || !reason.trim() || submitting}
            className="flex-1 px-4 py-2 rounded-xl text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              'Send Request'
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RequestEditModal;