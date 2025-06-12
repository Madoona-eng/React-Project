import React, { useEffect, useState } from "react";
import axios from "axios";
import { CalendarDays, Clock, User, CheckCircle, XCircle } from "lucide-react";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch appointments
        const apptRes = await axios.get("http://127.0.0.1:8000/api/accounts/appointments");
        const apptsArr = Array.isArray(apptRes.data.results)
          ? apptRes.data.results
          : Array.isArray(apptRes.data)
          ? apptRes.data
          : [];
        setAppointments(apptsArr);

        // Fetch doctors
        const docRes = await axios.get("http://127.0.0.1:8000/api/accounts/doctors");
        const docsArr = Array.isArray(docRes.data.results)
          ? docRes.data.results
          : Array.isArray(docRes.data)
          ? docRes.data
          : [];
        setDoctors(docsArr);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
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

  const safeAppointments = Array.isArray(appointments) ? appointments : [];

  // Pagination logic
  const totalPages = Math.ceil(safeAppointments.length / itemsPerPage);
  const paginatedAppointments = safeAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/30">
        <h1 className="text-4xl font-bold text-indigo-800 mb-8 text-center">Appointments</h1>

        {safeAppointments.length === 0 ? (
          <p className="text-center text-gray-500">No appointments found.</p>
        ) : (
          <>
            <div className="space-y-6">
              {paginatedAppointments.map((appt) => {
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-md font-medium ${
                      currentPage === i + 1
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
