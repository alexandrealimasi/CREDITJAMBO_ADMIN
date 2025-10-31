import React from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  UserIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <HomeIcon className="w-5 h-5" /> },
    { name: "Users", path: "/users", icon: <UserIcon className="w-5 h-5" /> },
    { name: "Transactions", path: "/transactions", icon: <CurrencyDollarIcon className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col shadow-sm">
      {/* Header */}
      <div className="p-6 text-2xl font-bold text-green-600 tracking-tight">
        Admin Panel
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-3 text-gray-700 transition-all duration-150 ${
                    isActive
                      ? "bg-green-50 border-l-4 border-green-600 text-green-600 font-semibold"
                      : "hover:bg-gray-50"
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
