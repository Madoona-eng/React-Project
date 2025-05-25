import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const PatientLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Patient Panel</h2>
        <nav className="flex flex-col gap-3 text-gray-700 font-medium">
          <Link to="/patient/dashboard" className="hover:text-blue-600 transition">🏠 Dashboard</Link>
          <Link to="/patient/search" className="hover:text-blue-600 transition">🔍 Search Doctors</Link>
          <Link to="/patient/appointments" className="hover:text-blue-600 transition">📅 Appointments</Link>
          <Link to="/patient/profile" className="hover:text-blue-600 transition">👤 Profile</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default PatientLayout;
