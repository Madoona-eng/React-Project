import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDateTime, setNewDateTime] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchData = () => {
    const fetchAllAppointments = async () => {
      let allAppointments = [];
      let nextUrl = 'http://127.0.0.1:8000/api/patients/my-appointments/';
      while (nextUrl) {
        const res = await fetch(nextUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data.results)) {
          allAppointments = allAppointments.concat(data.results);
          nextUrl = data.next;
        } else if (Array.isArray(data)) {
          allAppointments = allAppointments.concat(data);
          nextUrl = null;
        } else {
          nextUrl = null;
        }
      }
      return allAppointments;
    };
    const fetchAllDoctors = async () => {
      let allDoctors = [];
      let nextUrl = 'http://127.0.0.1:8000/api/accounts/doctors';
      while (nextUrl) {
        const res = await fetch(nextUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data.results)) {
          allDoctors = allDoctors.concat(data.results);
          nextUrl = data.next;
        } else if (Array.isArray(data)) {
          allDoctors = allDoctors.concat(data);
          nextUrl = null;
        } else {
          nextUrl = null;
        }
      }
      return allDoctors;
    };
    Promise.all([fetchAllAppointments(), fetchAllDoctors()])
      .then(([appointmentsData, doctorsData]) => {
        setAppointments(appointmentsData);
        setDoctors(doctorsData);
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
    if (!selectedAppointment || selectedAppointment.is_canceled) return;
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
const handleCancel = async (id) => {
  const confirmed = window.confirm("Are you sure you want to cancel this appointment?");
  if (!confirmed) return;

  try {
    await axios.post(`http://127.0.0.1:8000/api/patients/appointments/${id}/cancel/`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    // Update local state to reflect cancellation immediately
    setAppointments(prev =>
      prev.map(app => app.id === id ? { ...app, is_canceled: true } : app)
    );

    alert("Appointment cancelled.");
  } catch {
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
    className={`p-5 rounded-2xl transition-all border shadow ${
      app.is_canceled
        ? 'bg-red-50 border-red-300 opacity-80'
        : 'bg-white border-gray-100 hover:shadow-md'
    }`}
  >
    <div className="mb-2">
      <p className="text-gray-700">
        <span className="font-semibold text-gray-900">Doctor:</span>{' '}
        {getDoctorName(app.doctor)}
      </p>
      <p className="text-gray-700">
        <span className="font-semibold text-gray-900">Date & Time:</span>{' '}
        {`${app.date} at ${app.time}`}
      </p>
      {app.is_canceled && (
        <p className="text-sm font-semibold text-red-600 mt-2">
          ❌ Status: Cancelled
        </p>
      )}
    </div>

    <div className="flex gap-2 mt-4">
      <button
        onClick={() => handleCancel(app.id)}
        disabled={app.is_canceled}
        className={`flex-1 py-2 rounded-lg transition text-sm ${
          app.is_canceled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-red-600 text-white hover:bg-red-700'
        }`}
      >
        Cancel
      </button>
      <button
        onClick={() => {
          if (!app.is_canceled) {
            setSelectedAppointment(app);
          }
        }}
        disabled={app.is_canceled}
        className={`flex-1 py-2 rounded-lg transition text-sm ${
          app.is_canceled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-yellow-500 text-white hover:bg-yellow-600'
        }`}
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
      {selectedAppointment && !selectedAppointment.is_canceled && (
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
    </div>
  );
};

export default Appointments;
