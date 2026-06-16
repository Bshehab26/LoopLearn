// src/features/payment/hooks/useEnrollment.js
//
// Handles free-course enrollment & unenrollment.
// Paid courses must use useCheckout instead.

import { useState } from 'react';
import { enrollFreeCourse, unenrollFromCourse } from '../api/payment.api';

const useEnrollment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  /**
   * Enroll in a free course.
   * @param {number} courseId
   * @returns {{ ok: boolean, data?: object, error?: string }}
   */
  const enroll = async (courseId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await enrollFreeCourse(courseId);
      // data: { success, message, data: { courseId, courseTitle, enrolledAt, isFree } }
      return { ok: true, data: data.data };
    } catch (err) {
      const status  = err.response?.status;
      const message = err.response?.data?.message;

      let msg = message || 'Enrollment failed. Please try again.';
      if (status === 409) msg = 'You are already enrolled in this course.';
      if (status === 401) msg = 'Please sign in to enroll.';
      if (status === 400 && err.response?.data?.paymentEndpoint)
        msg = 'This is a paid course. Please use the checkout flow.';

      setError(msg);
      return { ok: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Unenroll from a free course.
   * @param {number} courseId
   * @returns {{ ok: boolean, needsRefund?: boolean }}
   */
  const unenroll = async (courseId) => {
    setLoading(true);
    setError(null);
    try {
      await unenrollFromCourse(courseId);
      return { ok: true };
    } catch (err) {
      const status = err.response?.status;
      if (status === 400 && err.response?.data?.refundEndpoint)
        return { ok: false, needsRefund: true };

      const msg = err.response?.data?.message || 'Could not unenroll. Please try again.';
      setError(msg);
      return { ok: false };
    } finally {
      setLoading(false);
    }
  };

  return { enroll, unenroll, loading, error, clearError: () => setError(null) };
};

export default useEnrollment;