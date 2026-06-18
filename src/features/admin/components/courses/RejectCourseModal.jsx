// src/features/admin/components/courses/RejectCourseModal.jsx

import React, { useState } from 'react';
import Modal from '../common/Modal';

const RejectCourseModal = ({ open, onClose, course, onSubmit, loading, error }) => {
  const [reason, setReason] = useState('');

  if (!course) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    const ok = await onSubmit(course.id, reason.trim());
    if (ok) {
      setReason('');
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`Reject Course: ${course.title}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-600">
          This will reject the course and notify the instructor with your feedback.
          The instructor can then fix the issues and resubmit.
        </p>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            Rejection Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            placeholder="Please provide clear feedback to help the instructor improve..."
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none
              focus:outline-none focus:ring-2 focus:ring-[#534AB7]/20 focus:border-[#534AB7]"
            required
          />
          <p className="text-xs text-gray-400 mt-1">Minimum 10 characters</p>
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !reason.trim() || reason.trim().length < 10}
            className="px-4 py-2 text-xs font-semibold rounded-lg text-white disabled:opacity-50 hover:opacity-90"
            style={{ background: '#DC2626' }}
          >
            {loading ? 'Rejecting…' : 'Reject Course'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RejectCourseModal;