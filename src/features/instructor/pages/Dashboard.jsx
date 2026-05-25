/**
 * Dashboard.jsx
 * Instructor dashboard page showing statistics, recent courses, and charts.
 * Features stats cards, recent courses table, and quick actions.
 * 
 * @module features/instructor/pages/Dashboard
 */

import React, { useContext, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiOutlineBookOpen, HiOutlineUserGroup, HiOutlineCurrencyDollar, 
  HiOutlineTrendingUp, HiOutlineEye, HiOutlinePlusCircle,
  HiOutlineChartBar, HiOutlineCalendar
} from 'react-icons/hi';
import { AppContext } from '../../../store/AppContext';

// ============================================================================
// Constants
// ============================================================================

/** Animation variants */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

/** Stat card configuration */
const STATS_CONFIG = [
  { 
    title: 'Total Courses', 
    key: 'totalCourses',
    icon: HiOutlineBookOpen, 
    color: '#534AB7', 
    bgColor: '#EEEDFE',
    gradient: 'from-purple-600 to-indigo-600'
  },
  { 
    title: 'Total Students', 
    key: 'totalStudents',
    icon: HiOutlineUserGroup, 
    color: '#1D9E75', 
    bgColor: '#D1FAE5',
    gradient: 'from-green-600 to-emerald-600'
  },
  { 
    title: 'Total Revenue', 
    key: 'totalRevenue',
    icon: HiOutlineCurrencyDollar, 
    color: '#B45309', 
    bgColor: '#FEF3C7',
    gradient: 'from-amber-600 to-orange-600'
  },
  { 
    title: 'Enrollments', 
    key: 'totalEnrollments',
    icon: HiOutlineTrendingUp, 
    color: '#0891B2', 
    bgColor: '#CFFAFE',
    gradient: 'from-cyan-600 to-blue-600'
  },
];

// ============================================================================
// Subcomponents
// ============================================================================

/**
 * Stat Card Component
 */
const StatCard = ({ title, value, icon: Icon, color, bgColor, gradient, delay }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className='bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden'
  >
    <div className='p-6'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm text-gray-500 mb-1'>{title}</p>
          <p className='text-3xl font-bold text-gray-800'>{value}</p>
        </div>
        <div 
          className='w-12 h-12 rounded-xl flex items-center justify-center'
          style={{ background: bgColor }}
        >
          <Icon className='w-6 h-6' style={{ color }} />
        </div>
      </div>
    </div>
    <div className={`h-1 bg-gradient-to-r ${gradient}`} />
  </motion.div>
);

/**
 * Quick Action Button
 */
const QuickAction = ({ icon: Icon, label, onClick, color }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className='flex flex-col items-center gap-2 p-4 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-all duration-200'
  >
    <div className='w-10 h-10 rounded-full flex items-center justify-center' style={{ background: `${color}15` }}>
      <Icon className='w-5 h-5' style={{ color }} />
    </div>
    <span className='text-xs font-medium text-gray-600'>{label}</span>
  </motion.button>
);

/**
 * Recent Courses Table
 */
const RecentCoursesTable = ({ courses, currency }) => {
  if (courses.length === 0) {
    return (
      <div className='text-center py-12'>
        <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center'>
          <HiOutlineBookOpen className='w-8 h-8 text-gray-400' />
        </div>
        <p className='text-gray-500'>No courses yet</p>
        <Link
          to='/instructor/add-course'
          className='inline-block mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition'
        >
          Create Your First Course
        </Link>
      </div>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <table className='w-full min-w-[600px]'>
        <thead>
          <tr className='border-b border-gray-100'>
            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Course</th>
            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Students</th>
            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Price</th>
            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Status</th>
            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Actions</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-50'>
          {courses.map((course, index) => (
            <motion.tr
              key={course.id || index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className='hover:bg-gray-50 transition-colors'
            >
              <td className='px-6 py-4'>
                <div>
                  <p className='font-medium text-gray-800 line-clamp-1'>{course.courseTitle || course.title}</p>
                  <p className='text-xs text-gray-400 mt-0.5'>ID: {course.id || course._id}</p>
                </div>
              </td>
              <td className='px-6 py-4 text-gray-600'>—</td>
              <td className='px-6 py-4'>
                <span className='font-semibold text-purple-600'>{currency}{(course.coursePrice || course.price)?.toFixed(2)}</span>
              </td>
              <td className='px-6 py-4'>
                <span className='inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-green-100 text-green-700'>
                  <span className='w-1.5 h-1.5 rounded-full bg-green-500' />
                  Published
                </span>
              </td>
              <td className='px-6 py-4'>
                <Link
                  to={`/instructor/edit-course/${course.id || course._id}`}
                  className='text-purple-600 hover:text-purple-700 text-sm font-medium'
                >
                  Edit →
                </Link>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

/**
 * Dashboard - Instructor dashboard page
 * @returns {React.ReactElement} Dashboard page
 */
const Dashboard = () => {
  const { allCourses, currency, user } = useContext(AppContext);
  const navigate = useNavigate(); // ADD THIS

  // Mock stats - replace with real API data
  const stats = {
    totalCourses: allCourses.length,
    totalStudents: 128,
    totalRevenue: 2450,
    totalEnrollments: 342,
  };

  // Get recent courses (last 5)
  const recentCourses = useMemo(() => 
    allCourses.slice(0, 5), 
    [allCourses]
  );

  // FIXED: Use navigate instead of window.location.href
  const quickActions = [
    { icon: HiOutlinePlusCircle, label: 'Add Course', onClick: () => navigate('/instructor/add-course'), color: '#534AB7' },
    { icon: HiOutlineEye, label: 'View Courses', onClick: () => navigate('/instructor/my-courses'), color: '#1D9E75' },
    { icon: HiOutlineChartBar, label: 'Analytics', onClick: () => console.log('Analytics coming soon'), color: '#B45309' },
    { icon: HiOutlineCalendar, label: 'Schedule', onClick: () => console.log('Schedule coming soon'), color: '#0891B2' },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className='space-y-8'
    >
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-800'>Instructor Dashboard</h1>
          <p className='text-gray-500 mt-1'>Welcome back, {user?.username || 'Instructor'}! 👋</p>
        </div>
        <Link
          to='/instructor/add-course'
          className='inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-200'
        >
          <HiOutlinePlusCircle className='w-5 h-5' />
          New Course
        </Link>
      </div>

      {/* Stats Grid */}
      <motion.div 
        variants={itemVariants}
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'
      >
        {STATS_CONFIG.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stats[stat.key]}
            icon={stat.icon}
            color={stat.color}
            bgColor={stat.bgColor}
            gradient={stat.gradient}
            delay={index * 0.1}
          />
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <h2 className='text-lg font-semibold text-gray-800 mb-4'>Quick Actions</h2>
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
          {quickActions.map((action) => (
            <QuickAction key={action.label} {...action} />
          ))}
        </div>
      </motion.div>

      {/* Recent Courses Section */}
      <motion.div variants={itemVariants} className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
        <div className='px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
          <div>
            <h2 className='font-semibold text-gray-800'>Recent Courses</h2>
            <p className='text-sm text-gray-500 mt-0.5'>Your most recently added courses</p>
          </div>
          <Link
            to='/instructor/my-courses'
            className='text-sm text-purple-600 hover:text-purple-700 font-medium'
          >
            View All →
          </Link>
        </div>

        <RecentCoursesTable courses={recentCourses} currency={currency} />
      </motion.div>

      {/* Tips Section */}
      <motion.div variants={itemVariants} className='bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6'>
        <div className='flex items-start gap-4'>
          <div className='w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0'>
            <HiOutlineTrendingUp className='w-5 h-5 text-purple-600' />
          </div>
          <div>
            <h3 className='font-semibold text-gray-800 mb-1'>Pro Tip</h3>
            <p className='text-sm text-gray-600'>
              Courses with high-quality thumbnails and detailed descriptions get 3x more enrollments. 
              Make sure to add engaging content to attract more students!
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;