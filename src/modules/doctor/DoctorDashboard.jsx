import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import { motion } from 'framer-motion';
import { FiUser, FiLogOut } from 'react-icons/fi';
import axios from 'axios';

const DoctorDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Optionally handle not logged in
      return;
    }
    fetch('http://127.0.0.1:8000/api/doctors/my_profile/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          res.json().then(err => console.error('Doctor profile fetch error:', err));
          throw new Error('Failed to fetch doctor profile.');
        }
        return res.json();
      })
      .then((data) => {
        setProfile(data);
      })
      .catch((error) => {
        console.error("Error fetching doctor profile:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Optional: clear auth token
    navigate('/auth/login');
  };

  if (loading) {
    return <div className="text-center p-6">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="text-center p-6 text-red-500">Failed to load profile.</div>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-dark-900 text-white p-4">
        <div className="flex flex-col items-center mb-8 pt-4">
          <motion.div
            className="w-16 h-16 rounded-full mb-3 overflow-hidden border-4 border-white shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            {profile?.user?.image ? (
              <img
                src={
                  profile.user.image.startsWith('http')
                    ? profile.user.image
                    : `http://localhost:8000${profile.user.image}`
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-blue-700 flex items-center justify-center">
                <FiUser className="w-8 h-8 text-white" />
              </div>
            )}
          </motion.div>
          <h3 className="font-semibold text-center">
            Dr. {profile?.user?.full_name || profile?.user?.username || 'Name not available'}
          </h3>

        </div>

        <h2 className="text-2xl font-bold mb-8">Doctor Portal</h2>

        <nav>
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/doctor"
                end
                className={({ isActive }) =>
                  `block p-2 rounded hover:bg-primary-700 ${isActive ? 'bg-primary-600' : ''}`
                }
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/doctor/appointments"
                className={({ isActive }) =>
                  `block p-2 rounded hover:bg-primary-700 ${isActive ? 'bg-primary-600' : ''}`
                }
              >
                Appointments
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/doctor/availability"
                className={({ isActive }) =>
                  `block p-2 rounded hover:bg-primary-700 ${isActive ? 'bg-primary-600' : ''}`
                }
              >
                Availability
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/doctor/profile"
                className={({ isActive }) =>
                  `block p-2 rounded hover:bg-primary-700 ${isActive ? 'bg-primary-600' : ''}`
                }
              >
                Profile
              </NavLink>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left p-2 rounded hover:bg-red-600 flex items-center gap-2"
              >
                <FiLogOut className="inline" /> Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <DashboardHeader />
        <Outlet />
      </div>
    </div>
  );
};

export default DoctorDashboard;
