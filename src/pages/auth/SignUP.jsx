import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { register } from "../../services/api/auth.api";

const SignUp = () => {
  const navigate = useNavigate();

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
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (Object.values(form).some((v) => !v)) {
      setError("All fields are required");
      return;
    }

    if (!/^01[0-2,5]{1}[0-9]{8}$/.test(form.phone)) {
      setError("Invalid Egyptian phone number");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // ✅ Clean camelCase payload (backend now supports it)
    const payload = {
      username: form.username,
      fName: form.firstName,
      lName: form.lastName,
      phone: form.phone,
      email: form.email,
      gender: form.gender, // MUST be "Male" or "Female"
      birthDate: form.birthDate,
      password: form.password,
      confirmPassword: form.confirmPassword,
    };

    try {
      setLoading(true);

      const res = await register(payload);

      console.log("SUCCESS:", res.data);

      navigate("/");
    } catch (err) {
      console.log("FULL ERROR:", err.response?.data);

      const data = err.response?.data;

      if (data?.errors) {
        setError(Object.values(data.errors).flat().join(" | "));
      } else if (data?.message) {
        setError(data.message);
      } else {
        setError("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
   <AuthLayout title="Create account ✨" subtitle="Join and start learning today" mode="signup" >
      <motion.form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input name="username" placeholder="Username" onChange={handleChange} className="w-full p-3 border rounded-lg" />

        <div className="grid grid-cols-2 gap-4">
          <input name="firstName" placeholder="First Name" onChange={handleChange} className="p-3 border rounded-lg" />
          <input name="lastName" placeholder="Last Name" onChange={handleChange} className="p-3 border rounded-lg" />
        </div>

        <input
          name="phone"
          placeholder="01XXXXXXXXX"
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setForm((prev) => ({ ...prev, phone: value }));
          }}
          className="w-full p-3 border rounded-lg"
        />

        <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full p-3 border rounded-lg" />

        <select name="gender" onChange={handleChange} className="w-full p-3 border rounded-lg">
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <input name="birthDate" type="date" onChange={handleChange} className="w-full p-3 border rounded-lg" />

        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full p-3 border rounded-lg" />

        <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} className="w-full p-3 border rounded-lg" />

        <button disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-lg">
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="text-center text-sm">
          Already have an account? <Link to="/signin"  className="text-purple-600 font-medium hover:underline"
          >Sign In</Link>
        </p>
      </motion.form>
    </AuthLayout>
  );
};

export default SignUp;