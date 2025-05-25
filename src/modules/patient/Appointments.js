import React, { useEffect, useState } from 'react';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8000/appointments').then(res => res.json()),
      fetch('http://localhost:8000/doctors').then(res => res.json())
    ])
      .then(([appointmentsData, doctorsData]) => {
        setAppointments(appointmentsData);
        setDoctors(doctorsData);
      })
      .finally(() => setLoading(false));
  }, []);

  const getDoctorName = (id) => {
    const doctor = doctors.find(d => d.id === id);
    return doctor ? doctor.name : 'Unknown';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium text-gray-500">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
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
              <button className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition">
                Cancel
              </button>
              <button className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition">
                Reschedule
              </button>
            </div>
          </div>
        ))}
      </div>

      {appointments.length === 0 && (
        <div className="text-center text-gray-500 mt-10 text-lg">No appointments found.</div>
      )}
    </div>
  );
};

export default Appointments;
