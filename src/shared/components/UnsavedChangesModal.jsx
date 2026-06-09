// src/shared/components/UnsavedChangesModal.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiExclamation, HiSave, HiTrash } from 'react-icons/hi';

const UnsavedChangesModal = ({ isOpen, onClose, onConfirm, onSave, isSaving }) => {
  if (!isOpen) return null;

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
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <HiExclamation size={20} className="text-amber-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Unsaved Changes</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition"
          >
            <HiX size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <p className="text-gray-600 mb-2">
            You have unsaved changes that will be lost if you leave this page.
          </p>
          <p className="text-sm text-gray-500">
            Would you like to save your changes before leaving?
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition flex items-center justify-center gap-2"
          >
            <HiTrash size={16} />
            Discard Changes
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <HiSave size={16} />
            )}
            Save & Exit
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UnsavedChangesModal;