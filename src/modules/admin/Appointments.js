import React, { useEffect, useState } from "react";
import axios from "axios";
import { CalendarDays, Clock, User, CheckCircle, XCircle } from "lucide-react";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchAllAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        let allAppointments = [];
        let nextUrl = 'http://127.0.0.1:8000/api/accounts/appointments';
        // Loop to fetch all pages if paginated
        while (nextUrl) {
          const apptRes = await axios.get(nextUrl, config);
          if (Array.isArray(apptRes.data.results)) {
            allAppointments = allAppointments.concat(apptRes.data.results);
            nextUrl = apptRes.data.next;
          } else if (Array.isArray(apptRes.data)) {
            allAppointments = allAppointments.concat(apptRes.data);
            nextUrl = null;
          } else {
            nextUrl = null;
          }
        }
        setAppointments(allAppointments);

        // Fetch doctors (single call, not paginated)
        const docRes = await axios.get('http://127.0.0.1:8000/api/accounts/doctors', config);
        const docsArr = Array.isArray(docRes.data.results)
          ? docRes.data.results
          : Array.isArray(docRes.data)
          ? docRes.data
          : [];
        setDoctors(docsArr);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    fetchAllAppointments();
  }, []);

  const findDoctor = (doctorId) => doctors.find((doc) => doc.id === doctorId) || null;

  const getStatusStyle = (status) => {
    switch (status) {
      case "confirmed":
        return "text-green-600 bg-green-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-5 h-5 mr-1" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 mr-1" />;
      default:
        return <Clock className="w-5 h-5 mr-1" />;
    }
  };

  // Filtered appointments
  const filteredAppointments = appointments.filter(appt => {
    const matchesSearch = search === "" || (appt.patientName && appt.patientName.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "" || appt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/30">
        <h1 className="text-4xl font-bold text-indigo-800 mb-8 text-center">Appointments</h1>
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
          <input
            type="text"
            placeholder="Search by patient name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-1/2"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-1/3"
          >
            <option value="">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        {filteredAppointments.length === 0 ? (
          <p className="text-center text-gray-500">No appointments found.</p>
        ) : (
          <div className="space-y-6">
            {filteredAppointments.map((appt) => {
              const doctor = findDoctor(appt.doctorId);
              return (
                <div
                  key={appt.id}
                  className="bg-white/80 backdrop-blur rounded-xl p-6 shadow-md flex items-center justify-between transition-all hover:shadow-lg"
                >
                  <div>
                    <div className="flex items-center mb-2">
                      <User className="w-5 h-5 mr-2 text-indigo-500" />
                      <span className="text-lg font-semibold text-gray-800">{appt.patientName}</span>
                    </div>
                    {doctor && (
                      <div className="mb-2">
                        <p className="text-sm font-medium text-indigo-700">Doctor: {doctor.name}</p>
                        <p className="text-sm italic text-indigo-500">Specialty: {doctor.specialty}</p>
                      </div>
                    )}
                    <div className="flex items-center text-gray-600 mb-1">
                      <CalendarDays className="w-5 h-5 mr-2" />
                      <span>{appt.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-5 h-5 mr-2" />
                      <span>{appt.time}</span>
                    </div>
                  </div>
                  <div
                    className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                      appt.status
                    )}`}
                  >
                    {getStatusIcon(appt.status)}
                    <span className="capitalize">{appt.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
