import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();
    const gender = form.gender;
    const password = form.password.trim();
    const confirmPassword = form.confirmPassword.trim();

    if (!name || !email || !gender || !password || !confirmPassword) {
      setError("All fields are required");
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

    // 🔁 Dummy API (ready for backend)
    console.log("Register data:", {
      name,
      email,
      gender,
      password,
    });
  };

  return (
    <AuthLayout
      title="Create Account ✨"
      subtitle="Join and start learning today"
    >
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        {/* NAME */}
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
        />

        {/* EMAIL */}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
        />

        {/* GENDER */}
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-purple-600 outline-none"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="prefer_not_to_say">Prefer not to say</option>
        </select>

        {/* PASSWORD */}
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
        />

        {/* CONFIRM PASSWORD */}
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
        />

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Sign Up
        </button>

        {/* FOOTER */}
        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-purple-600 font-medium hover:underline"
          >
            Sign In
          </Link>
        </p>
      </motion.form>
    </AuthLayout>
  );
};

export default SignUp;