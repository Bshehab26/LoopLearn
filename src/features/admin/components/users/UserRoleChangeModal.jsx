// src/features/admin/components/users/UserRoleChangeModal.jsx
//
// Mirrors the backend rule in AdminController: only a SuperAdmin can assign
// the Admin role, and SuperAdmin itself is never an assignable option.
// Hiding the option client-side avoids a guaranteed-to-fail request.

import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

const ALL_ROLES = ['Student', 'Instructor', 'Admin'];

const UserRoleChangeModal = ({ open, onClose, user, canAssignAdmin, onSubmit, loading, error }) => {
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    if (user) setSelectedRole(ALL_ROLES.includes(user.role) ? user.role : 'Student');
  }, [user]);

  if (!user) return null;

  const roleOptions = ALL_ROLES.filter((r) => r !== 'Admin' || canAssignAdmin);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedRole === user.role) return;
    const ok = await onSubmit(selectedRole);
    if (ok) onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={`Change role — ${user.fullName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-xs text-gray-500">
          Current role: <span className="font-medium text-gray-700">{user.role}</span>
        </p>

        <div className="space-y-2">
          {roleOptions.map((r) => (
            <label
              key={r}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer text-sm transition
                ${selectedRole === r ? 'border-[#534AB7] bg-[#EEEDFE]' : 'border-gray-200 hover:bg-gray-50'}`}
            >
              <input
                type="radio"
                name="role"
                value={r}
                checked={selectedRole === r}
                onChange={() => setSelectedRole(r)}
              />
              {r}
            </label>
          ))}
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
            disabled={loading || selectedRole === user.role}
            className="px-4 py-2 text-xs font-semibold rounded-lg text-white disabled:opacity-50 hover:opacity-90"
            style={{ background: '#534AB7' }}
          >
            {loading ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UserRoleChangeModal;
