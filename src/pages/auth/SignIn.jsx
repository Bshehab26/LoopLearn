import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { login } from "../../services/api/auth.api";

const SignIn = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    identifier: "", // username OR email
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const identifier = form.identifier.trim();
    const password = form.password.trim();

    // ✅ Validation
    if (!identifier || !password) {
      setError("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // ✅ Detect if identifier is email or username
    const isEmail = identifier.includes("@");

    const payload = {
      username: isEmail ? "" : identifier,
      email: isEmail ? identifier : "",
      password: password,
    };

    try {
      setLoading(true);
      const res = await login(payload);

      // ✅ Save token to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.username);

      // ✅ Redirect based on role
      const role = res.data.role?.toLowerCase();
      if (role === "student") navigate("/");
      else if (role === "instructor") navigate("/instructor");
      else navigate("/");

    } catch (err) {
      const data = err.response?.data;
      if (data?.message) {
        setError(data.message);
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
   <AuthLayout title="Welcome back 👋" subtitle="Sign in to continue learning" mode="signin">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        {/* USERNAME OR EMAIL */}
        <input
          type="text"
          name="identifier"
          placeholder="Username or Email"
          value={form.identifier}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
        />

        {/* PASSWORD */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
        />

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {/* FOOTER */}
        <p className="text-sm text-center text-gray-600">
          Don't have an account?{" "}
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