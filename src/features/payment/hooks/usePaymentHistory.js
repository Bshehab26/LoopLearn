// src/features/payment/hooks/usePaymentHistory.js

import { useState, useEffect, useCallback } from 'react';
import { getPaymentHistory, requestRefund } from '../api/payment.api';

const usePaymentHistory = () => {
  const [payments, setPayments]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [refundLoading, setRefundLoading] = useState(false);
  const [refundError, setRefundError]     = useState(null);
  const [refundResult, setRefundResult]   = useState(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getPaymentHistory();
      setPayments(result.data || []);
    } catch {
      setError('Failed to load payment history.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  /**
   * Request a refund. Backend enforces 30-day window.
   * On success re-fetches history so status updates to Refunded.
   */
  const refund = async (courseId) => {
    setRefundLoading(true);
    setRefundError(null);
    setRefundResult(null);
    try {
      const result = await requestRefund(courseId);
      setRefundResult(result.data);
      await fetchHistory();
      return { ok: true, data: result.data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Refund failed. Please try again.';
      setRefundError(msg);
      return { ok: false, error: msg };
    } finally {
      setRefundLoading(false);
    }
  };

  return {
    payments, loading, error, refetch: fetchHistory,
    refund, refundLoading, refundError, refundResult,
    clearRefundState: () => { setRefundError(null); setRefundResult(null); },
  };
};

export default usePaymentHistory;