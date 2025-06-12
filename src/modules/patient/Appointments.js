import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDateTime, setNewDateTime] = useState('');
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchData = () => {
    Promise.all([
      fetch('http://127.0.0.1:8000/api/patients/my-appointments/', {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.json()),
      fetch('http://127.0.0.1:8000/api/accounts/doctors', {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.json())
    ])
      .then(([appointmentsData, doctorsData]) => {
        setAppointments(Array.isArray(appointmentsData) ? appointmentsData : appointmentsData.results || []);
        setDoctors(Array.isArray(doctorsData) ? doctorsData : doctorsData.results || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getDoctorName = (doctorObj) => {
    return doctorObj?.username || doctorObj?.name || 'Unknown';
  };

  const handleReschedule = async () => {
    try {
      const date = newDateTime.split("T")[0];
      const time = newDateTime.split("T")[1].slice(0, 5);

      await fetch(`http://127.0.0.1:8000/api/patients/appointments/${selectedAppointment.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date, time }),
      });

      setSelectedAppointment(null);
      setNewDateTime('');
      fetchData();
    } catch (err) {
      alert("Failed to reschedule.");
    }
  };

  const handleCancel = async () => {
    try {
      await fetch(`http://127.0.0.1:8000/api/patients/appointments/${appointmentToCancel.id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointmentToCancel(null);
      fetchData();
    } catch (err) {
      alert("Failed to cancel appointment.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium text-gray-500">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto relative">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate('/patient/booking')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Make Appointment
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Appointments</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {appointments.map(app => (
          <div
            key={app.id}
            className="bg-white p-5 rounded-2xl shadow hover:shadow-md transition-all border border-gray-100"
          >
            <p className="text-gray-700 mb-2">
              <span className="font-semibold text-gray-900">Doctor:</span>{' '}
              {getDoctorName(app.doctor)}
            </p>
            <p className="text-gray-700 mb-4">
              <span className="font-semibold text-gray-900">Date & Time:</span>{' '}
              {`${app.date} at ${app.time}`}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setAppointmentToCancel(app)}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => setSelectedAppointment(app)}
                className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
              >
                Reschedule
              </button>
            </div>
          </div>
        ))}
      </div>

      {appointments.length === 0 && (
        <div className="text-center text-gray-500 mt-10 text-lg">No appointments found.</div>
      )}

      {/* Reschedule Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Reschedule Appointment</h2>
            <input
              type="datetime-local"
              value={newDateTime}
              onChange={(e) => setNewDateTime(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedAppointment(null)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReschedule}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {appointmentToCancel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Cancel Appointment</h2>
            <p className="mb-4 text-gray-700">
              Are you sure you want to cancel the appointment with{' '}
              <span className="font-semibold">{getDoctorName(appointmentToCancel.doctor)}</span>?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setAppointmentToCancel(null)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                No
              </button>
              <button
                onClick={handleCancel}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
