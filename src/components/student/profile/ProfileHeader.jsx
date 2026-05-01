// src/components/student/profile/ProfileHeader.jsx
// Place this file at: src/components/student/profile/ProfileHeader.jsx

import { useRef, useState } from "react";
import { HiCamera } from "react-icons/hi";
import { HiBadgeCheck } from "react-icons/hi";

const ProfileHeader = ({ user, onAvatarChange }) => {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "??";

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    if (onAvatarChange) {
      setUploading(true);
      try {
        await onAvatarChange(file);
      } finally {
        setUploading(false);
      }
    }
  };

  const roleMeta = {
    student:    { label: "Student",    bg: "#EEEDFE", color: "#534AB7", border: "#AFA9EC" },
    instructor: { label: "Instructor", bg: "#FFF4E6", color: "#B45309", border: "#FBC878" },
    admin:      { label: "Admin",      bg: "#ECFDF5", color: "#065F46", border: "#6EE7B7" },
  };
  const role = roleMeta[user?.role?.toLowerCase()] || roleMeta.student;

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #F0EFFE 0%, #fafaff 60%, #F7F6FF 100%)",
        border: "0.5px solid rgba(83,74,183,0.18)",
        boxShadow: "0 2px 16px 0 rgba(83,74,183,0.07)",
      }}
    >
      {/* Decorative top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
        style={{ background: "linear-gradient(90deg, #534AB7 0%, #8B82E8 50%, #C4BFFF 100%)" }}
      />

      <div className="p-8 flex flex-col sm:flex-row items-center gap-6 pt-9">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold overflow-hidden select-none"
            style={{
              background: "linear-gradient(135deg, #CECBF6 0%, #A8A2EE 100%)",
              color: "#534AB7",
              border: "3px solid white",
              boxShadow: "0 0 0 3px rgba(83,74,183,0.15)",
            }}
          >
            {preview || user?.avatar ? (
              <img
                src={preview || user.avatar}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span style={{ letterSpacing: "0.05em" }}>{initials}</span>
            )}
          </div>

          {/* Camera button */}
          <button
            onClick={() => fileRef.current.click()}
            disabled={uploading}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{
              background: uploading ? "#888780" : "#534AB7",
              color: "white",
              boxShadow: "0 2px 8px rgba(83,74,183,0.4)",
            }}
            title="Change photo"
          >
            {uploading ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <HiCamera size={14} />
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </div>

        {/* Info */}
        <div className="text-center sm:text-left flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <h2 className="text-2xl font-semibold text-gray-800 leading-tight">
              {user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : user?.fName && user?.lName
                ? `${user.fName} ${user.lName}`
                : user?.username || "Student"}
            </h2>
            {user?.isVerifiedEmail && (
              <HiBadgeCheck
                size={22}
                style={{ color: "#534AB7", flexShrink: 0 }}
                title="Email verified"
              />
            )}
          </div>

          <p className="text-sm mt-0.5" style={{ color: "#888780" }}>
            @{user?.username}
          </p>

          <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 flex-wrap">
            <span
              className="inline-flex items-center text-xs px-3 py-1 rounded-full font-medium capitalize"
              style={{
                background: role.bg,
                color: role.color,
                border: `0.5px solid ${role.border}`,
              }}
            >
              {role.label}
            </span>

            {user?.gender && (
              <span
                className="inline-flex items-center text-xs px-3 py-1 rounded-full font-medium capitalize"
                style={{
                  background: "#F3F4F6",
                  color: "#6B7280",
                  border: "0.5px solid #E5E7EB",
                }}
              >
                {user.gender}
              </span>
            )}
          </div>
        </div>

        {/* Join date — pushed to the right */}
        {user?.joinDate && (
          <div
            className="sm:ml-auto text-center sm:text-right px-4 py-2 rounded-xl flex-shrink-0"
            style={{ background: "rgba(83,74,183,0.06)", border: "0.5px solid rgba(83,74,183,0.12)" }}
          >
            <p className="text-xs font-medium" style={{ color: "#534AB7" }}>Member since</p>
            <p className="text-sm font-semibold text-gray-700 mt-0.5">
              {new Date(user.joinDate).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;