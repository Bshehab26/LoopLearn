// src/shared/components/UnsavedChangesModal.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiX, HiExclamation, HiSave, HiArrowRight, 
  HiDocumentText, HiClock, HiTrash
} from 'react-icons/hi';

const UnsavedChangesModal = ({ isOpen, onClose, onConfirm, onSave, isSaving }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop with blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10"
        >
          {/* Warning Header Bar */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <HiExclamation size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Unsaved Changes</h2>
                  <p className="text-white/80 text-sm">Your work is not saved yet</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/20 transition text-white/80 hover:text-white"
              >
                <HiX size={20} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            {/* Warning Card */}
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 mb-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <HiDocumentText size={20} className="text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900 text-sm">Changes will be lost</h3>
                  <p className="text-amber-700 text-sm mt-1 leading-relaxed">
                    You have made changes to your course that haven't been saved to the database yet. 
                    If you leave now, all your progress will be lost permanently.
                  </p>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700 mb-3">What would you like to do?</p>

              {/* Save & Exit Option */}
              <button
                onClick={onSave}
                disabled={isSaving}
                className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 hover:border-purple-300 transition-all group text-left disabled:opacity-60"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-200 group-hover:scale-110 transition-transform">
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <HiSave size={22} className="text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-purple-900 text-sm">
                    {isSaving ? 'Saving...' : 'Save & Exit'}
                  </h4>
                  <p className="text-purple-600 text-xs mt-0.5">
                    Save all changes and then leave the page
                  </p>
                </div>
                <HiArrowRight size={18} className="text-purple-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
              </button>

              {/* Discard Option */}
              <button
                onClick={onConfirm}
                className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300 transition-all group text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-200 group-hover:scale-110 transition-transform">
                  <HiTrash size={22} className="text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-red-900 text-sm">Discard Changes</h4>
                  <p className="text-red-600 text-xs mt-0.5">
                    Leave without saving — all changes will be lost
                  </p>
                </div>
              </button>

              {/* Cancel Option */}
              <button
                onClick={onClose}
                className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-all group text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <HiClock size={22} className="text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 text-sm">Keep Editing</h4>
                  <p className="text-gray-500 text-xs mt-0.5">
                    Stay on this page and continue working
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Footer Note */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              Tip: Use the "Save All Changes" button at the bottom of the page to save your work regularly
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UnsavedChangesModal;