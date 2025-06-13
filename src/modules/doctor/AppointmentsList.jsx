import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchAppointments,
  updateAppointmentStatus
} from './doctorSlice';
import { motion, AnimatePresence } from 'framer-motion';

const AppointmentsList = () => {
  const dispatch = useDispatch();
  const { appointments = [], loading, error } = useSelector(state => state.doctor);
  const [expandedAppointment, setExpandedAppointment] = useState(null);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const handleStatusChange = async (appointmentId, status) => {
    try {
      await dispatch(updateAppointmentStatus({ appointmentId, status })).unwrap();
      setExpandedAppointment(null);
    } catch (error) {
      console.error('Failed to update appointment:', error);
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

  const getStatusColor = status => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="text-center py-8">Loading appointments...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="space-y-6"
    >
      {/* Upcoming Appointments */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-dark-800 mb-4">Upcoming Appointments</h2>
        {upcomingAppointments?.length === 0 ? (
          <p className="text-gray-500">No upcoming appointments</p>
        ) : (
          <ul className="space-y-3">
            {upcomingAppointments?.map(appt => (
              <li key={appt.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  className="flex justify-between items-center p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleExpand(appt.id)}
                >
                  <div>
                    <span className="font-medium">{appt.patientName}</span>
                    <span className="text-gray-500 text-sm ml-2">
                      {formatDate(appt.date)} at {appt.time}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appt.status)}`}>
                    {appt.status}
                  </span>
                </div>
                
                <AnimatePresence>
                  {expandedAppointment === appt.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStatusChange(appt.id, 'confirmed')}
                            disabled={appt.status === 'confirmed'}
                            className={`px-3 py-1 rounded text-sm ${appt.status === 'confirmed' ? 'bg-green-200 text-green-800' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleStatusChange(appt.id, 'cancelled')}
                            disabled={appt.status === 'cancelled'}
                            className={`px-3 py-1 rounded text-sm ${appt.status === 'cancelled' ? 'bg-red-200 text-red-800' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Past Appointments */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-dark-800 mb-4">Past Appointments</h2>
        {pastAppointments?.length === 0 ? (
          <p className="text-gray-500">No past appointments</p>
        ) : (
          <ul className="space-y-3">
            {pastAppointments?.map(appt => (
              <li key={appt.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  className="flex justify-between items-center p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleExpand(appt.id)}
                >
                  <div>
                    <span className="font-medium">{appt.patientName}</span>
                    <span className="text-gray-500 text-sm ml-2">
                      {formatDate(appt.date)} at {appt.time}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appt.status)}`}>
                    {appt.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
};

export default AppointmentsList;