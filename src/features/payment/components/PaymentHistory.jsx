// src/features/payment/components/PaymentHistory.jsx
import React, { useState } from 'react';
import usePaymentHistory from '../hooks/usePaymentHistory';
import RefundModal from './RefundModal';

const StatusBadge = ({ status }) => {
  const map = {
    Succeeded: 'bg-green-50 text-green-700 border-green-100',
    Pending:   'bg-yellow-50 text-yellow-700 border-yellow-100',
    Refunded:  'bg-gray-100 text-gray-500 border-gray-200',
    Failed:    'bg-red-50 text-red-700 border-red-100',
  };
  const label = { Succeeded: '✓ Paid', Pending: '⏳ Pending', Refunded: '↩ Refunded', Failed: '✕ Failed' };
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${map[status] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>
      {label[status] || status}
    </span>
  );
};

const SkeletonRow = () => (
  <tr className="animate-pulse">
    {[...Array(5)].map((_, i) => (
      <td key={i} className="px-4 py-4"><div className="h-3 bg-gray-100 rounded w-3/4" /></td>
    ))}
  </tr>
);

const PaymentHistory = () => {
  const { payments, loading, error, refetch, refund, refundLoading, refundError, refundResult, clearRefundState } = usePaymentHistory();
  const [refundTarget, setRefundTarget] = useState(null);

  if (error) return (
    <div className="text-center py-16">
      <p className="text-4xl mb-3">⚠️</p>
      <p className="text-gray-500 mb-4">{error}</p>
      <button onClick={refetch} className="px-5 py-2 bg-purple-600 text-white rounded-full text-sm hover:bg-purple-700 transition">Try again</button>
    </div>
  );

  if (!loading && payments.length === 0) return (
    <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl">
      <p className="text-4xl mb-3">💳</p>
      <p className="text-gray-700 font-medium mb-1">No payments yet</p>
      <p className="text-sm text-gray-400">Your payment history will appear here after your first purchase.</p>
    </div>
  );

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Course</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Amount</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Date</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {loading ? [...Array(3)].map((_, i) => <SkeletonRow key={i} />) : payments.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-4 py-4">
                  <p className="font-medium text-gray-800 leading-tight">{p.courseTitle}</p>
                  <p className="text-xs text-gray-400 mt-0.5">ID #{p.id}</p>
                </td>
                <td className="px-4 py-4 font-medium text-gray-800">
                  {p.currency?.toUpperCase()} {Number(p.amount).toFixed(2)}
                </td>
                <td className="px-4 py-4"><StatusBadge status={p.status} /></td>
                <td className="px-4 py-4 text-gray-500">
                  {new Date(p.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-4 py-4 text-right">
                  {p.status === 'Succeeded' && (
                    <button onClick={() => { clearRefundState(); setRefundTarget({ courseId: p.courseId, courseTitle: p.courseTitle, amount: p.amount, currency: p.currency }); }} className="text-xs text-red-500 hover:text-red-700 font-medium hover:underline transition">
                      Request refund
                    </button>
                  )}
                  {p.status === 'Refunded' && <span className="text-xs text-gray-400">Refunded</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {refundTarget && (
        <RefundModal
          courseTitle={refundTarget.courseTitle}
          amount={refundTarget.amount}
          currency={refundTarget.currency}
          loading={refundLoading}
          error={refundError}
          result={refundResult}
          onConfirm={() => refund(refundTarget.courseId)}
          onClose={() => { setRefundTarget(null); clearRefundState(); }}
        />
      )}
    </>
  );
};

export default PaymentHistory;