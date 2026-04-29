import { useState, useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import ProfileHeader from "../../components/student/profile/ProfileHeader";
import ProfileInfo from "../../components/student/profile/ProfileInfo";
import ChangePasswordModal from "../../components/student/profile/ChangePasswordModal";
import { getProfile, updateProfile, uploadAvatar, changePassword } from "../../services/api/profile.api";
import { HiLockClosed } from "react-icons/hi";

const Profile = () => {
  const { user, loginUser } = useContext(AppContext);

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [toast, setToast] = useState(null);

  /* =====================
     SHOW TOAST
  ====================== */
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* =====================
     FETCH PROFILE
  ====================== */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await getProfile();
        setProfileData(res.data);
      } catch {
        // fallback to context user data while API is in development
        setProfileData({
          username: user?.username,
          email: user?.email,
          role: user?.role,
          fName: "",
          lName: "",
          phone: "",
          avatar: null,
          enrolledCourses: 0,
          completedCourses: 0,
          certificates: 0,
          joinDate: null,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /* =====================
     UPDATE PROFILE
  ====================== */
  const handleSaveProfile = async (formData) => {
    try {
      setSaveLoading(true);
      const res = await updateProfile(formData);
      setProfileData((prev) => ({ ...prev, ...res.data }));
      // sync name changes to context/localStorage
      loginUser({ ...user, ...res.data });
      showToast("Profile updated successfully");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update profile", "error");
    } finally {
      setSaveLoading(false);
    }
  };

  /* =====================
     UPLOAD AVATAR
  ====================== */
  const handleAvatarChange = async (file) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await uploadAvatar(formData);
      setProfileData((prev) => ({ ...prev, avatar: res.data.avatar }));
      showToast("Profile photo updated");
    } catch {
      showToast("Failed to upload photo", "error");
    }
  };

  /* =====================
     CHANGE PASSWORD
  ====================== */
  const handleChangePassword = async (data) => {
    try {
      setSaveLoading(true);
      await changePassword(data);
      setShowPasswordModal(false);
      showToast("Password changed successfully");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to change password", "error");
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "#534AB7", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: "#FAFAFA" }}>
      <div className="max-w-3xl mx-auto flex flex-col gap-5">

        {/* Toast */}
        {toast && (
          <div
            className="fixed top-6 right-6 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-lg"
            style={{
              background: toast.type === "error" ? "#FCEBEB" : "#EAF3DE",
              color: toast.type === "error" ? "#A32D2D" : "#3B6D11",
              border: `0.5px solid ${toast.type === "error" ? "#F09595" : "#97C459"}`,
            }}
          >
            {toast.message}
          </div>
        )}

        {/* Page title */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">My Profile</h1>
          <p className="text-sm mt-1" style={{ color: "#888780" }}>
            Manage your account information
          </p>
        </div>

        {/* Header card */}
        <ProfileHeader
          user={profileData}
          onAvatarChange={handleAvatarChange}
        />

        {/* Info card */}
        <ProfileInfo
          user={profileData}
          onSave={handleSaveProfile}
          loading={saveLoading}
        />

        {/* Change password */}
        <div
          className="rounded-2xl p-5 flex items-center justify-between"
          style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.08)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "#EEEDFE" }}
            >
              <HiLockClosed size={16} style={{ color: "#534AB7" }} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Password</p>
              <p className="text-xs" style={{ color: "#888780" }}>
                Update your account password
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="px-4 py-2 rounded-full text-sm transition hover:opacity-90"
            style={{ border: "0.5px solid #534AB7", color: "#534AB7" }}
          >
            Change
          </button>
        </div>

      </div>

      {/* Change password modal */}
      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSubmit={handleChangePassword}
          loading={saveLoading}
        />
      )}
    </div>
  );
};

export default Profile;
