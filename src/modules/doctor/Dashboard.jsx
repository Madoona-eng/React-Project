import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiUser, FiActivity, FiTrendingUp } from 'react-icons/fi';
import { BarChart, PieChart } from './ChartComponents';

const DocDashboard = () => {
  const [profile, setProfile] = useState(null);

  // Fetch doctor profile
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setProfile({ name: 'Name not available' });
      return;
    }
    fetch('http://127.0.0.1:8000/api/doctors/my_profile/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => setProfile({ name: data.name || data.username || 'Name not available' }))
      .catch(() => setProfile({ name: 'Name not available' }));
  }, []);
  
  // Enhanced chart data with interactive elements
  const appointmentData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Appointments',
        data: [12, 19, 8, 15, 10],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        hoverBackgroundColor: 'rgba(59, 130, 246, 1)',
        borderRadius: 6,
        borderSkipped: false,
      }
    ]
  };

  const patientData = {
    labels: ['New', 'Follow-up', 'Emergency'],
    datasets: [
      {
        data: [30, 50, 20],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(239, 68, 68, 0.7)'
        ],
        hoverBackgroundColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 0,
      }
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-4"
    >
      {/* Enhanced Welcome Header with Interactive Elements */}
      <motion.div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-blue-50 to-white p-6 rounded-2xl shadow-xs border border-gray-100"
        whileHover={{ scale: 1.005 }}
      >
        <div>
          <motion.h1 
            className="text-2xl font-bold text-gray-800"
            whileHover={{ x: 5 }}
          >
            Dashboard Overview
          </motion.h1>
          <motion.p 
            className="text-gray-600"
            whileHover={{ x: 5 }}
          >
            Welcome back, <span className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">Doctor</span>
          </motion.p>
        </div>
        
        <motion.div
          className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm border border-gray-200"
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
          }}
        >
          <FiCalendar className="text-blue-500" />
          <span className="text-sm font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
        </motion.div>
      </motion.div>



      {/* Interactive Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<FiUser className="w-5 h-5" />}
          title="Total Patients"
          value="142"
          change="+12%"
          color="blue"
          delay={0.2}
        />
        <StatCard 
          icon={<FiCalendar className="w-5 h-5" />}
          title="Today's Appointments"
          value="8"
          change="+2 from yesterday"
          color="green"
          delay={0.3}
        />
        <StatCard 
          icon={<FiClock className="w-5 h-5" />}
          title="Avg. Wait Time"
          value="15 min"
          change="-3 min"
          color="purple"
          delay={0.4}
        />
        <StatCard 
          icon={<FiActivity className="w-5 h-5" />}
          title="Clinic Capacity"
          value="72%"
          change="Optimal"
          color="orange"
          delay={0.5}
        />
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100"
          whileHover={{ 
            y: -5,
            boxShadow: "0 10px 25px rgba(0,0,0,0.05)"
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Weekly Appointments</h3>
            <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
              <FiTrendingUp className="w-4 h-4" />
              View trends
            </button>
          </div>
          <div className="h-72">
            <BarChart data={appointmentData} />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100"
          whileHover={{ 
            y: -5,
            boxShadow: "0 10px 25px rgba(0,0,0,0.05)"
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Patient Types</h3>
            <button className="text-sm text-blue-600 hover:text-blue-800">
              View details
            </button>
          </div>
          <div className="h-72">
            <PieChart data={patientData} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Enhanced Stat Card Component with more interactivity
const StatCard = ({ icon, title, value, change, color, delay }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      hover: 'hover:bg-blue-100'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      hover: 'hover:bg-green-100'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      hover: 'hover:bg-purple-100'
    },
    orange: {
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      hover: 'hover:bg-orange-100'
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ 
        y: -5,
        scale: 1.03,
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
      }}
      className={`p-5 rounded-xl ${colorClasses[color].bg} ${colorClasses[color].text} ${colorClasses[color].hover} transition-all duration-300 cursor-pointer shadow-sm border border-gray-100`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <motion.div 
          className={`p-2 rounded-lg ${colorClasses[color].bg.replace('50', '100')}`}
          whileHover={{ rotate: 10 }}
        >
          {icon}
        </motion.div>
      </div>
      <motion.p 
        className="text-xs mt-2 opacity-80"
        whileHover={{ scale: 1.05 }}
      >
        {change}
      </motion.p>
    </motion.div>
  );
};

export default DocDashboard;