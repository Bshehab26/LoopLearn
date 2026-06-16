// src/features/payment/hooks/useCheckout.js
//
// Handles paid course checkout flow:
//   1. Call POST /api/payment/checkout → get checkoutUrl
//   2. Store enrollment count (for polling on success page)
//   3. Redirect browser to Stripe's hosted payment page
//
// Enrollment is created by the backend webhook after payment succeeds —
// this hook never creates the enrollment itself.

import { useState } from 'react';
import { createCheckoutSession, getMyEnrollments } from '../api/payment.api';

const useCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  /**
   * Start Stripe checkout for a paid course.
   * On success: browser navigates to Stripe — function never returns.
   * On failure: sets error state.
   * @param {number} courseId
   */
  const startCheckout = async (courseId) => {
    setLoading(true);
    setError(null);

    try {
      // Store current enrollment count so PaymentSuccessPage can detect the new one
      try {
        const enrollRes = await getMyEnrollments();
        sessionStorage.setItem(
          'enrollmentCountBeforeCheckout',
          String(enrollRes.data?.length ?? 0)
        );
      } catch {
        // Non-critical — success page falls back gracefully
      }

      const result = await createCheckoutSession(courseId);

      if (result.success && result.data?.checkoutUrl) {
        // Hard redirect — browser leaves the app
        window.location.href = result.data.checkoutUrl;
        // setLoading stays true — page is navigating away
      } else {
        setError('Could not start checkout. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      const status  = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 409)  setError('You are already enrolled in this course.');
      else if (status === 401) setError('Please sign in to purchase this course.');
      else if (status === 400 && err.response?.data?.enrollEndpoint)
        setError('__FREE_COURSE__'); // sentinel — EnrollButton switches to free flow
      else setError(message || 'Payment failed. Please try again.');

      setLoading(false);
    }
  };

  return { startCheckout, loading, error, clearError: () => setError(null) };
};

export default useCheckout;