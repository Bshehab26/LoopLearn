// src/pages/student/Profile.jsx
// Place this file at: src/pages/student/Profile.jsx

import { useState, useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import ProfileHeader from "../../components/student/profile/ProfileHeader";
import ProfileInfo from "../../components/student/profile/ProfileInfo";
import ChangePasswordModal from "../../components/student/profile/ChangePasswordModal";
import { getProfile, updateProfile, uploadAvatar, changePassword } from "../../services/api/profile.api";
import { HiLockClosed, HiCheckCircle, HiXCircle } from "react-icons/hi";

/* ─────────────────────────────
   Toast component
───────────────────────────── */
const Toast = ({ toast }) => {
  if (!toast) return null;
  const isError = toast.type === "error";
  return (
    <div
      className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium shadow-xl animate-slideIn"
      style={{
        background: isError ? "#FCEBEB" : "#EAF3DE",
        color: isError ? "#A32D2D" : "#3B6D11",
        border: `0.5px solid ${isError ? "#F09595" : "#97C459"}`,
        maxWidth: "320px",
      }}
    >
      {isError ? (
        <HiXCircle size={16} style={{ color: "#E24B4A", flexShrink: 0 }} />
      ) : (
        <HiCheckCircle size={16} style={{ color: "#1D9E75", flexShrink: 0 }} />
      )}
      {toast.message}
    </div>
  );
};

/* ─────────────────────────────
   Main Profile Page
───────────────────────────── */
const Profile = () => {
  const { user, loginUser } = useContext(AppContext);

  const [profileData, setProfileData] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [toast, setToast] = useState(null);

  /* ── Toast helper ── */
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  /* ── Fetch profile on mount ── */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setPageLoading(true);
        const res = await getProfile();

        // Backend returns camelCase from ProfileResponseDTO
        // Normalize field names so components can use either casing
        const d = res.data;
        setProfileData({
          ...d,
          fName: d.fName || d.firstName || "",
          lName: d.lName || d.lastName || "",
        });
      } catch (err) {
        console.warn("Profile API not ready, using context fallback:", err?.message);
        // Fallback to context data while backend is being wired
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
          isVerifiedEmail: false,
          gender: null,
        });
      } finally {
        setPageLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /* ── Save profile info ── */
  const handleSaveProfile = async (formData) => {
    try {
      setSaveLoading(true);
      const res = await updateProfile(formData);
      const updated = res.data || formData;
      setProfileData((prev) => ({
        ...prev,
        ...updated,
        fName: updated.fName || updated.firstName || formData.fName,
        lName: updated.lName || updated.lastName || formData.lName,
      }));
      // Sync name/email updates into app context + localStorage
      loginUser({ ...user, ...updated });
      showToast("Profile updated successfully");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update profile", "error");
    } finally {
      setSaveLoading(false);
    }
  };

  /* ── Upload avatar ── */
  const handleAvatarChange = async (file) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await uploadAvatar(formData);
      setProfileData((prev) => ({ ...prev, avatar: res.data.avatar }));
      showToast("Profile photo updated");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to upload photo", "error");
    }
  };

  /* ── Change password ── */
  const handleChangePassword = async (data) => {
    try {
      setSaveLoading(true);
      await changePassword(data);
      setShowPasswordModal(false);
      showToast("Password changed successfully");
    } catch (err) {
      // Backend returns { Message: "Old password is wrong." } on 400
      const msg =
        err.response?.data?.Message ||
        err.response?.data?.message ||
        "Failed to change password";
      showToast(msg, "error");
    } finally {
      setSaveLoading(false);
    }
  };

  /* ── Loading spinner ── */
  if (pageLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ background: "#FAFAFA" }}>
        <div
          className="w-9 h-9 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "#534AB7", borderTopColor: "transparent" }}
        />
        <p className="text-sm" style={{ color: "#888780" }}>Loading your profile…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: "#FAFAFA" }}>
      {/* Toast notification */}
      <Toast toast={toast} />

      <div className="max-w-3xl mx-auto flex flex-col gap-5">

        {/* Page title */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">My Profile</h1>
          <p className="text-sm mt-1" style={{ color: "#888780" }}>
            Manage your account information and security settings
          </p>
        </div>

        {/* Header card */}
        <ProfileHeader
          user={profileData}
          onAvatarChange={handleAvatarChange}
        />

        {/* Personal info card */}
        <ProfileInfo
          user={profileData}
          onSave={handleSaveProfile}
          loading={saveLoading}
        />

        {/* Change password card */}
        <div
          className="rounded-2xl p-5 flex items-center justify-between"
          style={{
            background: "white",
            border: "0.5px solid rgba(0,0,0,0.08)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "#EEEDFE" }}
            >
              <HiLockClosed size={18} style={{ color: "#534AB7" }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Password & Security</p>
              <p className="text-xs mt-0.5" style={{ color: "#888780" }}>
                Update your account password anytime
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="px-4 py-2 rounded-full text-sm font-medium transition hover:bg-purple-50 active:scale-95 flex-shrink-0"
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