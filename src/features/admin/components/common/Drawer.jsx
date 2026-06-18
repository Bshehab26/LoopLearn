// src/features/admin/components/common/Drawer.jsx
//
// Generic right-side sliding panel for "view details" experiences. Used by
// UserDetailDrawer now; CourseDetailDrawer can reuse it later.

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX } from 'react-icons/hi';

const Drawer = ({ open, onClose, title, children, widthClass = 'w-full sm:w-[420px]' }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 z-50"
          onClick={onClose}
        />
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.22 }}
          className={`fixed top-0 right-0 h-full bg-white z-50 shadow-xl flex flex-col ${widthClass}`}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close">
              <HiX size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default Drawer;
