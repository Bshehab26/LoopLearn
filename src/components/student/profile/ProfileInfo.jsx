import { useState } from "react";
import { HiPencil, HiCheck, HiX } from "react-icons/hi";

const Field = ({ label, value, name, type = "text", editing, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "#888780" }}>
      {label}
    </label>
    {editing ? (
      <input
        type={type}
        name={name}
        defaultValue={value}
        onChange={onChange}
        className="px-3 py-2 rounded-lg text-sm outline-none transition"
        style={{
          border: "1px solid rgba(83,74,183,0.3)",
          background: "#FAFAFA",
          color: "#2C2C2A",
        }}
      />
    ) : (
      <p className="text-sm py-2" style={{ color: "#444441" }}>
        {value || <span style={{ color: "#B4B2A9" }}>Not provided</span>}
      </p>
    )}
  </div>
);

const ProfileInfo = ({ user, onSave, loading }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fName: user?.fName || "",
    lName: user?.lName || "",
    phone: user?.phone || "",
    email: user?.email || "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    await onSave(form);
    setEditing(false);
  };

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.08)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-gray-800">Personal Information</h3>
        <div className="flex items-center gap-2">
          {editing ? (
            <>
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition hover:bg-gray-50"
                style={{ border: "0.5px solid rgba(0,0,0,0.1)", color: "#888780" }}
              >
                <HiX size={14} /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm text-white transition hover:opacity-90"
                style={{ background: "#534AB7" }}
              >
                <HiCheck size={14} />
                {loading ? "Saving..." : "Save"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition hover:bg-purple-50"
              style={{ border: "0.5px solid #534AB7", color: "#534AB7" }}
            >
              <HiPencil size={14} /> Edit
            </button>
          )}
        </div>
      </div>

      {/* Fields grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field
          label="First Name"
          name="fName"
          value={editing ? form.fName : user?.fName}
          editing={editing}
          onChange={handleChange}
        />
        <Field
          label="Last Name"
          name="lName"
          value={editing ? form.lName : user?.lName}
          editing={editing}
          onChange={handleChange}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          value={editing ? form.email : user?.email}
          editing={editing}
          onChange={handleChange}
        />
        <Field
          label="Phone"
          name="phone"
          value={editing ? form.phone : user?.phone}
          editing={editing}
          onChange={handleChange}
        />
      </div>

      {/* Stats row */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6"
        style={{ borderTop: "0.5px solid rgba(0,0,0,0.06)" }}
      >
        <div className="text-center">
          <p className="text-2xl font-semibold" style={{ color: "#534AB7" }}>
            {user?.enrolledCourses ?? 0}
          </p>
          <p className="text-xs mt-1" style={{ color: "#888780" }}>Enrolled Courses</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold" style={{ color: "#534AB7" }}>
            {user?.completedCourses ?? 0}
          </p>
          <p className="text-xs mt-1" style={{ color: "#888780" }}>Completed</p>
        </div>
        <div className="text-center col-span-2 sm:col-span-1">
          <p className="text-2xl font-semibold" style={{ color: "#534AB7" }}>
            {user?.certificates ?? 0}
          </p>
          <p className="text-xs mt-1" style={{ color: "#888780" }}>Certificates</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
