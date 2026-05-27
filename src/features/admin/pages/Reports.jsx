// src/features/admin/pages/Reports.jsx
import { useEffect } from 'react';
import { HiDownload, HiTrendingUp, HiUsers, HiBookOpen, HiCurrencyDollar } from 'react-icons/hi';
import ReportCard from '../components/ReportCard';
import Chart from '../components/Chart';
import useAdminReports from '../hooks/useAdminReports';

const Reports = () => {
  const { reports, loading, activeTab, setActiveTab, fetchReports, exportReport } = useAdminReports();

  useEffect(() => {
    fetchReports();
  }, [activeTab]);

  const tabs = [
    { id: 'revenue', label: 'Revenue', icon: HiCurrencyDollar },
    { id: 'enrollments', label: 'Enrollments', icon: HiUsers },
    { id: 'courses', label: 'Courses', icon: HiBookOpen },
  ];

  const getChartData = () => {
    if (!reports) return null;
    
    if (activeTab === 'revenue') {
      return {
        labels: reports.revenue?.labels || ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        values: reports.revenue?.monthly || [45000, 52000, 48900, 58450],
      };
    } else if (activeTab === 'enrollments') {
      return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        values: reports.enrollments?.monthly || [1450, 1680, 1520, 1890, 2100, 2450],
      };
    }
    return null;
  };

  const summaryCards = [
    { title: 'Total Revenue', value: `$${reports?.revenue?.monthly?.reduce((a, b) => a + b, 0)?.toLocaleString() || '0'}`, icon: HiCurrencyDollar, color: 'green', change: 12, changeType: 'up' },
    { title: 'New Enrollments', value: reports?.enrollments?.monthly?.reduce((a, b) => a + b, 0)?.toLocaleString() || '0', icon: HiUsers, color: 'blue', change: 8, changeType: 'up' },
    { title: 'Active Courses', value: reports?.topCourses?.length || '0', icon: HiBookOpen, color: 'purple', change: 5, changeType: 'up' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytics & Reports</h1>
          <p className="text-gray-500 mt-1">View platform performance metrics</p>
        </div>
        <button
          onClick={() => exportReport('csv')}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition"
        >
          <HiDownload size={16} /> Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {summaryCards.map((card, index) => (
          <ReportCard key={card.title} {...card} delay={index * 0.1} />
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <h3 className="font-semibold text-gray-800 mb-4 capitalize">{activeTab} Trends</h3>
        <Chart data={getChartData()} type="line" color="#534AB7" />
      </div>

      {/* Top Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Courses */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <HiTrendingUp size={18} className="text-purple-600" />
            Top Performing Courses
          </h3>
          <div className="space-y-3">
            {reports?.topCourses?.slice(0, 5).map((course, index) => (
              <div key={course.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-400">#{index + 1}</span>
                  <span className="text-sm text-gray-700">{course.title}</span>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-gray-500">{course.enrollments} students</span>
                  <span className="text-purple-600 font-medium">${course.revenue?.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Instructors */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <HiUsers size={18} className="text-purple-600" />
            Top Instructors
          </h3>
          <div className="space-y-3">
            {reports?.topInstructors?.slice(0, 5).map((instructor, index) => (
              <div key={instructor.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-400">#{index + 1}</span>
                  <span className="text-sm text-gray-700">{instructor.name}</span>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-gray-500">{instructor.courses} courses</span>
                  <span className="text-purple-600 font-medium">${instructor.revenue?.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;