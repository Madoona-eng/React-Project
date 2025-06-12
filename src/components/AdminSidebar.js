import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth/login");
  };

  const links = [
    { name: "Dashboard", to: "/admin/dashboard", icon: "🏠" },
    { name: "Users", to: "/admin/users", icon: "👥" },
    { name: "Doctors", to: "/admin/doctors", icon: "🩺" },
    { name: "Specialties", to: "/admin/specialties", icon: "📋" },
    { name: "Appointments", to: "/admin/appointments", icon: "📅" },
  ];

  return (
    <div className="w-64 min-h-screen bg-gray-800 text-gray-100 flex flex-col">
      
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>

      {/* Navigation + Logout */}
      <nav className="p-4 space-y-2">
        {links.map(({ name, to, icon }) => (
          <NavLink
            key={name}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md transition-all ${
                isActive ? "bg-gray-700 font-semibold" : "hover:bg-gray-700"
              }`
            }
          >
            <span className="text-lg">{icon}</span>
            <span>{name}</span>
          </NavLink>
        ))}

        {/* Logout directly below last nav item */}
        <button
          onClick={handleLogout}
          className="mt-2 w-full flex items-center gap-3 px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition-all"
        >
          <span className="text-lg">🚪</span>
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
}
