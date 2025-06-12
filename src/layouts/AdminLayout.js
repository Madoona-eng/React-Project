import React, { useState } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarCheck,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    navigate("/admin/login");
  };

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/admin/users", label: "Users", icon: <Users size={20} /> },
    { path: "/admin/specialties", label: "Specialties", icon: <Stethoscope size={20} /> },
    { path: "/admin/appointments", label: "Appointments", icon: <CalendarCheck size={20} /> },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-gradient-to-br from-blue-900 to-indigo-800 text-white flex flex-col
          transform transition-transform duration-300 ease-in-out z-50
          md:static md:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue-700">
          <h1 className="text-xl font-bold tracking-wide">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
          <nav className="p-4 space-y-2">
            {navItems.map(({ path, label, icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-lg transition hover:bg-blue-700 ${
                    isActive ? "bg-blue-700 font-semibold" : ""
                  }`
                }
              >
                {icon}
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-blue-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 min-h-screen p-6 md:ml-64">
        {/* Hamburger for mobile */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden mb-4 p-2 bg-blue-900 text-white rounded-lg"
        >
          <Menu size={24} />
        </button>

        <Outlet />
      </main>
    </div>
  );
}
