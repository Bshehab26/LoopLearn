// src/features/profile/pages/Profile.jsx
import { useState } from 'react';
import useProfile from '../hooks/useProfile';
import ProfileHeader from '../components/ProfileHeader';
import ProfileInfo from '../components/ProfileInfo';
import ChangePasswordModal from '../components/ChangePasswordModal';

const Profile = () => {
  const {
    profile,
    loading,
    saving,
    toast,
    isStudent,
    isInstructor,
    updateUserProfile,
    updatePassword,
    updateUserAvatar,
  } = useProfile();

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleAvatarChange = async (previewUrl, file) => {
    // For now, just pass the preview URL
    // In production, upload to your server/CDN first
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
          {/* Profile Header */}
          <ProfileHeader
            profile={profile}
            onAvatarChange={handleAvatarChange}
            saving={saving}
          />

          {/* Personal Information */}
          <ProfileInfo
            profile={profile}
            onSave={handleProfileSave}
            saving={saving}
          />

          {/* Security Section */}
          <div className="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-800">Security</h3>
                <p className="text-xs text-gray-400 mt-0.5">Manage your password</p>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-purple-600 border border-purple-200 hover:bg-purple-50 transition"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onChangePassword={handlePasswordChange}
        saving={saving}
      />
    </div>
  );
};

export default Profile;