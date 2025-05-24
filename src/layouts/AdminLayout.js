import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="text-2xl font-bold p-6 border-b border-blue-700">
          Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-3">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `block p-2 rounded hover:bg-blue-700 ${
                isActive ? "bg-blue-700 font-semibold" : ""
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `block p-2 rounded hover:bg-blue-700 ${
                isActive ? "bg-blue-700 font-semibold" : ""
              }`
            }
          >
            Users
          </NavLink>
          <NavLink
            to="/admin/specialties"
            className={({ isActive }) =>
              `block p-2 rounded hover:bg-blue-700 ${
                isActive ? "bg-blue-700 font-semibold" : ""
              }`
            }
          >
            Specialties
          </NavLink>
        </nav>
        <button
          onClick={handleLogout}
          className="m-4 p-2 bg-red-600 hover:bg-red-700 rounded"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}
