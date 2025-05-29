import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Booking = () => {
  const [doctors, setDoctors] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [formData, setFormData] = useState({
    doctorId: "",
    dateTime: "",
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(""); // ✅ إشعار داخلي
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/doctors")
      .then((res) => res.json())
      .then((data) => setDoctors(data));
  }, []);

  useEffect(() => {
    if (formData.doctorId) {
      const doctor = doctors.find((doc) => doc.id === formData.doctorId);
      if (doctor) {
        setAvailableTimes(doctor.availability || []);
        setFormData((prev) => ({ ...prev, dateTime: "" }));
      }
    } else {
      setAvailableTimes([]);
      setFormData((prev) => ({ ...prev, dateTime: "" }));
    }
  }, [formData.doctorId, doctors]);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!formData.doctorId || !formData.dateTime) return alert("Please fill all fields");

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("User not logged in");

    setLoading(true);
    const newAppointment = {
      ...formData,
      id: Date.now(),
      status: "pending",
      patientName: user.name,
      patientId: user.id
    };

    try {
      await fetch("http://localhost:8000/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAppointment),
      });

      showNotification("✅ Appointment booked! Confirmation email sent.");
      setTimeout(() => {
        navigate("/patient/appointments");
      }, 2000);
    } catch (err) {
      alert("Error booking appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 relative">

      {/* ✅ إشعار داخلي */}
      {notification && (
        <div className="fixed top-5 right-5 bg-green-600 text-white py-2 px-4 rounded-xl shadow-lg z-50 transition-all">
          {notification}
        </div>
      )}

      <form onSubmit={handleBooking} className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Book an Appointment</h2>

        {/* Doctor Select */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select Doctor</label>
          <select
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">-- Choose Doctor --</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name} - {doc.specialty}
              </option>
            ))}
          </select>
        </div>

        {/* Available Appointment Times */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Appointment Time</label>
          <select
            name="dateTime"
            value={formData.dateTime}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={!formData.doctorId}
          >
            <option value="">-- Select Time --</option>
            {availableTimes.map((time) => (
              <option key={time} value={time}>
                {new Date(time).toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
        >
          {loading ? "Booking..." : "Book Appointment"}
        </button>
      </form>
    </div>
  );
};

export default Booking;
