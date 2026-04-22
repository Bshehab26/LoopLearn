import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = form.email.trim();
    const password = form.password.trim();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    // Dummy API simulation
    setTimeout(() => {
      console.log("Login data:", { email, password });
      setLoading(false);
    }, 1500);
  };

  return (
    <AuthLayout
      title="Welcome Back 👋"
      subtitle="Sign in to continue learning"
    >
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        {/* FOOTER */}
         <p className="text-sm text-center text-gray-600">
          if you don't have an account!{" "}
          <Link
            to="/signup"
            className="text-purple-600 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </motion.form>
    </AuthLayout>
  );
};

export default SignIn;