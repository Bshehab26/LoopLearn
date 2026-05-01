// src/components/student/profile/ChangePasswordModal.jsx
// Place this file at: src/components/student/profile/ChangePasswordModal.jsx

import { useState } from "react";
import { HiEye, HiEyeOff, HiX, HiLockClosed } from "react-icons/hi";

const strengthConfig = [
  { label: "Weak",   color: "#E24B4A" },
  { label: "Fair",   color: "#EF9F27" },
  { label: "Good",   color: "#1D9E75" },
  { label: "Strong", color: "#534AB7" },
];

const getStrength = (password) => {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8)  score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(4, Math.ceil(score / 1.25));
};

const PasswordInput = ({ label, name, value, onChange, show, onToggle, hint }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#9896A4" }}>
      {label}
    </label>
    <div
      className="flex items-center gap-2 px-3 rounded-xl transition-all"
      style={{
        border: "1px solid rgba(83,74,183,0.25)",
        background: "#FAFAFE",
        height: "44px",
      }}
      onFocusWithin={(e) => {
        e.currentTarget.style.border = "1px solid #534AB7";
        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(83,74,183,0.1)";
      }}
    >
      <HiLockClosed size={14} style={{ color: "#C4C2BA", flexShrink: 0 }} />
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={hint}
        className="flex-1 bg-transparent outline-none text-sm"
        style={{ color: "#2C2C2A" }}
        onFocus={(e) => {
          const parent = e.target.closest("div");
          parent.style.border = "1px solid #534AB7";
          parent.style.boxShadow = "0 0 0 3px rgba(83,74,183,0.1)";
        }}
        onBlur={(e) => {
          const parent = e.target.closest("div");
          parent.style.border = "1px solid rgba(83,74,183,0.25)";
          parent.style.boxShadow = "none";
        }}
      />
      <button
        type="button"
        onClick={onToggle}
        className="flex-shrink-0 transition hover:opacity-70"
        style={{ color: "#888780" }}
      >
        {show ? <HiEyeOff size={15} /> : <HiEye size={15} />}
      </button>
    </div>
  </div>
);

const ChangePasswordModal = ({ onClose, onSubmit, loading }) => {
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [show, setShow] = useState({ old: false, new: false, confirm: false });
  const [error, setError] = useState("");

  const strength = getStrength(form.newPassword);
  const strengthInfo = strengthConfig[strength - 1];

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (form.newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    await onSubmit({ oldPassword: form.oldPassword, newPassword: form.newPassword });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: "white",
          border: "0.5px solid rgba(0,0,0,0.08)",
          boxShadow: "0 24px 48px rgba(0,0,0,0.15)",
        }}
      >
        {/* Accent bar */}
        <div
          className="h-1 w-full"
          style={{ background: "linear-gradient(90deg, #534AB7 0%, #8B82E8 50%, #C4BFFF 100%)" }}
        />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "#EEEDFE" }}
              >
                <HiLockClosed size={16} style={{ color: "#534AB7" }} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-800">Change Password</h3>
                <p className="text-xs" style={{ color: "#9896A4" }}>Keep your account secure</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center transition hover:bg-gray-100 active:scale-95"
              style={{ color: "#888780" }}
            >
              <HiX size={15} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <p
                className="text-sm text-center py-2.5 px-3 rounded-xl"
                style={{ background: "#FCEBEB", color: "#A32D2D", border: "0.5px solid #F09595" }}
              >
                {error}
              </p>
            )}

            <PasswordInput
              label="Current Password"
              name="oldPassword"
              value={form.oldPassword}
              onChange={handleChange}
              show={show.old}
              onToggle={() => setShow((p) => ({ ...p, old: !p.old }))}
              hint="Enter your current password"
            />
            <PasswordInput
              label="New Password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              show={show.new}
              onToggle={() => setShow((p) => ({ ...p, new: !p.new }))}
              hint="Minimum 8 characters"
            />

            {/* Strength bar */}
            {form.newPassword && (
              <div className="flex flex-col gap-1.5 -mt-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex-1 h-1.5 rounded-full transition-all duration-300"
                      style={{
                        background: i <= strength ? strengthInfo?.color : "#F1EFE8",
                      }}
                    />
                  ))}
                </div>
                {strengthInfo && (
                  <p className="text-xs font-medium" style={{ color: strengthInfo.color }}>
                    {strengthInfo.label} password
                  </p>
                )}
              </div>
            )}

            <PasswordInput
              label="Confirm New Password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              show={show.confirm}
              onToggle={() => setShow((p) => ({ ...p, confirm: !p.confirm }))}
              hint="Re-enter your new password"
            />

            {/* Match indicator */}
            {form.newPassword && form.confirmPassword && (
              <p
                className="text-xs -mt-1 font-medium"
                style={{
                  color: form.newPassword === form.confirmPassword ? "#1D9E75" : "#E24B4A",
                }}
              >
                {form.newPassword === form.confirmPassword ? "✓ Passwords match" : "✗ Passwords don't match"}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white mt-1 transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #534AB7 0%, #7B74D4 100%)" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating…
                </span>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;