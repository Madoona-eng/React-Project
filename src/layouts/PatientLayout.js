import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

const PatientLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // حذف بيانات المستخدم من التخزين المحلي
    localStorage.removeItem("user");

    // تحويل المستخدم لصفحة تسجيل الدخول مع استبدال التاريخ لمنع الرجوع
    navigate("/auth/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
        <aside className="w-64 bg-gray-200 shadow-lg p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Patient Panel</h2>
        <nav className="flex flex-col gap-3 text-gray-700 font-medium">
          <Link to="/patient/dashboard" className="hover:text-blue-600 transition">🏠 Dashboard</Link>
          <Link to="/patient/search" className="hover:text-blue-600 transition">🔍 Search Doctors</Link>
          <Link to="/patient/appointments" className="hover:text-blue-600 transition">📅 Appointments</Link>
          <Link to="/patient/profile" className="hover:text-blue-600 transition">👤 Profile</Link>
          
          {/* زر الخروج */}
          <button
            onClick={handleLogout}
            className="mt-auto bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default PatientLayout;
