// src/features/profile/pages/Profile.jsx - FIXED

import ProfileHeader from '../components/ProfileHeader';
import ProfileInfo from '../components/ProfileInfo';
import ChangePasswordSection from '../components/ChangePasswordSection';
import { useAuth, useProfile } from '../../../store/AppProvider';
import { 
  HiOutlineAcademicCap, HiOutlineUserGroup, HiOutlineCurrencyDollar, HiOutlineChartBar,
  HiOutlineBookOpen, HiOutlineStar, HiOutlineTrendingUp, HiOutlineShieldCheck
} from 'react-icons/hi';

const Profile = () => {
  const { user, isStudent, isInstructor, isAdmin } = useAuth();
  const {
    profile,
    loading,
    saving,
    toast,
    updateUserProfile,
    updatePassword,
    updateUserAvatar,
  } = useProfile();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleAvatarChange = async (previewUrl, file) => {
    await updateUserAvatar(previewUrl);
  };

  const handleProfileSave = async (data) => {
    const result = await updateUserProfile(data);
    return result.success;
  };

  const handlePasswordChange = async (oldPassword, newPassword, confirmPassword) => {
    const result = await updatePassword(oldPassword, newPassword, confirmPassword);
    return result.success;
  };

  const userRole = user?.role || 'Student';
  const isUserInstructor = isInstructor || userRole === 'Instructor';
  const isUserStudent = isStudent || userRole === 'Student';
  const isUserAdmin = isAdmin || userRole === 'Admin' || userRole === 'SuperAdmin';

  const profileWithRole = {
    ...profile,
    role: userRole,
  };

  // ============================================================================
  // Student Stats
  // ============================================================================
  const StudentStats = () => (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
        <HiOutlineAcademicCap className="w-6 h-6 text-purple-600 mx-auto mb-2" />
        <p className="text-2xl font-bold text-gray-800">{profile?.enrolledCourses || 0}</p>
        <p className="text-xs text-gray-500">Enrolled</p>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
        <HiOutlineChartBar className="w-6 h-6 text-green-600 mx-auto mb-2" />
        <p className="text-2xl font-bold text-gray-800">{profile?.completedCourses || 0}</p>
        <p className="text-xs text-gray-500">Completed</p>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
        <HiOutlineUserGroup className="w-6 h-6 text-amber-600 mx-auto mb-2" />
        <p className="text-2xl font-bold text-gray-800">{profile?.certificates || 0}</p>
        <p className="text-xs text-gray-500">Certificates</p>
      </div>
    </div>
  );

  // ============================================================================
  // Instructor Stats
  // ============================================================================
  const InstructorStats = () => (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
        <HiOutlineAcademicCap className="w-6 h-6 text-purple-600 mx-auto mb-2" />
        <p className="text-2xl font-bold text-gray-800">{profile?.totalCourses || 0}</p>
        <p className="text-xs text-gray-500">Courses</p>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
        <HiOutlineUserGroup className="w-6 h-6 text-green-600 mx-auto mb-2" />
        <p className="text-2xl font-bold text-gray-800">{profile?.totalStudents || 0}</p>
        <p className="text-xs text-gray-500">Students</p>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
        <HiOutlineCurrencyDollar className="w-6 h-6 text-amber-600 mx-auto mb-2" />
        <p className="text-2xl font-bold text-gray-800">${profile?.totalRevenue || 0}</p>
        <p className="text-xs text-gray-500">Revenue</p>
      </div>
    </div>
  );

  // ============================================================================
  // Admin Stats - Only for Admin/SuperAdmin
  // ============================================================================
  const AdminStats = () => (
    <>
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <HiOutlineUserGroup className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800">{profile?.totalUsers || 0}</p>
          <p className="text-xs text-gray-500">Total Users</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <HiOutlineBookOpen className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800">{profile?.totalCourses || 0}</p>
          <p className="text-xs text-gray-500">Total Courses</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <HiOutlineTrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800">{profile?.pendingCourses || 0}</p>
          <p className="text-xs text-gray-500">Pending Review</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <HiOutlineCurrencyDollar className="w-6 h-6 text-amber-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800">${profile?.totalRevenue || 0}</p>
          <p className="text-xs text-gray-500">Total Revenue</p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <HiOutlineAcademicCap className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800">{profile?.totalStudents || 0}</p>
          <p className="text-xs text-gray-500">Students</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <HiOutlineUserGroup className="w-6 h-6 text-cyan-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800">{profile?.totalInstructors || 0}</p>
          <p className="text-xs text-gray-500">Instructors</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <HiOutlineStar className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800">{profile?.averageRating || 0}</p>
          <p className="text-xs text-gray-500">Avg Rating</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <HiOutlineShieldCheck className="w-6 h-6 text-red-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800">{profile?.totalAdmins || 0}</p>
          <p className="text-xs text-gray-500">Admins</p>
        </div>
      </div>
    </>
  );

  // ============================================================================
  // Admin Quick Actions
  // ============================================================================
  const AdminQuickActions = () => (
    <div className="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm mb-6">
      <h3 className="text-base font-semibold text-gray-800 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button className="p-3 rounded-xl bg-purple-50 text-purple-700 text-sm font-medium hover:bg-purple-100 transition">
          View Reports
        </button>
        <button className="p-3 rounded-xl bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition">
          Manage Users
        </button>
        <button className="p-3 rounded-xl bg-green-50 text-green-700 text-sm font-medium hover:bg-green-100 transition">
          Approve Courses
        </button>
        <button className="p-3 rounded-xl bg-amber-50 text-amber-700 text-sm font-medium hover:bg-amber-100 transition">
          View Analytics
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {toast && (
          <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-lg animate-slideIn ${
            toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
          } text-white text-sm`}>
            {toast.message}
          </div>
        )}

        <div className="space-y-6">
          <ProfileHeader
            profile={profileWithRole}
            onAvatarChange={handleAvatarChange}
            saving={saving}
          />

          {/* ✅ Only show stats based on role */}
          {isUserStudent && !isUserInstructor && !isUserAdmin && <StudentStats />}
          {isUserInstructor && !isUserAdmin && <InstructorStats />}
          {isUserAdmin && (
            <>
              <AdminStats />
              <AdminQuickActions />
            </>
          )}

          <ProfileInfo
            profile={profile}
            onSave={handleProfileSave}
            saving={saving}
          />

          <ChangePasswordSection
            onChangePassword={handlePasswordChange}
            saving={saving}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;