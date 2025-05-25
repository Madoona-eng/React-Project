import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-blue-900 text-white flex flex-col
          transform transition-transform duration-300 ease-in-out
          md:static md:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          relative
        `}
      >
        <div className="text-2xl font-bold p-6 border-b border-blue-700 flex justify-between items-center flex-shrink-0">
          Admin Panel
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white text-2xl leading-none"
            aria-label="Close sidebar"
          >
            &times;
          </button>
        </div>

        {/* Scrollable nav container */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-3 pb-20">
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

        {/* Fixed Logout button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700 bg-blue-900 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full p-2 bg-red-600 hover:bg-red-700 rounded"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for small screens */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100 min-h-screen md:ml-64">
        {/* Hamburger menu button on small screens */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden mb-4 p-2 bg-blue-900 text-white rounded"
          aria-label="Open sidebar"
        >
          &#9776;
        </button>

        <Outlet />
      </main>
    </div>
  );
}
