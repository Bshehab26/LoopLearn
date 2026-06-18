// src/features/admin/components/dashboard/PaymentStatusChart.jsx

import React from 'react';
import ChartCard from './ChartCard';

const COLORS = {
  Successful: '#16A34A',
  Pending: '#D97706',
  Failed: '#DC2626',
  Refunded: '#6B7280',
};

const PaymentStatusChart = ({ stats }) => {
  if (!stats) return null;

  const data = [
    { label: 'Successful', value: stats.successfulPayments, color: COLORS.Successful },
    { label: 'Pending', value: stats.pendingPayments, color: COLORS.Pending },
    { label: 'Failed', value: stats.failedPayments, color: COLORS.Failed },
    { label: 'Refunded', value: stats.refundedPayments, color: COLORS.Refunded },
  ];

  return <ChartCard title="Payments (lifetime)" data={data} />;
};

export default PaymentStatusChart;
