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
    if (loading) return; // prevent changes during submit

    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      username,
      firstName,
      lastName,
      phone,
      email,
      gender,
      birthDate,
      password,
      confirmPassword,
    } = form;

    /* ================= VALIDATION ================= */

    if (
      !username ||
      !firstName ||
      !lastName ||
      !phone ||
      !email ||
      !gender ||
      !birthDate ||
      !password ||
      !confirmPassword
    ) {
      setError("All fields are required");
      return;
    }

    if (!/^01[0-2,5]\d{8}$/.test(phone)) {
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
      fName: firstName,
      lName: lastName,
      phone,
      email,
      gender,
      birthDate,
      password,
      confirmPassword,
    };

    try {
      setLoading(true);

      const res = await register(payload);
      const data = res.data;

      loginUser({
        token: data.token,
        username: data.username,
        email: data.email,
        role: data.role,
      });

      // reset form (IMPORTANT)
      setForm({
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

      navigate("/");

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Registration failed"
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

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            className="p-3 border rounded-lg"
          />
          <input
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            className="p-3 border rounded-lg"
          />
        </div>

        <input
          name="phone"
          placeholder="01XXXXXXXXX"
          value={form.phone}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setForm((prev) => ({ ...prev, phone: value }));
            setError("");
          }}
          className="w-full p-3 border rounded-lg"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
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
          className="w-full p-3 border rounded-lg"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />
 {error && (
          <p className="text-red-500 text-sm text-center">
            {error}
          </p>
        )}
        <button
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg disabled:opacity-50"
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