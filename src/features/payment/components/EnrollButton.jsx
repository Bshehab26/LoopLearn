// src/features/payment/components/EnrollButton.jsx
//
// Drop-in enroll button used by CoursePurchaseCard & StickyCTABar.
// Automatically routes to the correct flow:
//   course.isFree  → POST /api/enrollment/courses/{id}
//   !course.isFree → POST /api/payment/checkout → Stripe redirect
//
// CHANGED:
//   • Added a local `justEnrolled` flag so the button flips to "Enrolled"
//     the instant the free-enroll request succeeds, instead of waiting on
//     the parent's isEnrolled prop to catch up on the next render.
//   • Replaced the instant button swap with a Framer Motion crossfade +
//     an animated checkmark draw-in — feels like a real confirmation
//     instead of a UI snap.
//   • Loading copy is now state-specific ("Enrolling…" vs "Redirecting to
//     checkout…") instead of a generic "Please wait…".
//
// Props:
//   course           object   — must have { id, isFree, price }
//   isEnrolled       boolean
//   isAuthenticated  boolean
//   onAuthRequired   () => void  — called when user is not signed in
//   onSuccess        (data) => void — called after successful free enroll
//   className        string   — optional Tailwind override

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useCheckout from '../hooks/useCheckout';
import useEnrollment from '../hooks/useEnrollment';

const Spinner = () => (
  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);

const EnrollButton = ({
  course,
  isEnrolled,
  isAuthenticated,
  onAuthRequired,
  onSuccess,
  className = '',
  hideTrustBadge = false,
}) => {
  const {
    startCheckout,
    loading: checkoutLoading,
    error: checkoutError,
    clearError: clearCheckout,
  } = useCheckout();

  const {
    enroll,
    loading: enrollLoading,
    error: enrollError,
    clearError: clearEnroll,
  } = useEnrollment();

  const [justEnrolled, setJustEnrolled] = useState(false);

  const loading  = checkoutLoading || enrollLoading;
  const error    = checkoutError || enrollError;
  const enrolled = isEnrolled || justEnrolled;

  const handleClick = async () => {
    if (!isAuthenticated) {
      onAuthRequired?.();
      return;
    }

    if (course.isFree) {
      const result = await enroll(course.id);
      if (result.ok) {
        setJustEnrolled(true);
        onSuccess?.(result.data);
      }
    } else {
      // startCheckout redirects the browser on success — never returns
      await startCheckout(course.id);
    }
  };

  const label = () => {
    if (!isAuthenticated) return course.isFree ? 'Sign in to enroll' : 'Sign in to buy';
    if (loading) return course.isFree ? 'Enrolling…' : 'Redirecting to checkout…';
    return course.isFree ? 'Enroll Now — Free' : 'Enroll Now';
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait" initial={false}>
        {enrolled ? (
          <motion.button
            key="enrolled"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 24 }}
            disabled
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg
              text-[13px] font-semibold bg-green-100 text-green-700 cursor-default ${className}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"
              />
            </svg>
            Enrolled
          </motion.button>
        ) : (
          <motion.button
            key="cta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            onClick={handleClick}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg
              text-[13px] font-semibold text-white transition-all active:scale-[.98]
              ${loading ? 'opacity-90 cursor-not-allowed' : 'hover:opacity-90'}
              ${className}`}
            style={{
              background: loading
                ? 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)'
                : 'linear-gradient(135deg, #534AB7 0%, #3C3489 100%)',
            }}
          >
            {loading && <Spinner />}
            {label()}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Inline error message */}
      <AnimatePresence>
        {error && error !== '__FREE_COURSE__' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 flex items-start gap-2 text-xs text-red-600
              bg-red-50 border border-red-100 rounded-lg px-3 py-2 overflow-hidden"
          >
            <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd" />
            </svg>
            <span className="flex-1">{error}</span>
            <button
              onClick={() => { clearCheckout(); clearEnroll(); }}
              className="text-red-400 hover:text-red-600 flex-shrink-0"
              aria-label="Dismiss"
            >✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stripe trust badge for paid courses */}
      {!hideTrustBadge && !course.isFree && !enrolled && (
        <p className="mt-2 text-center text-[11px] text-gray-400 flex items-center justify-center gap-1">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
          </svg>
          Secured by Stripe · 30-day money-back guarantee
        </p>
      )}
    </div>
  );
};

export default EnrollButton;