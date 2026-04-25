import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { login } from "../../services/api/auth.api";
import { AppContext } from "../../context/AppContext";

const SignIn = () => {
  const navigate = useNavigate();
  const { loginUser } = useContext(AppContext);

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    if (loading) return;

    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const identifier = form.identifier.trim();
    const password = form.password.trim();

    // validation
    if (!identifier || !password) {
      setError("Username or Email and Password are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const isEmail = identifier.includes("@");

    const payload = {
      username: isEmail ? "" : identifier,
      email: isEmail ? identifier : "",
      password,
    };

    try {
      setLoading(true);

      const res = await login(payload);
      const data = res.data;

      // save auth
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);
      localStorage.setItem("email", data.email);

      // update context
      loginUser({
        token: data.token,
        username: data.username,
        role: data.role,
        email: data.email,
      });

      // reset form
      setForm({
        identifier: "",
        password: "",
      });

      // redirect
      const role = data.role?.toLowerCase();

      if (role === "student") navigate("/");
      else if (role === "instructor") navigate("/instructor");
      else navigate("/");

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <AuthLayout
      title="Welcome back 👋"
      subtitle="Sign in to continue learning"
      mode="signin"
    >
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >

        {error && (
          <p className="text-red-500 text-sm text-center">
            {error}
          </p>
        )}

        {/* USERNAME / EMAIL */}
        <input
          name="identifier"
          type="text"
          placeholder="Username or Email"
          value={form.identifier}
          onChange={handleChange}
          disabled={loading}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-600 outline-none disabled:opacity-50"
        />

        {/* PASSWORD */}
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          disabled={loading}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-600 outline-none disabled:opacity-50"
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