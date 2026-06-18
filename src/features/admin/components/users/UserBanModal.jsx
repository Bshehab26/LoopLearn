// src/features/admin/components/users/UserBanModal.jsx
//
// One modal handles both directions — the action is derived from the
// user's current isLocked state, so there's no separate "unban" component
// to keep in sync.

import React, { useState } from 'react';
import Modal from '../common/Modal';

const UserBanModal = ({ open, onClose, user, onSubmit, loading, error }) => {
  const [reason, setReason] = useState('');

  if (!user) return null;
  const isBanning = !user.isLocked;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await onSubmit(isBanning, reason.trim() || undefined);
    if (ok) {
      setReason('');
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isBanning ? `Ban ${user.fullName}` : `Unban ${user.fullName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-600">
          {isBanning
            ? 'This locks the account immediately. They will not be able to sign in until unbanned.'
            : 'This restores sign-in access for this account.'}
        </p>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            Reason {isBanning ? '(recommended)' : '(optional)'}
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder={isBanning ? 'e.g. Repeated terms-of-service violations' : 'e.g. Appeal reviewed and approved'}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none
              focus:outline-none focus:ring-2 focus:ring-[#534AB7]/20 focus:border-[#534AB7]"
          />
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
            disabled={loading}
            className={`px-4 py-2 text-xs font-semibold rounded-lg text-white disabled:opacity-50 ${
              isBanning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? 'Saving…' : isBanning ? 'Ban user' : 'Unban user'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UserBanModal;
