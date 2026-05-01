import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api/axios";
import { AppContext } from "../../context/AppContext";

const CATEGORIES = [
  "Web Development", "Mobile Apps", "Data Science",
  "UI/UX Design", "Cybersecurity", "DevOps", "AI & ML",
];

// ✅ Values must match C# enum: Beginner=0, Intermediate=1, Advanced=2
const LEVELS = [
  { label: "Beginner",     value: 0 },
  { label: "Intermediate", value: 1 },
  { label: "Advanced",     value: 2 },
];

const Field = ({ label, required, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "#888780" }}>
      {label} {required && <span style={{ color: "#A32D2D" }}>*</span>}
    </label>
    {children}
  </div>
);

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  fontSize: 14,
  outline: "none",
  border: "0.5px solid rgba(0,0,0,0.12)",
  background: "white",
  color: "#2C2C2A",
  transition: "border 0.15s, box-shadow 0.15s",
};

// Convert File → base64 string
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const AddCourse = () => {
  const navigate = useNavigate();
  const { user } = useContext(AppContext); // ✅ get logged-in user for instructorId
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    level: 0,  // ✅ int matching C# Level enum
    category: "",
    duration: "",
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    if (!form.title.trim()) return "Course title is required";
    if (!form.description.trim()) return "Description is required";
    if (form.description.trim().length < 50) return "Description must be at least 50 characters";
    if (!form.price || isNaN(form.price) || Number(form.price) < 0) return "Valid price is required";
    if (!form.category) return "Please select a category";
    if (!form.duration || isNaN(form.duration) || Number(form.duration) <= 0) return "Duration in minutes is required";
    if (!thumbnail) return "Course thumbnail is required";
    if (!user?.id) return "Instructor ID not found. Please log in again.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    try {
      setLoading(true);
      setError("");

      // Convert image to base64 if provided
      let avatarBase64 = null;
      if (thumbnail) {
        avatarBase64 = await fileToBase64(thumbnail);
      }

      // ✅ FIXED: correct endpoint matches [Area("Instructor")] + [Route("api/[area]/[controller]")] + [HttpPost("addCourse")]
      // → POST /api/instructor/coureses/addCourse
      // ✅ FIXED: send instructorId from logged-in user
      // ✅ FIXED: field names match CreateCourseDTO (PascalCase — ASP.NET handles camelCase automatically)
      await api.post("/instructor/coureses/addCourse", {
        title:        form.title.trim(),
        description:  form.description.trim(),
        price:        Number(form.price),
        level:        Number(form.level),          // ✅ int enum: 0=Beginner,1=Intermediate,2=Advanced
        category:     form.category,
        duration:     parseInt(form.duration, 10), // ✅ int (minutes), [Required] so always set
        avatar:       avatarBase64,                // ✅ [Required] — validation ensures thumbnail exists
        instructorId: Number(user.id),             // ✅ int, from JWT claim
      });

      setSuccess(true);
      setTimeout(() => navigate("/instructor/my-courses"), 1800);
    } catch (err) {
      const data = err.response?.data;
      // Handle both string and object error responses
      if (typeof data === "string") {
        setError(data);
      } else if (data?.message || data?.Message) {
        setError(data.message || data.Message);
      } else if (data?.errors) {
        // ModelState validation errors
        const messages = Object.values(data.errors).flat().join(" | ");
        setError(messages);
      } else {
        setError("Failed to create course. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "#D1FAE5" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
              stroke="#065F46" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-1">Course Created!</h3>
          <p className="text-sm text-gray-500">Redirecting to your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-2">
      <style>{`
        .field-input:focus {
          border: 1px solid #534AB7 !important;
          box-shadow: 0 0 0 3px #EEEDFE;
        }
        .drop-zone { transition: border-color 0.15s, background 0.15s; }
        .drop-zone:hover { border-color: #534AB7; background: #FAFAFE; }
        .submit-btn { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(83,74,183,0.3);
        }
      `}</style>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Add New Course</h1>
        <p className="text-sm mt-1" style={{ color: "#888780" }}>
          Fill in the details to publish your course
        </p>
      </div>

      {/* Error */}
      {error && (
        <div
          className="mb-6 px-4 py-3 rounded-xl text-sm"
          style={{ background: "#FCEBEB", color: "#A32D2D", border: "0.5px solid #F09595" }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* Thumbnail */}
        <Field label="Course Thumbnail">
          <div
            className="drop-zone rounded-2xl overflow-hidden cursor-pointer"
            style={{
              border: "1.5px dashed rgba(83,74,183,0.3)",
              background: preview ? "transparent" : "#FAFAFA",
              minHeight: preview ? "auto" : 160,
            }}
            onClick={() => fileRef.current.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            {preview ? (
              <div className="relative">
                <img src={preview} alt="preview"
                  className="w-full object-cover rounded-2xl"
                  style={{ maxHeight: 220 }} />
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-2xl"
                  style={{ background: "rgba(0,0,0,0.4)" }}
                >
                  <p className="text-white text-sm font-medium">Click to change</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: "#EEEDFE" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="#534AB7" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium" style={{ color: "#534AB7" }}>
                    Drop image here or click to upload
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#B4B2A9" }}>PNG, JPG up to 5MB</p>
                </div>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </Field>

        {/* Title */}
        <Field label="Course Title" required>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Complete React JS Masterclass"
            className="field-input"
            style={inputStyle}
          />
        </Field>

        {/* Description */}
        <Field label="Description" required>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe what students will learn..."
            rows={4}
            className="field-input"
            style={{ ...inputStyle, resize: "none" }}
          />
        </Field>

        {/* Price, Level, Category, Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Price (USD)" required>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium"
                style={{ color: "#888780" }}>$</span>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="29.99"
                className="field-input"
                style={{ ...inputStyle, paddingLeft: 28 }}
              />
            </div>
          </Field>

          <Field label="Level" required>
            <select name="level" value={form.level} onChange={handleChange}
              className="field-input" style={inputStyle}>
              {LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </Field>

          <Field label="Category" required>
            <select name="category" value={form.category} onChange={handleChange}
              className="field-input" style={inputStyle}>
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          <Field label="Duration (minutes)">
            <input
              name="duration"
              type="number"
              min="0"
              value={form.duration}
              onChange={handleChange}
              placeholder="e.g. 120"
              className="field-input"
              style={inputStyle}
            />
          </Field>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/instructor/my-courses")}
            className="px-5 py-2.5 rounded-xl text-sm transition hover:bg-gray-100"
            style={{ border: "0.5px solid rgba(0,0,0,0.1)", color: "#5F5E5A" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="submit-btn px-6 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-60"
            style={{ background: "linear-gradient(135deg,#534AB7 0%,#3C3489 100%)" }}
          >
            {loading ? "Creating..." : "Create Course"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddCourse;