import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice";
import { loginAdmin } from "../services/adminService";
import { notifyError, notifySuccess } from "../utils/toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginAdmin(email, password);
      dispatch(loginSuccess(data));
      localStorage.setItem("adminToken", data.token);
      notifySuccess("Login Successful!");
      window.location.href = "/dashboard";
    } catch (err) {
      notifyError("Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-green-600 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            Admin Login
          </h1>
          <p className="text-gray-500 text-sm">
            Sign in to your admin dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2 font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-white font-semibold transition-colors duration-200 ${
              loading ? "bg-green-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Admin Panel. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
