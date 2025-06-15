import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Layouts
import AdminLayout from "../layouts/AdminLayout";
import DoctorLayout from "../layouts/DoctorLayout";
import PatientLayout from "../layouts/PatientLayout";

// Auth Pages
import Login from "../modules/auth/Login";
import Register from "../modules/auth/Register";

// Admin Pages
import AdminDashboard from "../modules/admin/Dashboard";
import Users from "../modules/admin/Users";
import Specialties from "../modules/admin/Specialties";
import AdminLogin from "../modules/admin/AdminLogin";

// Doctor Pages
import DoctorDashboard from "../modules/doctor/Dashboard";
import Availability from "../modules/doctor/Availability";
import DoctorProfile from "../modules/doctor/Profile";

// Patient Pages
import PatientDashboard from "../modules/patient/Dashboard";
import SearchDoctors from "../modules/patient/SearchDoctors";
import Appointments from "../modules/patient/Appointments";
import Booking from "../modules/patient/Booking.jsx";

// Fallback
const NotFound = () => (
  <h1 className="text-center text-red-600 text-3xl mt-10">
    404 - Page Not Found
  </h1>
);

// Helper component for role-based protection
const PrivateRoute = ({ children, allowedRoles }) => {
  const user = useSelector((state) => state.auth.user);
  const token = localStorage.getItem("token");

  if (!user || !token) return <Navigate to="/auth/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/auth/login" />;

  return children;
};

export default function AppRoutes() {
  return (
    <Router>
      <Routes>

        {/* Auth */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute allowedRoles={["Admin"]}>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="specialties" element={<Specialties />} />
        </Route>

        {/* Doctor Routes */}
        <Route
          path="/doctor/*"
          element={
            <PrivateRoute allowedRoles={["Doctor"]}>
              <DoctorLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="availability" element={<Availability />} />
          <Route path="profile" element={<DoctorProfile />} />
        </Route>

        {/* Patient Routes */}
        <Route
          path="/patient/*"
          element={
            <PrivateRoute allowedRoles={["Patient"]}>
              <PatientLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<PatientDashboard />} />
          <Route path="search" element={<SearchDoctors />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="booking" element={<Booking />} /> {/* ← ده الجديد */}
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}
