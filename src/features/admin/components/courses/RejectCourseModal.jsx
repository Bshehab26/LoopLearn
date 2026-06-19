// src/features/admin/components/courses/RejectCourseModal.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Modal from '../common/Modal';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const RejectCourseModal = ({ open, onClose, course, onSubmit, loading, error }) => {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!open) setReason('');
  }, [open]);

  if (!course) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim() || reason.trim().length < 10) {
      return;
    }
    const ok = await onSubmit(course.id, reason.trim());
    if (ok) {
      setReason('');
      onClose();
    }
  };

  const isValid = reason.trim().length >= 10;

  return (
    <Modal open={open} onClose={onClose} title={`Reject: ${course.title}`}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <HiOutlineExclamationCircle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">Before you reject</p>
            <p className="text-xs text-amber-700">
              The instructor will receive your feedback and can resubmit after fixing the issues.
              Please be specific and constructive.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
            Rejection Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            placeholder="Please provide clear, actionable feedback to help the instructor improve..."
            className={`w-full px-3 py-2.5 text-sm border rounded-xl resize-none transition
              focus:outline-none focus:ring-2 focus:ring-[#534AB7]/20 focus:border-[#534AB7]
              ${error ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
            required
          />
          <div className="flex justify-between mt-1.5">
            <p className="text-xs text-gray-400">Minimum 10 characters</p>
            <p className={`text-xs font-medium ${isValid ? 'text-green-600' : 'text-gray-400'}`}>
              {reason.length}/10
            </p>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 flex items-center gap-2"
          >
            <HiOutlineExclamationCircle size={14} />
            {error}
          </motion.div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-medium rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !isValid}
            className="px-5 py-2.5 text-xs font-semibold rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
            style={{ background: 'linear-gradient(135deg, #DC2626, #B91C1C)' }}
          >
            {loading ? 'Rejecting…' : 'Reject Course'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RejectCourseModal;