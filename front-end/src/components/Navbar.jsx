import React from "react";
import { FiLogOut, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear stored token or any user info
    localStorage.removeItem("adminToken"); // adjust key based on your app
    // Optionally clear other state
    // Redirect to login page
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm px-6 py-3 flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-800 tracking-tight">
        Admin Dashboard
      </h2>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
            <FiUser className="text-green-600 text-lg" />
          </div>
          <span className="text-gray-700 font-medium hidden sm:block">
            Admin
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          <FiLogOut />
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
