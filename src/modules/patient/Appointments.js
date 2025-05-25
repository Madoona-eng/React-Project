import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDateTime, setNewDateTime] = useState('');
  const [appointmentToCancel, setAppointmentToCancel] = useState(null); // ✅
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  Promise.all([
    fetch('http://localhost:8000/appointments').then(res => res.json()),
    fetch('http://localhost:8000/doctors').then(res => res.json())
  ])
    .then(([appointmentsData, doctorsData]) => {
      // فلترة المواعيد الخاصة بالمستخدم الحالي
      const userAppointments = appointmentsData.filter(
        (appt) => appt.patientId === user?.id
      );

      setAppointments(userAppointments);
      setDoctors(doctorsData);
    })
    .finally(() => setLoading(false));
};

  const getDoctorName = (id) => {
    const doctor = doctors.find(d => d.id === id);
    return doctor ? doctor.name : 'Unknown';
  };

  const handleReschedule = () => {
    fetch(`http://localhost:8000/appointments/${selectedAppointment.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dateTime: newDateTime })
    }).then(() => {
      setSelectedAppointment(null);
      setNewDateTime('');
      fetchData();
    });
  };

  const handleCancel = () => {
    fetch(`http://localhost:8000/appointments/${appointmentToCancel.id}`, {
      method: 'DELETE',
    }).then(() => {
      setAppointmentToCancel(null);
      fetchData();
    });
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
      {/* زر إضافة موعد */}
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
              <span className="font-semibold text-gray-900">Doctor:</span> {getDoctorName(app.doctorId)}
            </p>
            <p className="text-gray-700 mb-4">
              <span className="font-semibold text-gray-900">Time:</span>{' '}
              {new Date(app.dateTime).toLocaleString()}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setAppointmentToCancel(app)} // ✅ فتح مودال الإلغاء
                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => setSelectedAppointment(app)} // ✅ فتح مودال إعادة الجدولة
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

      {/* ✅ مودال إعادة الجدولة */}
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

      {/* ✅ مودال تأكيد الإلغاء */}
      {appointmentToCancel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Cancel Appointment</h2>
            <p className="mb-4 text-gray-700">
              Are you sure you want to cancel the appointment with{' '}
              <span className="font-semibold">{getDoctorName(appointmentToCancel.doctorId)}</span>?
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
