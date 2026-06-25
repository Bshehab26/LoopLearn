// src/features/admin/components/dashboard/DashboardPanel.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineUserGroup,
  HiOutlineBookOpen,
  HiOutlineAcademicCap,
  HiOutlineCurrencyDollar,
  HiOutlineTrendingUp,
  HiOutlineClipboardCheck,
  HiOutlineRefresh,
} from 'react-icons/hi';
import { useUI } from '../../../../store/AppProvider';
import useAdminStats from '../../hooks/useAdminStats';
import { formatCurrency, formatNumber } from '../../utils/format';
import StatsGrid from './StatsGrid';
import CourseStatusChart from './CourseStatusChart';
import UserRoleChart from './UserRoleChart';
import EnrollmentStatusChart from './EnrollmentStatusChart';
import PaymentStatusChart from './PaymentStatusChart';
import ErrorState from '../common/ErrorState';

const StatsSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 animate-pulse">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl border border-gray-100 h-[72px] shadow-sm" />
    ))}
  </div>
);

const ChartsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl border border-gray-100 h-64 shadow-sm" />
    ))}
  </div>
);

const DashboardPanel = () => {
  const { currency: ctxCurrency } = useUI();
  const currency = ctxCurrency || import.meta.env.VITE_CURRENCY || '$';
  const [refreshing, setRefreshing] = useState(false);

  const { stats, loading, error, refetch } = useAdminStats();

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (loading && !stats) {
    return (
      <div className="space-y-6">
        <StatsSkeleton />
        <ChartsSkeleton />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <ErrorState message={error || 'Failed to load dashboard stats.'} onRetry={refetch} />
      </div>
    );
  }

  const courseStats = stats.courseStats || stats.CourseStats || {};
  const userStats = stats.userStats || stats.UserStats || {};
  const enrollmentStats = stats.enrollmentStats || stats.EnrollmentStats || {};
  const paymentStats = stats.paymentStats || stats.PaymentStats || {};

  const kpis = [
    {
      icon: HiOutlineUserGroup,
      label: 'Total Users',
      value: formatNumber(userStats.totalUsers || 0),
      tone: '#534AB7',
      to: '/admin/users',
    },
    {
      icon: HiOutlineBookOpen,
      label: 'Total Courses',
      value: formatNumber(courseStats.totalCourses || 0),
      tone: '#0EA5E9',
      to: '/admin/courses/all',
    },
    {
      icon: HiOutlineClipboardCheck,
      label: 'Pending Review',
      value: formatNumber(courseStats.pendingReview || 0),
      tone: '#D97706',
      to: '/admin/courses/pending',
    },
    {
      icon: HiOutlineAcademicCap,
      label: 'Enrollments',
      value: formatNumber(enrollmentStats.totalEnrollments || 0),
      tone: '#16A34A',
    },
    {
      icon: HiOutlineCurrencyDollar,
      label: 'Total Revenue',
      value: formatCurrency(currency, paymentStats.totalRevenue || 0),
      tone: '#7C3AED',
    },
    {
      icon: HiOutlineTrendingUp,
      label: 'Revenue (30d)',
      value: formatCurrency(currency, paymentStats.last30Days?.totalRevenue || 0),
      tone: '#0891B2',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Refresh button */}
      <div className="flex justify-end">
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-[#534AB7] transition-colors disabled:opacity-50"
        >
          <HiOutlineRefresh className={`${refreshing ? 'animate-spin' : ''}`} size={14} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <StatsGrid stats={kpis} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CourseStatusChart stats={courseStats} />
        <UserRoleChart stats={userStats} />
        <EnrollmentStatusChart stats={enrollmentStats} />
        <PaymentStatusChart stats={paymentStats} />
      </div>

      {/* Footer timestamp */}
      <p className="text-center text-[10px] text-gray-400">
        Data updated: {new Date().toLocaleString()}
      </p>
    </div>
  );
};

export default DashboardPanel;