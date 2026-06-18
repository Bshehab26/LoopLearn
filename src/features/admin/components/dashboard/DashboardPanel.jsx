// src/features/admin/components/dashboard/DashboardPanel.jsx

import React from 'react';
import {
  HiOutlineUserGroup,
  HiOutlineBookOpen,
  HiOutlineAcademicCap,
  HiOutlineCurrencyDollar,
  HiOutlineTrendingUp,
  HiOutlineClipboardCheck,
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
      <div key={i} className="bg-white rounded-xl border border-gray-200 h-[68px]" />
    ))}
  </div>
);

const ChartsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl border border-gray-200 h-64" />
    ))}
  </div>
);

const DashboardPanel = () => {
  const { currency: ctxCurrency } = useUI();
  const currency = ctxCurrency || import.meta.env.VITE_CURRENCY || '$';

  const { stats, loading, error, refetch } = useAdminStats();

  console.log('[DashboardPanel] Stats:', stats); // Debug log

  if (loading) {
    return (
      <div className="space-y-6">
        <StatsSkeleton />
        <ChartsSkeleton />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-white rounded-xl border border-gray-200">
        <ErrorState message={error || 'Failed to load dashboard stats.'} onRetry={refetch} />
      </div>
    );
  }

  // Extract nested stats from the response
  const courseStats = stats.courseStats || stats.CourseStats || {};
  const userStats = stats.userStats || stats.UserStats || {};
  const enrollmentStats = stats.enrollmentStats || stats.EnrollmentStats || {};
  const paymentStats = stats.paymentStats || stats.PaymentStats || {};

  const kpis = [
    {
      icon: HiOutlineUserGroup,
      label: 'Total users',
      value: formatNumber(userStats.totalUsers || 0),
      tone: '#534AB7',
      to: '/admin/users',
    },
    {
      icon: HiOutlineBookOpen,
      label: 'Total courses',
      value: formatNumber(courseStats.totalCourses || 0),
      tone: '#0EA5E9',
      to: '/admin/courses',
    },
    {
      icon: HiOutlineClipboardCheck,
      label: 'Pending review',
      value: formatNumber(courseStats.pendingReview || 0),
      tone: '#D97706',
      to: '/admin/courses/pending',
    },
    {
      icon: HiOutlineAcademicCap,
      label: 'Total enrollments',
      value: formatNumber(enrollmentStats.totalEnrollments || 0),
      tone: '#16A34A',
    },
    {
      icon: HiOutlineCurrencyDollar,
      label: 'Total revenue',
      value: formatCurrency(currency, paymentStats.totalRevenue || 0),
      tone: '#534AB7',
    },
    {
      icon: HiOutlineTrendingUp,
      label: 'Revenue (30 days)',
      value: formatCurrency(currency, paymentStats.last30Days?.totalRevenue || 0),
      tone: '#16A34A',
    },
  ];

  return (
    <div className="space-y-6">
      <StatsGrid stats={kpis} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CourseStatusChart stats={courseStats} />
        <UserRoleChart stats={userStats} />
        <EnrollmentStatusChart stats={enrollmentStats} />
        <PaymentStatusChart stats={paymentStats} />
      </div>
    </div>
  );
};

export default DashboardPanel;