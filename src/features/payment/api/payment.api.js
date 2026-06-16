// src/features/payment/api/payment.api.js
//
// Uses the project's shared axios instance (src/services/api/axios.js)
// which already attaches the Bearer JWT automatically — no need to set up interceptors here.
//
// Backend endpoints:
//   POST   /api/payment/checkout              → { sessionId, checkoutUrl }
//   POST   /api/payment/refund                → RefundResultDTO
//   GET    /api/payment/history               → PaymentHistoryDTO[]
//   POST   /api/enrollment/courses/{courseId} → free enroll
//   GET    /api/enrollment/courses            → EnrolledCourseDTO[]
//   DELETE /api/enrollment/courses/{courseId} → unenroll (free only)

import api from '../../../services/api/axios';
import { handleApiError } from '../../../services/api/errorHandler';

// ── Payment ───────────────────────────────────────────────────────────────────

/**
 * POST /api/payment/checkout
 * Body: CreateCheckoutSessionDTO { courseId }
 * Returns: { success, data: CheckoutSessionResultDTO { sessionId, checkoutUrl } }
 */
export const createCheckoutSession = async (courseId) => {
  try {
    const response = await api.post('/payment/checkout', { courseId });
    return response.data;
  } catch (error) {
    console.error('❌ createCheckoutSession error:', error);
    return handleApiError(error);
  }
};

/**
 * POST /api/payment/refund
 * Body: RefundRequestDTO { courseId }
 * Returns: { success, message, data: RefundResultDTO }
 * RefundResultDTO: { paymentId, courseTitle, amountRefunded, currency, stripeRefundId, refundedAt }
 * Errors:
 *   400 → refund window expired (message says how many days ago)
 *   404 → no paid enrollment found
 */
export const requestRefund = async (courseId) => {
  try {
    const response = await api.post('/payment/refund', { courseId });
    return response.data;
  } catch (error) {
    console.error('❌ requestRefund error:', error);
    return handleApiError(error);
  }
};

/**
 * GET /api/payment/history
 * Returns: { success, data: PaymentHistoryDTO[] }
 * PaymentHistoryDTO: { id, courseId, courseTitle, amount, currency, status, createdAt }
 * status: "Pending" | "Succeeded" | "Refunded" | "Failed"
 */
export const getPaymentHistory = async () => {
  try {
    const response = await api.get('/payment/history');
    return response.data;
  } catch (error) {
    console.error('❌ getPaymentHistory error:', error);
    return handleApiError(error);
  }
};

// ── Enrollment ────────────────────────────────────────────────────────────────
// These mirror src/features/student/api/enrollment.api.js but live here
// so payment hooks don't cross feature boundaries.

/**
 * GET /api/enrollment/courses
 * Returns: { success, data: EnrolledCourseDTO[] }
 */
export const getMyEnrollments = async () => {
  try {
    const response = await api.get('/enrollment/courses');
    return response.data;
  } catch (error) {
    console.error('❌ getMyEnrollments error:', error);
    return handleApiError(error);
  }
};

/**
 * POST /api/enrollment/courses/{courseId}
 * Free courses only — paid courses go through createCheckoutSession.
 * Returns: { success, message, data: { courseId, courseTitle, enrolledAt, isFree } }
 * 409 → already enrolled
 * 400 + paymentEndpoint → course is paid, use checkout instead
 */
export const enrollFreeCourse = async (courseId) => {
  try {
    const response = await api.post(`/enrollment/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('❌ enrollFreeCourse error:', error);
    // Re-throw so hooks can inspect error.response for status + hints
    throw error;
  }
};

/**
 * DELETE /api/enrollment/courses/{courseId}
 * Free courses only.
 * 400 + refundEndpoint → paid course, must request refund instead
 */
export const unenrollFromCourse = async (courseId) => {
  try {
    const response = await api.delete(`/enrollment/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('❌ unenrollFromCourse error:', error);
    throw error;
  }
};