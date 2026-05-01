import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { register } from "../../services/api/auth.api";
import { AppContext } from "../../context/AppContext";

const SignUp = () => {
  const navigate = useNavigate();
  const { loginUser } = useContext(AppContext);

  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    gender: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (loading) return;
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      username, firstName, lastName, phone,
      email, gender, birthDate, password, confirmPassword,
    } = form;

    /* ================= VALIDATION ================= */
    if (!username || !firstName || !lastName || !phone ||
        !email || !gender || !birthDate || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!/^01[0125]\d{8}$/.test(phone)) {
      setError("Invalid Egyptian phone number");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    /* ================= PAYLOAD ================= */
    const payload = {
      username,
      // ✅ FIX: Use fName / lName to match backend RegisterDTO field names
      // ASP.NET camelCase serializer maps fName -> FName, lName -> LName
      fName: firstName,
      lName: lastName,
      phone,
      email,
      // ✅ FIX: Send gender as the exact enum name string ("Male" / "Female")
      // This works if your backend has AddJsonOptions(o => o.JsonSerializerOptions
      // .Converters.Add(new JsonStringEnumConverter())) configured.
      // If not, change the <select> values to 0 / 1 to send numeric enum instead.
      gender,
      // ✅ FIX: Send birthDate as ISO 8601 string — ASP.NET DateTime binding parses this correctly
      birthDate,
      password,
      confirmPassword,
    };

    try {
      setLoading(true);

      const res = await register(payload);
      const data = res.data;

      // Let loginUser handle saving to localStorage (AppContext)
      loginUser({
        token: data.token,
        username: data.username,
        email: data.email,
        role: data.role,
      });

      setForm({
        username: "", firstName: "", lastName: "", phone: "",
        email: "", gender: "", birthDate: "", password: "", confirmPassword: "",
      });

      navigate("/");

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.Message ||
        err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(" ")
          : "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create account ✨"
      subtitle="Join and start learning today"
      mode="signup"
    >
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          disabled={loading}
          className="w-full p-3 border rounded-lg disabled:opacity-50"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            disabled={loading}
            className="p-3 border rounded-lg disabled:opacity-50"
          />
          <input
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            disabled={loading}
            className="p-3 border rounded-lg disabled:opacity-50"
          />
        </div>

        <input
          name="phone"
          placeholder="01XXXXXXXXX"
          value={form.phone}
          onChange={(e) => {
            if (loading) return;
            const value = e.target.value.replace(/\D/g, "");
            setForm((prev) => ({ ...prev, phone: value }));
            setError("");
          }}
          disabled={loading}
          className="w-full p-3 border rounded-lg disabled:opacity-50"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          disabled={loading}
          className="w-full p-3 border rounded-lg disabled:opacity-50"
        />

        {/* ✅ FIX: Values are "Male" / "Female" matching the Gender enum names exactly */}
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          disabled={loading}
          className="w-full p-3 border rounded-lg disabled:opacity-50"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <input
          name="birthDate"
          type="date"
          value={form.birthDate}
          onChange={handleChange}
          disabled={loading}
          className="w-full p-3 border rounded-lg disabled:opacity-50"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          disabled={loading}
          className="w-full p-3 border rounded-lg disabled:opacity-50"
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          disabled={loading}
          className="w-full p-3 border rounded-lg disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/signin" className="text-purple-600 font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </motion.form>
    </AuthLayout>
  );
};

export default SignUp;