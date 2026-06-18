// src/shared/components/Modal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, title, message, onConfirm, confirmText = 'OK', cancelText = 'Cancel', type = 'info' }) => {
  if (!isOpen) return null;

  const isConfirm = !!onConfirm;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 mx-4"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-6">{message}</p>
          <div className="flex justify-end gap-3">
            {isConfirm && (
              <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
                {cancelText}
              </button>
            )}
            <button
              onClick={isConfirm ? onConfirm : onClose}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {isConfirm ? confirmText : 'Got it'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Modal;