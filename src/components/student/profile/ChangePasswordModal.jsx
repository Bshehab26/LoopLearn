import { useState } from "react";
import { HiEye, HiEyeOff, HiX } from "react-icons/hi";

const PasswordInput = ({ label, name, value, onChange, show, onToggle }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "#888780" }}>
      {label}
    </label>
    <div
      className="flex items-center gap-2 px-3 rounded-lg"
      style={{ border: "1px solid rgba(83,74,183,0.2)", background: "#FAFAFA", height: "42px" }}
    >
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        className="flex-1 bg-transparent outline-none text-sm"
        style={{ color: "#2C2C2A" }}
      />
      <button type="button" onClick={onToggle} style={{ color: "#888780" }}>
        {show ? <HiEyeOff size={16} /> : <HiEye size={16} />}
      </button>
    </div>
  </div>
);

const ChangePasswordModal = ({ onClose, onSubmit, loading }) => {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState({
    old: false, new: false, confirm: false,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (form.newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    await onSubmit({ oldPassword: form.oldPassword, newPassword: form.newPassword });
  };

  return (
    // Overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.3)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6"
        style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.08)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-semibold text-gray-800">Change Password</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
            style={{ color: "#888780" }}
          >
            <HiX size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <p className="text-sm text-center py-2 px-3 rounded-lg"
              style={{ background: "#FCEBEB", color: "#A32D2D" }}>
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
          />
          <PasswordInput
            label="New Password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            show={show.new}
            onToggle={() => setShow((p) => ({ ...p, new: !p.new }))}
          />
          <PasswordInput
            label="Confirm New Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            show={show.confirm}
            onToggle={() => setShow((p) => ({ ...p, confirm: !p.confirm }))}
          />

          {/* Password strength hint */}
          {form.newPassword && (
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex-1 h-1 rounded-full transition-all"
                  style={{
                    background:
                      form.newPassword.length >= i * 3
                        ? i <= 1 ? "#E24B4A"
                        : i <= 2 ? "#EF9F27"
                        : i <= 3 ? "#1D9E75"
                        : "#534AB7"
                        : "#F1EFE8",
                  }}
                />
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-sm font-medium text-white mt-2 transition hover:opacity-90"
            style={{ background: "#534AB7" }}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
