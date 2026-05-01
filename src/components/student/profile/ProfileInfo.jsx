// src/components/student/profile/ProfileInfo.jsx

import { useState, useEffect } from "react";
import { HiPencil, HiCheck, HiX, HiAcademicCap, HiStar, HiDocumentText } from "react-icons/hi";

const Field = ({ label, value, name, type = "text", editing, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#9896A4" }}>
      {label}
    </label>
    {editing ? (
      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        className="px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
        style={{ border: "1px solid rgba(83,74,183,0.35)", background: "#FAFAFE", color: "#2C2C2A" }}
        onFocus={(e) => {
          e.target.style.border = "1px solid #534AB7";
          e.target.style.boxShadow = "0 0 0 3px rgba(83,74,183,0.1)";
        }}
        onBlur={(e) => {
          e.target.style.border = "1px solid rgba(83,74,183,0.35)";
          e.target.style.boxShadow = "none";
        }}
      />
    ) : (
      <p className="text-sm py-2.5 px-0.5 font-medium" style={{ color: value ? "#2C2C2A" : "#C4C2BA" }}>
        {value || "Not provided"}
      </p>
    )}
  </div>
);

const StatCard = ({ icon: Icon, value, label, color }) => (
  <div
    className="flex flex-col items-center justify-center p-4 rounded-2xl transition-transform hover:-translate-y-0.5"
    style={{ background: `${color}10`, border: `0.5px solid ${color}30` }}
  >
    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ background: `${color}20` }}>
      <Icon size={18} style={{ color }} />
    </div>
    <p className="text-2xl font-bold" style={{ color }}>{value ?? 0}</p>
    <p className="text-xs mt-0.5 font-medium text-center" style={{ color: "#888780" }}>{label}</p>
  </div>
);

const ProfileInfo = ({ user, onSave, loading }) => {
  const [editing, setEditing] = useState(false);

  // ✅ Normalize: backend returns firstName/lastName, local state uses fName/lName
  const normalize = (u) => ({
    fName: u?.firstName || u?.fName || "",
    lName: u?.lastName  || u?.lName  || "",
    phone: u?.phone  || "",
    email: u?.email  || "",
  });

  const [form, setForm] = useState(() => normalize(user));

  // Re-sync if user prop updates (e.g. after save)
  useEffect(() => {
    setForm(normalize(user));
  }, [user]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    await onSave(form);   // sends { fName, lName, email, phone } → profile.api.js maps to firstName/lastName
    setEditing(false);
  };

  const handleCancel = () => {
    setForm(normalize(user));
    setEditing(false);
  };

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.08)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-gray-800">Personal Information</h3>
          <p className="text-xs mt-0.5" style={{ color: "#9896A4" }}>
            {editing ? "Make your changes below" : "Your account details"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {editing ? (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition hover:bg-gray-50 active:scale-95"
                style={{ border: "0.5px solid rgba(0,0,0,0.12)", color: "#888780" }}
              >
                <HiX size={13} /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm text-white font-medium transition hover:opacity-90 active:scale-95 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #534AB7 0%, #7B74D4 100%)" }}
              >
                <HiCheck size={13} />
                {loading ? "Saving…" : "Save"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition hover:bg-purple-50 active:scale-95"
              style={{ border: "0.5px solid #534AB7", color: "#534AB7" }}
            >
              <HiPencil size={13} /> Edit
            </button>
          )}
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="First Name" name="fName" value={editing ? form.fName : (user?.firstName || user?.fName)} editing={editing} onChange={handleChange} />
        <Field label="Last Name"  name="lName" value={editing ? form.lName : (user?.lastName  || user?.lName)}  editing={editing} onChange={handleChange} />
        <Field label="Email Address" name="email" type="email" value={editing ? form.email : user?.email} editing={editing} onChange={handleChange} />
        <Field label="Phone Number"  name="phone" value={editing ? form.phone : user?.phone} editing={editing} onChange={handleChange} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mt-6 pt-6" style={{ borderTop: "0.5px solid rgba(0,0,0,0.06)" }}>
        <StatCard icon={HiAcademicCap} value={user?.enrolledCourses}  label="Enrolled"     color="#534AB7" />
        <StatCard icon={HiStar}        value={user?.completedCourses} label="Completed"    color="#1D9E75" />
        <StatCard icon={HiDocumentText} value={user?.certificates}    label="Certificates" color="#B45309" />
      </div>
    </div>
  );
};

export default ProfileInfo;