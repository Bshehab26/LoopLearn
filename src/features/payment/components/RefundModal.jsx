// src/features/payment/components/RefundModal.jsx
import React from 'react';

const RefundModal = ({ courseTitle, amount, currency, loading, error, result, onConfirm, onClose }) => {
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget && !loading) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={handleBackdrop}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">

        {result ? (
          /* ── Success ─────────────────────────────────────────────────────── */
          <div className="p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Refund issued</h3>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
              <span className="font-medium text-gray-700">
                {result.currency?.toUpperCase()} {Number(result.amountRefunded).toFixed(2)}
              </span>{' '}
              refunded for "{result.courseTitle}". Allow 5–10 business days.
            </p>
            <p className="text-xs text-gray-400 mb-5">Stripe ID: {result.stripeRefundId}</p>
            <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition">
              Close
            </button>
          </div>
        ) : (
          <>
            {/* ── Header ────────────────────────────────────────────────────── */}
            <div className="flex items-start justify-between p-5 border-b border-gray-100">
              <div>
                <h3 className="font-semibold text-gray-800">Request a refund</h3>
                <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{courseTitle}</p>
              </div>
              <button onClick={onClose} disabled={loading} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* ── Body ──────────────────────────────────────────────────────── */}
            <div className="p-5 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">Refund amount</span>
                <span className="text-lg font-semibold text-gray-800">
                  {currency?.toUpperCase()} {Number(amount).toFixed(2)}
                </span>
              </div>
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-3">
                <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Confirming will <strong>immediately remove your access</strong> to "{courseTitle}". Refunds are only available within 30 days of purchase.
                </p>
              </div>
              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-3">
                  <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              )}
            </div>

            {/* ── Footer ────────────────────────────────────────────────────── */}
            <div className="flex gap-3 px-5 pb-5">
              <button onClick={onClose} disabled={loading} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50">
                Cancel
              </button>
              <button onClick={onConfirm} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition disabled:opacity-60 flex items-center justify-center gap-2">
                {loading && (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                )}
                {loading ? 'Processing…' : 'Confirm refund'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RefundModal;