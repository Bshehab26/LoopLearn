import React, { Component } from "react";

export class SignUP extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    error: "",
    loading: false,
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      error: "",
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = this.state;

    // ✅ validation
    if (!name || !email || !password || !confirmPassword) {
      return this.setState({ error: "All fields are required" });
    }

    if (password.length < 6) {
      return this.setState({
        error: "Password must be at least 6 characters",
      });
    }

    if (password !== confirmPassword) {
      return this.setState({ error: "Passwords do not match" });
    }

    this.setState({ loading: true });

    // 🔁 simulate API call
    setTimeout(() => {
      console.log("User registered:", {
        name,
        email,
        password,
      });

      this.setState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        loading: false,
      });
    }, 1500);
  };

  render() {
    const {
      name,
      email,
      password,
      confirmPassword,
      error,
      loading,
    } = this.state;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <form
          onSubmit={this.handleSubmit}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-bold text-center mb-6">
            Create Account
          </h2>

          {/* ERROR */}
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">
              {error}
            </p>
          )}

          {/* NAME */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={this.handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your name"
            />
          </div>

          {/* EMAIL */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={this.handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your email"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={this.handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter password"
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="mb-6">
            <label className="block text-sm mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={this.handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Confirm password"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>

          {/* FOOTER */}
          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <span className="text-purple-600 cursor-pointer">
              Sign In
            </span>
          </p>
        </form>
      </div>
    );
  }
}

export default SignUP;