import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import DashboardHeader from './DashboardHeader'
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiUser } from 'react-icons/fi';

const DoctorDashboard = () => {

      const profile = useSelector(state => state.doctor.profile);
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-dark-900 text-white p-4">
         <div className="flex flex-col items-center mb-8 pt-4">
        <motion.div 
          className="w-16 h-16 rounded-full mb-3 overflow-hidden border-4 border-white shadow-lg"
          whileHover={{ scale: 1.05 }}
        >
          {profile.image ? (
            <img 
              src={profile.image} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-blue-700 flex items-center justify-center">
              <FiUser className="w-8 h-8 text-white" />
            </div>
          )}
        </motion.div>
        <h3 className="font-semibold text-center">Dr. {profile.name}</h3>
        <p className="text-xs text-blue-200 text-center">{profile.specialty}</p>
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
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <DashboardHeader />
        <Outlet /> {/* This will render the nested routes */}
      </div>
    </div>
  )
}

export default DoctorDashboard