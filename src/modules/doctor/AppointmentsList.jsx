import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { 
  updateAppointmentStatus,
  addAppointmentNote
} from './doctorSlice'
import { motion, AnimatePresence } from 'framer-motion'

const AppointmentsList = () => {
  const dispatch = useDispatch()
  const appointments = useSelector(state => state.doctor.appointments)
  const [expandedAppointment, setExpandedAppointment] = useState(null)
  const [newNote, setNewNote] = useState('')

  const handleStatusChange = (appointmentId, status) => {
    dispatch(updateAppointmentStatus({ appointmentId, status }))
  }

  const handleAddNote = appointmentId => {
    if (newNote.trim()) {
      dispatch(addAppointmentNote({ appointmentId, note: newNote }))
      setNewNote('')
      setExpandedAppointment(null)
    }
  }

  const toggleExpand = appointmentId => {
    setExpandedAppointment(expandedAppointment === appointmentId ? null : appointmentId)
  }

  const upcomingAppointments = appointments.filter(
    appt => new Date(appt.date) >= new Date()
  )
  const pastAppointments = appointments.filter(
    appt => new Date(appt.date) < new Date()
  )

  const getStatusColor = status => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

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
        {upcomingAppointments.length === 0 ? (
          <p className="text-gray-500">No upcoming appointments</p>
        ) : (
          <ul className="space-y-3">
            {upcomingAppointments.map(appt => (
              <li key={appt.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  className="flex justify-between items-center p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleExpand(appt.id)}
                >
                  <div>
                    <span className="font-medium">{appt.patientName}</span>
                    <span className="text-gray-500 text-sm ml-2">
                      {new Date(appt.date).toLocaleDateString()} at {appt.time}
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
                            onClick={() => handleStatusChange(appt.id, 'approved')}
                            disabled={appt.status === 'approved'}
                            className={`px-3 py-1 rounded text-sm ${appt.status === 'approved' ? 'bg-green-200 text-green-800' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(appt.id, 'rejected')}
                            disabled={appt.status === 'rejected'}
                            className={`px-3 py-1 rounded text-sm ${appt.status === 'rejected' ? 'bg-red-200 text-red-800' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                          >
                            Reject
                          </button>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Notes:</h4>
                          {appt.notes ? (
                            <p className="text-gray-600 bg-gray-50 p-3 rounded">{appt.notes}</p>
                          ) : (
                            <p className="text-gray-400 italic">No notes added</p>
                          )}
                          
                          <textarea
                            value={newNote}
                            onChange={e => setNewNote(e.target.value)}
                            placeholder="Add new note..."
                            className="w-full mt-2 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                          />
                          <button
                            onClick={() => handleAddNote(appt.id)}
                            className="mt-2 px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors text-sm"
                          >
                            Add Note
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
        {pastAppointments.length === 0 ? (
          <p className="text-gray-500">No past appointments</p>
        ) : (
          <ul className="space-y-3">
            {pastAppointments.map(appt => (
              <li key={appt.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  className="flex justify-between items-center p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleExpand(appt.id)}
                >
                  <div>
                    <span className="font-medium">{appt.patientName}</span>
                    <span className="text-gray-500 text-sm ml-2">
                      {new Date(appt.date).toLocaleDateString()} at {appt.time}
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
                      <div className="px-4 pb-4">
                        <h4 className="font-medium text-gray-700 mb-2">Notes:</h4>
                        {appt.notes ? (
                          <p className="text-gray-600 bg-gray-50 p-3 rounded">{appt.notes}</p>
                        ) : (
                          <p className="text-gray-400 italic">No notes added</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  )
}

export default AppointmentsList