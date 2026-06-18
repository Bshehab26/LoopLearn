// src/features/courses/components/course-details/StickyCTABar.jsx
//
// CHANGED: previously called `onEnroll` → CourseDetails' old mock
// `enrollInCourse()`, which never hit a real endpoint at all (it just set
// local state + localStorage). It also had no handling for paid courses.
// Now wired to the same useEnrollment/useCheckout hooks EnrollButton uses,
// so mobile enroll behaves identically to the desktop purchase card.

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useEnrollment from '../../../payment/hooks/useEnrollment';
import useCheckout from '../../../payment/hooks/useCheckout';

const fmt = (currency, amount) => {
  const num = Number(amount ?? 0).toFixed(2);
  const sym = currency || '$';
  return sym.length > 1 ? `${sym} ${num}` : `${sym}${num}`;
};

const StickyCTABar = ({
  course,
  currency,
  isVisible,
  isEnrolled,
  isAuthenticated,
  onAuthRequired,
  onSuccess,
}) => {
  const { enroll, loading: enrollLoading } = useEnrollment();
  const { startCheckout, loading: checkoutLoading } = useCheckout();
  const loading = enrollLoading || checkoutLoading;

  if (isEnrolled) return null;

  const handleClick = async () => {
    if (!isAuthenticated) {
      onAuthRequired?.();
      return;
    }
    if (course.isFree) {
      const result = await enroll(course.id);
      if (result.ok) onSuccess?.(result.data);
    } else {
      // Redirects the browser to Stripe on success — never returns
      await startCheckout(course.id);
    }
  };

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
          <div className="flex items-center justify-between px-4 py-2.5 max-w-md mx-auto gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-gray-400 truncate">{course.title}</p>
              <p className="text-base font-bold text-[#534AB7]">
                {course.isFree ? 'Free' : fmt(currency, course.price)}
              </p>
            </div>
            <button
              onClick={handleClick}
              disabled={loading}
              className={`px-5 py-2 rounded-lg font-semibold text-[13px] text-white transition
                whitespace-nowrap flex items-center gap-2
                ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90 active:scale-[.98]'}`}
              style={{
                background: loading
                  ? '#9CA3AF'
                  : 'linear-gradient(135deg, #534AB7 0%, #3C3489 100%)',
              }}
            >
              {loading && (
                <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              )}
              {loading
                ? (course.isFree ? 'Enrolling…' : 'Redirecting…')
                : (course.isFree ? 'Enroll Free' : 'Enroll Now')}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyCTABar;