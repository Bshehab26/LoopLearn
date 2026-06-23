/**
 * Dashboard.jsx
 * Instructor dashboard page - stats computed from courses
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiOutlineBookOpen, HiOutlineUserGroup, HiOutlineCurrencyDollar, 
  HiOutlineTrendingUp, HiOutlineEye, HiOutlinePlusCircle,
  HiOutlineChartBar, HiOutlineCalendar
} from 'react-icons/hi';
import { useAuth } from '../../../store/AppProvider';
import { useInstructorCourses } from '../hooks/useInstructorCourses';

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

const STATS_CONFIG = [
  { title: 'Total Courses', key: 'totalCourses', icon: HiOutlineBookOpen, color: '#534AB7', bgColor: '#EEEDFE' },
  { title: 'Total Students', key: 'totalStudents', icon: HiOutlineUserGroup, color: '#1D9E75', bgColor: '#D1FAE5' },
  { title: 'Total Revenue', key: 'totalRevenue', icon: HiOutlineCurrencyDollar, color: '#B45309', bgColor: '#FEF3C7' },
  { title: 'Enrollments', key: 'totalEnrollments', icon: HiOutlineTrendingUp, color: '#0891B2', bgColor: '#CFFAFE' },
];

const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
  <motion.div variants={itemVariants} className='bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all'>
    <div className='flex items-center justify-between'>
      <div>
        <p className='text-sm text-gray-500 mb-1'>{title}</p>
        <p className='text-3xl font-bold text-gray-800'>{value}</p>
      </div>
      <div className='w-12 h-12 rounded-xl flex items-center justify-center' style={{ background: bgColor }}>
        <Icon className='w-6 h-6' style={{ color }} />
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { courses, loading: coursesLoading } = useInstructorCourses();
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    totalEnrollments: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!coursesLoading) {
      const totalEnrollments = courses.reduce((sum, c) => sum + (c.enrollmentCount || 0), 0);
      const totalRevenue = courses.reduce((sum, c) => sum + ((c.price || 0) * (c.enrollmentCount || 0)), 0);
      setStats({
        totalCourses: courses.length,
        totalStudents: totalEnrollments, // unique students? assuming enrollment count is students
        totalRevenue,
        totalEnrollments,
      });
      setStatsLoading(false);
    }
  }, [courses, coursesLoading]);

  const recentCourses = courses.slice(0, 5);

  const quickActions = [
    { icon: HiOutlinePlusCircle, label: 'Add Course', onClick: () => navigate('/instructor/courses/add'), color: '#534AB7' },
    { icon: HiOutlineEye, label: 'View Courses', onClick: () => navigate('/instructor/courses'), color: '#1D9E75' },
    { icon: HiOutlineChartBar, label: 'Analytics', onClick: () => console.log('Analytics coming soon'), color: '#B45309' },
    { icon: HiOutlineCalendar, label: 'Schedule', onClick: () => console.log('Schedule coming soon'), color: '#0891B2' },
  ];

  if (statsLoading || coursesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className='space-y-8'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-800'>Instructor Dashboard</h1>
          <p className='text-gray-500 mt-1'>Welcome back, {user?.username || 'Instructor'}! 👋</p>
        </div>
        <Link
          to='/instructor/courses/add'
          className='inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition'
        >
          <HiOutlinePlusCircle className='w-5 h-5' />
          New Course
        </Link>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
        {STATS_CONFIG.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stats[stat.key] || 0}
            icon={stat.icon}
            color={stat.color}
            bgColor={stat.bgColor}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <h2 className='text-lg font-semibold text-gray-800 mb-4'>Quick Actions</h2>
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className='flex flex-col items-center gap-2 p-4 rounded-xl bg-white border border-gray-100 hover:shadow-md transition'
            >
              <div className='w-10 h-10 rounded-full flex items-center justify-center' style={{ background: `${action.color}15` }}>
                <action.icon className='w-5 h-5' style={{ color: action.color }} />
              </div>
              <span className='text-xs font-medium text-gray-600'>{action.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Recent Courses */}
      <motion.div variants={itemVariants} className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
        <div className='px-6 py-4 border-b border-gray-100 flex justify-between items-center'>
          <div>
            <h2 className='font-semibold text-gray-800'>Recent Courses</h2>
            <p className='text-sm text-gray-500'>Your most recently added courses</p>
          </div>
          <Link to='/instructor/courses' className='text-sm text-purple-600 hover:text-purple-700 font-medium'>
            View All →
          </Link>
        </div>

        {recentCourses.length > 0 ? (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500'>Course</th>
                  <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500'>Category</th>
                  <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500'>Status</th>
                  <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500'>Created</th>
                  <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500'></th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {recentCourses.map((course) => (
                  <tr key={course.id} className='hover:bg-gray-50 transition'>
                    <td className='px-6 py-4'>
                      <p className='font-medium text-gray-800'>{course.title}</p>
                    </td>
                    <td className='px-6 py-4 text-gray-600'>{course.category}</td>
                    <td className='px-6 py-4'>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                        course.status === 'published' ? 'bg-green-100 text-green-700' :
                         course.status === 'pending'? 'bg-yellow-100 text-yellow-700': 
                         course.status === 'rejected'? 'bg-red-100 text-red-700': 'bg-amber-100 text-amber-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          course.status === 'published' ? 'bg-green-500' : 
                          course.status === 'pending' ? 'bg-yellow-500' : 
                          course.status === 'rejected' ? 'bg-red-500' : 'bg-amber-500'
                        }`} />

                        {course.status === 'published' ? 'Published' :
                         course.status === 'pending' ? 'Pending' : 
                         course.status === 'draft' ? 'Draft' : 'Reject'}

                      </span>
                    </td>
                    <td className='px-6 py-4 text-gray-500 text-sm'>
                      {new Date(course.createdAt).toLocaleDateString()}
                    </td>
                    <td className='px-6 py-4'>
                      {(course.status === 'draft' || course.status === 'rejected') &&
                        <Link to={`/instructor/courses/edit/${course.id}`} className='text-purple-600 hover:text-purple-700 text-sm font-medium'>
                          Edit →
                        </Link>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='text-center py-12'>
            <p className='text-gray-500'>No courses yet. Create your first course!</p>
          </div>
        )}
      </motion.div>

      {/* Tips Section */}
      <motion.div variants={itemVariants} className='bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6'>
        <div className='flex items-start gap-4'>
          <div className='w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center'>
            <HiOutlineTrendingUp className='w-5 h-5 text-purple-600' />
          </div>
          <div>
            <h3 className='font-semibold text-gray-800 mb-1'>Pro Tip</h3>
            <p className='text-sm text-gray-600'>
              Courses with high-quality content and detailed descriptions get 3x more enrollments. 
              Add engaging content to attract more students!
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;