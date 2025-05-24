import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const links = [
  { name: "Dashboard", to: "/admin/dashboard", icon: "🏠" },
  { name: "Users", to: "/admin/users", icon: "👥" },
  { name: "Doctors", to: "/admin/doctors", icon: "🩺" },
  { name: "Specialties", to: "/admin/specialties", icon: "📋" },
  { name: "Appointments", to: "/admin/appointments", icon: "📅" },
];

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth tokens or localStorage data here
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    // Redirect to login page
    navigate("/auth/login");
  };

  return (
    <div className="w-64 min-h-screen bg-gray-800 text-gray-100 flex flex-col">
      <div className="text-2xl font-bold p-6 border-b border-gray-700">
        Admin Panel
      </div>
      <nav className="flex flex-col p-4 space-y-2 flex-grow">
        {links.map(({ name, to, icon }) => (
          <NavLink
            key={name}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-700 ${
                isActive ? "bg-gray-700 font-semibold" : ""
              }`
            }
          >
            <span>{icon}</span>
            {name}
          </NavLink>
        ))}
      </nav>
      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded bg-red-600 hover:bg-red-700 transition"
          type="button"
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </div>
  );
}
