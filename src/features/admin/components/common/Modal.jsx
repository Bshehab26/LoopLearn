// src/features/admin/components/common/Modal.jsx
//
// Generic centered dialog. Domain modals (role change, ban/unban, etc.)
// render their form/content as children — this just handles the overlay,
// animation, and close button.

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX } from 'react-icons/hi';

const Modal = ({ open, onClose, title, children, maxWidthClass = 'max-w-md' }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className={`bg-white rounded-xl shadow-xl w-full ${maxWidthClass} max-h-[85vh] overflow-y-auto`}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close">
              <HiX size={18} />
            </button>
          </div>
          <div className="px-5 py-4">{children}</div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default Modal;
