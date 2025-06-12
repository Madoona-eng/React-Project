import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Booking = () => {
  const [doctors, setDoctors] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [formData, setFormData] = useState({
    doctorId: "",
    dateTime: "",
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const doctorIdFromURL = params.get("doctor");
    if (doctorIdFromURL) {
      setFormData((prev) => ({ ...prev, doctorId: doctorIdFromURL }));
    }
  }, [location.search]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/accounts/doctors", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const doctorsArr = Array.isArray(data.results) ? data.results : Array.isArray(data) ? data : [];
        setDoctors(doctorsArr);
      });
  }, []);

  useEffect(() => {
    if (formData.doctorId) {
      const now = new Date();
      const times = [...Array(5)].map((_, i) => {
        const slot = new Date(now);
        slot.setDate(now.getDate() + i);
        slot.setHours(10 + (i % 3), 0, 0, 0);
        return slot.toISOString();
      });
      setAvailableTimes(times);
      setFormData((prev) => ({ ...prev, dateTime: "" }));
    } else {
      setAvailableTimes([]);
    }
  }, [formData.doctorId]);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleBooking = async (e) => {
  e.preventDefault();
  if (!formData.doctorId || !formData.dateTime) {
    return alert("Please fill all fields");
  }

  setLoading(true);
  try {
    const res = await fetch("http://127.0.0.1:8000/api/patients/appointments/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        doctor_id: Number(formData.doctorId),
        date: formData.dateTime.split("T")[0],
        time: formData.dateTime.split("T")[1].substring(0, 8),
      }),
    });

    if (!res.ok) {
      throw new Error("Booking failed");
    }

    showNotification("✅ Appointment booked successfully!");
    setTimeout(() => navigate("/patient/appointments"), 2000);
  } catch (err) {
    alert("❌ Error booking appointment. Try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 relative">
      {notification && (
        <div className="fixed top-5 right-5 bg-green-600 text-white py-2 px-4 rounded-xl shadow-lg z-50 transition-all">
          {notification}
        </div>
      )}

      <form onSubmit={handleBooking} className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Book an Appointment</h2>

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
                {(doc.username || doc.name)} - {doc.specialty}
              </option>
            ))}
          </select>
        </div>

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
