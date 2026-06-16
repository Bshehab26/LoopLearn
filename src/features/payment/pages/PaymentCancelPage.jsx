// src/features/payment/pages/PaymentCancelPage.jsx
// Route: /payment/cancel  ← must match StripeSettings.CancelUrl on the backend
// No charge was made — user abandoned Stripe's payment page.

import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentCancelPage = () => {
  const navigate  = useNavigate();
  const params    = new URLSearchParams(window.location.search);
  const courseId  = params.get('courseId'); // present if backend appends it to CancelUrl

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-50 via-white to-white">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">Payment cancelled</h1>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          No charge was made. You can retry at any time.
        </p>
        <div className="flex flex-col gap-3">
          {courseId ? (
            <button
              onClick={() => navigate(`/course/${courseId}`)}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition"
              style={{ background: 'linear-gradient(135deg, #534AB7 0%, #3C3489 100%)' }}
            >
              Return to course
            </button>
          ) : (
            <button
              onClick={() => navigate('/courses')}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition"
              style={{ background: 'linear-gradient(135deg, #534AB7 0%, #3C3489 100%)' }}
            >
              Browse courses
            </button>
          )}
          <button
            onClick={() => navigate(-1)}
            className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-600
              text-sm font-medium hover:bg-gray-50 transition"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;