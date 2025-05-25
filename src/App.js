import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./modules/auth/Login";
import Register from "./modules/auth/Register";

import AdminSidebar from "./components/AdminSidebar";
import Dashboard from "./modules/admin/Dashboard";
import Users from "./modules/admin/Users";
import Doctors from "./modules/admin/Doctors";
import Specialties from "./modules/admin/Specialties";
import Appointments from "./modules/admin/Appointments";

import PatientAppointments from "./modules/patient/Appointments";
import PatientDashboard from "./modules/patient/Dashboard";
import PatientProfile from "./modules/patient/Profile";
import PatientSearch from "./modules/patient/SearchDoctors";
import PatientBooking from "./modules/patient/Booking";

import PatientLayout from "./layouts/PatientLayout";

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-grow p-6">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="specialties" element={<Specialties />} />
          <Route path="appointments" element={<Appointments />} />
          <Route
            path="*"
            element={
              <div className="text-center mt-10 text-2xl text-red-600">
                Admin Page Not Found
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />

        {/* Auth routes */}
        <Route
          path="/auth/*"
          element={
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
              <Routes>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route
                  path="*"
                  element={
                    <div className="text-center mt-10 text-2xl text-red-600">
                      404 - Auth Page Not Found
                    </div>
                  }
                />
              </Routes>
            </div>
          }
        />

        {/* Admin routes */}
        <Route path="/admin/*" element={<AdminLayout />} />

        {/* Patient routes */}
        <Route path="/patient/*" element={<PatientLayout />}>
          <Route path="dashboard" element={<PatientDashboard />} />
          <Route path="appointments" element={<PatientAppointments />} />
          <Route path="profile" element={<PatientProfile />} />
          <Route path="search" element={<PatientSearch />} />
          <Route path="booking" element={<PatientBooking />} />

          <Route
            path="*"
            element={
              <div className="text-center mt-10 text-2xl text-red-600">
                Patient Page Not Found
              </div>
            }
          />
        </Route>

        {/* Catch all */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center text-3xl text-red-600">
              404 - Page Not Found
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
