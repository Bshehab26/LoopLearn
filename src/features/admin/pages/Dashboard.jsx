// src/features/admin/pages/Dashboard.jsx

import { HiUsers, HiBookOpen, HiCurrencyDollar, HiStar } from 'react-icons/hi';
import StatsCard from '../components/StatsCard';
import useAdminStats from '../hooks/useAdminStats';

const Dashboard = () => {
  const { stats, loading } = useAdminStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { title: 'Total Users', value: stats?.totalUsers, icon: HiUsers, color: 'purple', trend: 'up', trendValue: 12 },
    { title: 'Total Courses', value: stats?.totalCourses, icon: HiBookOpen, color: 'blue', trend: 'up', trendValue: 8 },
    { title: 'Total Revenue', value: `$${stats?.totalRevenue?.toLocaleString()}`, icon: HiCurrencyDollar, color: 'green', trend: 'up', trendValue: 15 },
    { title: 'Avg Rating', value: stats?.averageRating, icon: HiStar, color: 'orange', trend: 'up', trendValue: 0.5 },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of platform statistics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((card, index) => (
          <StatsCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            trend={card.trend}
            trendValue={card.trendValue}
            delay={index * 0.1}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-4">Pending Approval</h3>
          <p className="text-3xl font-bold text-purple-600">{stats?.pendingCourses || 0}</p>
          <p className="text-sm text-gray-500 mt-2">Courses waiting for review</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Students</span>
              <span className="font-semibold">{stats?.totalStudents?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Instructors</span>
              <span className="font-semibold">{stats?.totalInstructors?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Enrollments</span>
              <span className="font-semibold">{stats?.totalEnrollments?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Monthly Revenue</span>
              <span className="font-semibold">${stats?.monthlyRevenue?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;