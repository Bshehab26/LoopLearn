/**
 * InstructorProfile.jsx
 * Instructor profile page for viewing and editing profile information.
 * Handles profile data fetching, updates, avatar uploads, and password changes.
 * 
 * @module features/instructor/pages/Profile
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiLockClosed, HiCheckCircle, HiXCircle, HiArrowLeft, 
  HiOutlineAcademicCap, HiOutlineUserGroup, HiOutlineCurrencyDollar,
  HiOutlineChartBar, HiOutlineBriefcase, HiOutlineMail, HiOutlinePhone
} from 'react-icons/hi';
import ProfileHeader from '../../student/components/profile/ProfileHeader';
import InstructorProfileInfo from '../../instructor/components/profile/InstructorProfileInfo';
import ChangePasswordModal from '../../student/components/profile/ChangePasswordModal';
import { useInstructorProfile } from '../hooks/useInstructorProfile';

// ============================================================================
// Constants
// ============================================================================

/** Toast display duration */
const TOAST_DURATION = 3500;

// ============================================================================
// Helper Components
// ============================================================================

/**
 * Toast notification component
 */
const Toast = ({ toast }) => {
  if (!toast) return null;
  const isError = toast.type === 'error';
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className='fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium shadow-xl'
      style={{
        background: isError ? '#FCEBEB' : '#EAF3DE',
        color: isError ? '#A32D2D' : '#3B6D11',
        border: `0.5px solid ${isError ? '#F09595' : '#97C459'}`,
        maxWidth: '320px',
      }}
      role='alert'
      aria-live='polite'
    >
      {isError ? (
        <HiXCircle size={16} style={{ color: '#E24B4A', flexShrink: 0 }} />
      ) : (
        <HiCheckCircle size={16} style={{ color: '#1D9E75', flexShrink: 0 }} />
      )}
      <span className='flex-1'>{toast.message}</span>
    </motion.div>
  );
};

/**
 * Loading spinner component
 */
const LoadingSpinner = () => (
  <div className='min-h-screen flex flex-col items-center justify-center gap-3 bg-gray-50'>
    <div className='w-12 h-12 rounded-full border-4 border-purple-600 border-t-transparent animate-spin' />
    <p className='text-sm text-gray-500'>Loading your profile...</p>
  </div>
);

/**
 * Error state component
 */
const ErrorState = ({ onRetry }) => (
  <div className='min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50'>
    <div className='w-20 h-20 rounded-full bg-red-100 flex items-center justify-center'>
      <HiXCircle className='w-10 h-10 text-red-600' />
    </div>
    <p className='text-gray-500'>Unable to load profile. Please try again later.</p>
    <button 
      onClick={onRetry} 
      className='px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition'
    >
      Retry
    </button>
  </div>
);

/**
 * Stats Card Component
 */
const StatsCard = ({ icon: Icon, value, label, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'
  >
    <div className='flex items-center justify-between'>
      <div>
        <p className='text-2xl font-bold text-gray-800'>{value}</p>
        <p className='text-xs text-gray-500 mt-0.5'>{label}</p>
      </div>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${color}-100`}>
        <Icon className={`w-5 h-5 text-${color}-600`} />
      </div>
    </div>
  </motion.div>
);

/**
 * Info Card Component
 */
const InfoCard = ({ icon: Icon, label, value, color }) => (
  <div className='flex items-center gap-3 p-3 rounded-xl bg-gray-50'>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-${color}-100`}>
      <Icon className={`w-4 h-4 text-${color}-600`} />
    </div>
    <div>
      <p className='text-xs text-gray-500'>{label}</p>
      <p className='text-sm font-medium text-gray-800'>{value || 'Not provided'}</p>
    </div>
  </div>
);

// ============================================================================
// Main Component
// ============================================================================

/**
 * InstructorProfile - Instructor profile page
 * @returns {React.ReactElement} Instructor profile page
 */
const InstructorProfile = () => {
  const navigate = useNavigate();
  const {
    profileData,
    pageLoading,
    saveLoading,
    toast,
    handleSaveProfile,
    handleAvatarChange,
    handleChangePassword,
    refetchProfile,
  } = useInstructorProfile();

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Loading state
  if (pageLoading) {
    return <LoadingSpinner />;
  }

  // Error state
  if (!profileData) {
    return <ErrorState onRetry={refetchProfile} />;
  }

  // Stats data (from profile or fallback)
  const stats = [
    { icon: HiOutlineAcademicCap, value: profileData.totalCourses || 0, label: 'Courses', color: 'purple', delay: 0 },
    { icon: HiOutlineUserGroup, value: profileData.totalStudents || 0, label: 'Students', color: 'green', delay: 0.1 },
    { icon: HiOutlineCurrencyDollar, value: `$${profileData.totalRevenue || 0}`, label: 'Revenue', color: 'amber', delay: 0.2 },
    { icon: HiOutlineChartBar, value: '4.8', label: 'Rating', color: 'blue', delay: 0.3 },
  ];

  const infoItems = [
    { icon: HiOutlineMail, label: 'Email', value: profileData.email, color: 'blue' },
    { icon: HiOutlinePhone, label: 'Phone', value: profileData.phone, color: 'green' },
    { icon: HiOutlineBriefcase, label: 'Expertise', value: profileData.expertise || 'Not specified', color: 'purple' },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-white'>
      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && <Toast toast={toast} />}
      </AnimatePresence>

      <div className='max-w-4xl mx-auto px-4 py-6 sm:py-8 lg:py-10'>
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/instructor')}
          className='flex items-center gap-2 text-sm text-gray-500 hover:text-purple-600 transition mb-6'
        >
          <HiArrowLeft size={16} />
          Back to Dashboard
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-6'
        >
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-800'>Instructor Profile</h1>
          <p className='text-sm text-gray-500 mt-1'>
            Manage your instructor information and teaching details
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6'
        >
          {stats.map((stat) => (
            <StatsCard key={stat.label} {...stat} />
          ))}
        </motion.div>

        {/* Quick Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6'
        >
          {infoItems.map((item) => (
            <InfoCard key={item.label} {...item} />
          ))}
        </motion.div>

        {/* Profile Header with Avatar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className='mb-6'
        >
          <ProfileHeader 
            user={profileData} 
            onAvatarChange={handleAvatarChange} 
            uploading={false}
          />
        </motion.div>

        {/* Profile Information Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='mb-6'
        >
          <InstructorProfileInfo 
            user={profileData} 
            onSave={handleSaveProfile} 
            loading={saveLoading} 
          />
        </motion.div>

        {/* Password & Security Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className='bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200'
        >
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center'>
              <HiLockClosed size={18} className='text-purple-600' />
            </div>
            <div>
              <p className='text-sm font-semibold text-gray-800'>Password & Security</p>
              <p className='text-xs text-gray-500 mt-0.5'>Update your account password anytime</p>
            </div>
          </div>
          <button
            onClick={() => setShowPasswordModal(true)}
            className='px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border border-purple-600 text-purple-600 hover:bg-purple-50 active:scale-95'
          >
            Change
          </button>
        </motion.div>
      </div>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <ChangePasswordModal
            onClose={() => setShowPasswordModal(false)}
            onSubmit={handleChangePassword}
            loading={saveLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default InstructorProfile;