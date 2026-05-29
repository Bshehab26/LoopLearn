// src/features/profile/pages/Profile.jsx
import useProfile from '../hooks/useProfile';
import ProfileHeader from '../components/ProfileHeader';
import ProfileInfo from '../components/ProfileInfo';
import ChangePasswordSection from '../components/ChangePasswordSection';
import { useAuth } from '../../../store/AppProvider';
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

  // Get role from auth
  const userRole = user?.role || 'Student';
  const isUserInstructor = isInstructor || userRole === 'Instructor';
  const isUserStudent = isStudent || userRole === 'Student';
  const isUserAdmin = isAdmin || userRole === 'Admin' || userRole === 'SuperAdmin';

  // Merge profile with auth role for header
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
  // Admin Stats
  // ============================================================================
  const AdminStats = () => (
    <div className="grid grid-cols-4 gap-4 mb-6">
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
  );

  // ============================================================================
  // Admin Platform Stats (Second Row)
  // ============================================================================
  const AdminPlatformStats = () => (
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
  );

  // ============================================================================
  // Instructor Bio Section
  // ============================================================================
  const InstructorBio = () => (
    <div className="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm mb-6">
      <h3 className="text-base font-semibold text-gray-800 mb-4">About Me</h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        {profile?.bio || 'No bio added yet. Tell students about yourself, your expertise, and what they will learn from your courses.'}
      </p>
      {profile?.expertise && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Expertise</p>
          <div className="flex flex-wrap gap-2">
            {profile.expertise.split(',').map((skill, index) => (
              <span key={index} className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-600">
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
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
        {/* Toast Notification */}
        {toast && (
          <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-lg animate-slideIn ${
            toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
          } text-white text-sm`}>
            {toast.message}
          </div>
        )}

        <div className="space-y-6">
          {/* Profile Header with role from auth */}
          <ProfileHeader
            profile={profileWithRole}
            onAvatarChange={handleAvatarChange}
            saving={saving}
          />

          {/* Role-specific Stats */}
          {isUserStudent && !isUserInstructor && !isUserAdmin && <StudentStats />}
          {isUserInstructor && !isUserAdmin && <InstructorStats />}
          {isUserAdmin && (
            <>
              <AdminStats />
              <AdminPlatformStats />
              <AdminQuickActions />
            </>
          )}

          {/* Instructor Bio (only for instructors) */}
          {isUserInstructor && !isUserAdmin && <InstructorBio />}

          {/* Personal Information (same for all roles) */}
          <ProfileInfo
            profile={profile}
            onSave={handleProfileSave}
            saving={saving}
          />

          {/* Change Password Section - Inline */}
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