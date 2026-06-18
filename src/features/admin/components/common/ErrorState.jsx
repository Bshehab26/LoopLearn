// src/features/admin/components/common/ErrorState.jsx

import React from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center text-center py-14 px-4">
    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
      <HiOutlineExclamationCircle size={22} className="text-red-500" />
    </div>
    <p className="text-sm font-medium text-gray-700">{message || 'Something went wrong.'}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-1.5 text-xs font-medium text-white rounded-lg hover:opacity-90"
        style={{ background: '#534AB7' }}
      >
        Try again
      </button>
    )}
  </div>
);

export default ErrorState;
