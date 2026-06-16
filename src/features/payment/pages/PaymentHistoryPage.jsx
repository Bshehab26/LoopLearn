// src/features/payment/pages/PaymentHistoryPage.jsx
// Route: /my-payments  (Student only — see AppRouter)

import React from 'react';
import { Link } from 'react-router-dom';
import PaymentHistory from '../components/PaymentHistory';

const PaymentHistoryPage = () => (
  <div className="min-h-screen bg-gray-50/50">
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
          <Link to="/my-enrollments" className="hover:text-purple-600 transition">My Courses</Link>
          <span>/</span>
          <span className="text-purple-600">Payment history</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Payment history</h1>
        <p className="text-sm text-gray-500 mt-1">
          All your transactions. Refunds are processed via Stripe within 5–10 business days.
        </p>
      </div>

      <PaymentHistory />

      <div className="mt-6 flex items-start gap-3 bg-purple-50 border border-purple-100 rounded-xl p-4">
        <svg className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd" />
        </svg>
        <p className="text-xs text-purple-700 leading-relaxed">
          Refunds are only available within <strong>30 days</strong> of purchase.
          Requesting a refund immediately removes your course access.
        </p>
      </div>
    </div>
  </div>
);

export default PaymentHistoryPage;