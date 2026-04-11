import React, { Component } from "react";

export class SignIn extends Component {
  state = {
    email: "",
    password: "",
    error: "",
    loading: false,
  };

  // handle input change
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      error: "",
    });
  };

  // handle submit
  handleSubmit = (e) => {
    e.preventDefault();

    const { email, password } = this.state;

    // basic validation
    if (!email || !password) {
      return this.setState({ error: "All fields are required" });
    }

    this.setState({ loading: true });

    // simulate API call
    setTimeout(() => {
      console.log("Login data:", { email, password });

      this.setState({
        loading: false,
        email: "",
        password: "",
      });
    }, 1500);
  };

  render() {
    const { email, password, error, loading } = this.state;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <form
          onSubmit={this.handleSubmit}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-bold text-center mb-6">
            Sign In
          </h2>

          {/* ERROR */}
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">
              {error}
            </p>
          )}

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
          <div className="mb-6">
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={this.handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your password"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* FOOTER */}
          <p className="text-sm text-center mt-4">
            Don’t have an account?{" "}
            <span className="text-purple-600 cursor-pointer">
              Sign Up
            </span>
          </p>
        </form>
      </div>
    );
  }
}

export default SignIn;