// src/features/profile/pages/Profile.jsx
import ProfileHeader from '../components/ProfileHeader';
import ProfileInfo from '../components/ProfileInfo';
import ChangePasswordSection from '../components/ChangePasswordSection';
import { useAuth, useProfile } from '../../../store/AppProvider';

const Profile = () => {
  const { user } = useAuth();
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

  const handleAvatarChange = async (file) => {
    await updateUserAvatar(file);
  };

  const handleProfileSave = async (data) => {
    const result = await updateUserProfile(data);
    return result?.success || false;
  };

  // Pass all three fields to updatePassword
  const handlePasswordChange = async (oldPassword, newPassword, confirmPassword) => {
    try {
      const result = await updatePassword(oldPassword, newPassword, confirmPassword);
      
      // Check if the response indicates success
      if (result && result.success === true) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Password change error:', error);
      return false;
    }
  };

  const profileWithRole = {
    ...profile,
    role: user?.role || profile?.role || 'Student',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {toast && (
          <div
            className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-lg animate-slideIn ${
              toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
            } text-white text-sm`}
          >
            {toast.message}
          </div>
        )}

        <div className="space-y-6">
          <ProfileHeader profile={profileWithRole} onAvatarChange={handleAvatarChange} />
          <ProfileInfo profile={profile} onSave={handleProfileSave} saving={saving} />
          <ChangePasswordSection onChangePassword={handlePasswordChange} saving={saving} />
        </div>
      </div>
    </div>
  );
};

export default Profile;