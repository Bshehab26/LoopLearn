// src/features/student/components/InstructorApplication.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HiOutlineAcademicCap, 
  HiOutlineCheckCircle, 
  HiOutlineClock,
  HiOutlineUserGroup,
  HiOutlineLightBulb,
  HiOutlineChartBar,
  HiOutlineShieldCheck,
  HiOutlineMail,
} from 'react-icons/hi';
import { useAuth } from '../../../store/AppProvider';
import { submitInstructorApplication } from '../api/instructor.api';
import { ROUTES } from '../../../shared/constants/routes';

const BenefitCard = ({ icon: Icon, title, description }) => (
  <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-3">
      <Icon size={20} className="text-purple-600" />
    </div>
    <h4 className="text-sm font-semibold text-gray-800 mb-1">{title}</h4>
    <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
  </div>
);

const RequirementItem = ({ text }) => (
  <li className="flex items-start gap-2.5 text-sm text-gray-600">
    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
    <span>{text}</span>
  </li>
);

const InstructorApplication = () => {
  const { user, refreshUser, isInstructorRequested, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Check application status on mount
  useEffect(() => {
    const checkStatus = async () => {
      setCheckingStatus(true);
      try {
        // Refresh user data to get latest status
        const freshUser = await refreshUser();
        if (freshUser?.isInstructorRequested) {
          // User has a pending application
          setSuccess(false);
        }
      } catch (err) {
        console.error('Failed to check application status:', err);
      } finally {
        setCheckingStatus(false);
      }
    };
    checkStatus();
  }, [refreshUser]);

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await submitInstructorApplication();
      if (result.success) {
        // Update user state to reflect pending application
        updateUser({ isInstructorRequested: true });
        setSuccess(true);
        setShowConfirm(false);
      } else {
        setError(result.message || 'Failed to submit application. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // If still checking status, show loading
  if (checkingStatus) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
          <div className="w-12 h-12 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Checking application status...</p>
        </div>
      </div>
    );
  }

  // If already has a pending application
  if (isInstructorRequested || user?.isInstructorRequested) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto p-6"
      >
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border border-yellow-200 p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiOutlineClock size={32} className="text-yellow-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Application Under Review</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Your instructor application has been submitted and is currently being reviewed by our team.
            You'll receive a notification once a decision has been made.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
            <HiOutlineClock size={16} />
            <span>Pending Review</span>
          </div>
          <div className="mt-6 p-4 bg-white/60 rounded-xl border border-yellow-100">
            <p className="text-sm text-gray-600">
              <HiOutlineMail className="inline mr-2" size={16} />
              You will be notified via email when your application is reviewed.
            </p>
          </div>
          <button
            onClick={() => window.location.href = ROUTES.HOME}
            className="mt-6 px-6 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition shadow-sm"
          >
            Back to Home
          </button>
        </div>
      </motion.div>
    );
  }

  // If already an instructor
  if (user?.role === 'Instructor' || user?.role === 'Admin' || user?.role === 'SuperAdmin') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto p-6"
      >
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiOutlineCheckCircle size={32} className="text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">You're Already an Instructor!</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            You already have instructor privileges. Start creating courses and sharing your knowledge with students.
          </p>
          <button
            onClick={() => window.location.href = ROUTES.INSTRUCTOR_DASHBOARD}
            className="mt-6 px-6 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition shadow-sm"
          >
            Go to Instructor Dashboard
          </button>
        </div>
      </motion.div>
    );
  }

  // If application was just submitted successfully
  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto p-6"
      >
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiOutlineCheckCircle size={32} className="text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Application Submitted!</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Your application to become an instructor has been submitted successfully.
            Our team will review your application and get back to you soon.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
            <HiOutlineClock size={16} />
            <span>Pending Review</span>
          </div>
          <div className="mt-6 p-4 bg-white/60 rounded-xl border border-green-100">
            <p className="text-sm text-gray-600">
              <HiOutlineMail className="inline mr-2" size={16} />
              You will be notified via email when your application is reviewed.
            </p>
          </div>
          <button
            onClick={() => window.location.href = ROUTES.HOME}
            className="mt-6 px-6 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition shadow-sm"
          >
            Back to Home
          </button>
        </div>
      </motion.div>
    );
  }

  // Show application form (default state)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-6"
    >
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-10 text-white">
          <div className="flex items-center gap-3 mb-4">
            <HiOutlineAcademicCap size={32} className="text-purple-200" />
            <h1 className="text-2xl font-bold">Become an Instructor</h1>
          </div>
          <p className="text-purple-100 max-w-2xl">
            Share your knowledge with thousands of students worldwide. Join our community of expert instructors
            and start creating impactful courses today.
          </p>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* Benefits Grid */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Why Become an Instructor?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BenefitCard
                icon={HiOutlineUserGroup}
                title="Global Reach"
                description="Share your knowledge with students from around the world and make a lasting impact."
              />
              <BenefitCard
                icon={HiOutlineChartBar}
                title="Earn Income"
                description="Generate revenue from your courses and build a sustainable income stream."
              />
              <BenefitCard
                icon={HiOutlineLightBulb}
                title="Build Authority"
                description="Establish yourself as an expert in your field and grow your personal brand."
              />
              <BenefitCard
                icon={HiOutlineShieldCheck}
                title="Full Control"
                description="Set your own prices, create your own curriculum, and teach at your own pace."
              />
            </div>
          </div>

          {/* Requirements */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">What You'll Need</h3>
            <ul className="space-y-2.5">
              <RequirementItem text="Expertise in a specific subject area (programming, design, business, etc.)" />
              <RequirementItem text="Ability to create high-quality video content and educational materials" />
              <RequirementItem text="Good communication skills and passion for teaching" />
              <RequirementItem text="Commitment to providing a valuable learning experience for students" />
            </ul>
          </div>

          {/* Application Form */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Ready to Get Started?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Submit your application to become an instructor. Our team will review your request
              and get back to you within 2-3 business days.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            {!showConfirm ? (
              <button
                onClick={() => setShowConfirm(true)}
                className="px-6 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition shadow-sm"
              >
                Apply Now
              </button>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Are you sure you want to submit an application to become an instructor?
                    You will be able to create and publish courses once approved.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-6 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition shadow-sm disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Confirm Application'}
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InstructorApplication;