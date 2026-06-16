// src/features/courses/components/course-details/StickyCTABar.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const fmt = (currency, amount) => {
  const num = Number(amount ?? 0).toFixed(2);
  const sym = currency || '$';
  return sym.length > 1 ? `${sym} ${num}` : `${sym}${num}`;
};

const StickyCTABar = ({ course, currency, isVisible, isEnrolled, onEnroll }) => {
  if (isEnrolled) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          transition={{ type: 'tween', duration: 0.18 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 lg:hidden"
        >
          <div className="flex items-center justify-between px-4 py-2.5 max-w-md mx-auto">
            <div className="flex-1 min-w-0 mr-3">
              <p className="text-[11px] text-gray-400 truncate">{course.title}</p>
              <p className="text-base font-bold text-[#534AB7]">
                {course.isFree ? 'Free' : fmt(currency, course.price)}
              </p>
            </div>
            <button
              onClick={onEnroll}
              className="px-5 py-2 bg-[#534AB7] text-white rounded-lg font-semibold text-[13px] hover:opacity-90 transition whitespace-nowrap"
            >
              Enroll Now
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyCTABar;