import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchAppointments,
  updateAppointmentStatus
} from './doctorSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiCalendar, FiUser, FiCheck, FiX } from 'react-icons/fi';

const AppointmentsList = () => {
  const dispatch = useDispatch();
  const { appointments = [], loading, error } = useSelector(state => state.doctor);
  const [expandedAppointment, setExpandedAppointment] = useState(null);
  const [removingAppointments, setRemovingAppointments] = useState([]);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const handleStatusChange = async (appointmentId, status) => {
    try {
      if (status === 'cancelled') {
        setRemovingAppointments(prev => [...prev, appointmentId]);
        setTimeout(() => {
          dispatch(updateAppointmentStatus({ appointmentId, status })).unwrap();
          setExpandedAppointment(null);
          setRemovingAppointments(prev => prev.filter(id => id !== appointmentId));
        }, 500);
      } else {
        await dispatch(updateAppointmentStatus({ appointmentId, status })).unwrap();
        setExpandedAppointment(null);
      }
    } catch (error) {
      console.error('Failed to update appointment:', error);
      setRemovingAppointments(prev => prev.filter(id => id !== appointmentId));
    }
  };

  const toggleExpand = appointmentId => {
    setExpandedAppointment(expandedAppointment === appointmentId ? null : appointmentId);
  };

  const upcomingAppointments = appointments?.filter(
    appt => new Date(appt.date) >= new Date()
  ).sort((a, b) => new Date(a.date) - new Date(b.date));

  const pastAppointments = appointments?.filter(
    appt => new Date(appt.date) < new Date()
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <FiCheck className="w-4 h-4" />,
      },
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: <FiClock className="w-4 h-4" />,
      },
      cancelled: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: <FiX className="w-4 h-4" />,
      },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${badge.bg} ${badge.text} flex items-center gap-1.5`}>
        {badge.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8 bg-red-50 rounded-lg">
        <div className="text-red-500">
          <FiX className="w-12 h-12 mx-auto mb-4" />
          <p className="text-lg font-semibold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Upcoming Appointments */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <FiClock className="w-6 h-6 text-primary-500" />
          Upcoming Appointments
        </h2>
        {upcomingAppointments?.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No upcoming appointments</p>
          </div>
        ) : (
          <ul className="space-y-4">
            <AnimatePresence>
              {upcomingAppointments?.map(appt => (
                <motion.li
                  key={appt.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className={`border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 ${
                    removingAppointments.includes(appt.id) ? 'opacity-50 scale-95' : ''
                  }`}
                >
                  <div 
                    className="flex justify-between items-center p-5 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => toggleExpand(appt.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-primary-50 p-3 rounded-lg">
                        <FiUser className="w-6 h-6 text-primary-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{appt.patientName}</h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <FiCalendar className="w-4 h-4" />
                            {formatDate(appt.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiClock className="w-4 h-4" />
                            {appt.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(appt.status)}
                  </div>
                  
                  <AnimatePresence>
                    {expandedAppointment === appt.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden bg-gray-50 border-t border-gray-100"
                      >
                        <div className="p-5 space-y-4">
                          <div className="flex gap-3">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleStatusChange(appt.id, 'confirmed')}
                              disabled={appt.status === 'confirmed'}
                              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all
                                ${appt.status === 'confirmed'
                                  ? 'bg-green-100 text-green-800 cursor-not-allowed'
                                  : 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800'
                                }`}
                            >
                              <FiCheck className="w-4 h-4" />
                              Confirm Appointment
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleStatusChange(appt.id, 'cancelled')}
                              disabled={appt.status === 'cancelled'}
                              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all
                                ${appt.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800 cursor-not-allowed'
                                  : 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800'
                                }`}
                            >
                              <FiX className="w-4 h-4" />
                              Cancel Appointment
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </motion.div>
      
      {/* Past Appointments */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <FiCalendar className="w-6 h-6 text-gray-500" />
          Past Appointments
        </h2>
        {pastAppointments?.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No past appointments</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {pastAppointments?.map(appt => (
              <motion.li
                key={appt.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-gray-200 rounded-xl overflow-hidden hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center p-5">
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <FiUser className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{appt.patientName}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FiCalendar className="w-4 h-4" />
                          {formatDate(appt.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiClock className="w-4 h-4" />
                          {appt.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(appt.status)}
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AppointmentsList;