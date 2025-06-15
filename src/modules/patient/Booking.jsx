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

    const params = new URLSearchParams(location.search);
    const doctorIdFromURL = params.get("doctor");
    const appointmentIdFromURL = params.get("id");
    const isReschedule = params.get("reschedule") === "true";

    useEffect(() => {
        if (doctorIdFromURL) {
            setFormData((prev) => ({ ...prev, doctorId: doctorIdFromURL }));
        }
    }, [doctorIdFromURL]);

    useEffect(() => {
        const fetchAllDoctors = async () => {
            let allDoctors = [];
            let nextUrl = "http://127.0.0.1:8000/api/accounts/doctors";
            const token = localStorage.getItem("token");
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
            setDoctors(allDoctors);
        };
        fetchAllDoctors();
    }, []);

    useEffect(() => {
        if (appointmentIdFromURL && isReschedule) {
            fetch(`http://127.0.0.1:8000/api/patients/appointments/${appointmentIdFromURL}/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    const dateTime = `${data.date}T${data.time}`;
                    setFormData({
                        doctorId: data.doctor.id,
                        dateTime,
                    });
                });
        }
    }, [appointmentIdFromURL, isReschedule]);

    useEffect(() => {
        if (formData.doctorId) {
            // Fetch availability for the selected doctor
            const fetchAvailability = async () => {
                try {
                    const token = localStorage.getItem("token");
                    const res = await fetch(
                        `http://127.0.0.1:8000/api/doctors/${formData.doctorId}/availability/`, {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                    if (!res.ok) throw new Error("Failed to fetch availability");
                    const data = await res.json();
                    console.log('Doctor availability API response:', data); // Debug log
                    // Flatten the object into an array of { day, time } objects
                    let times = [];
                    if (data && typeof data === 'object' && !Array.isArray(data)) {
                        Object.entries(data).forEach(([day, slots]) => {
                            slots.forEach((slot) => {
                                times.push({ day, slot });
                            });
                        });
                    }
                    setAvailableTimes(times);
                    setFormData((prev) => ({ ...prev, dateTime: "" }));
                } catch (err) {
                    setAvailableTimes([]);
                }
            };
            fetchAvailability();
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

    const getNextDateForDay = (day) => {
        const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const today = new Date();
        const todayIndex = today.getDay();
        const targetIndex = daysOfWeek.indexOf(day.toLowerCase());

        if (targetIndex === -1) return null; // Invalid day

        const daysUntilTarget = (targetIndex - todayIndex + 7) % 7 || 7; // Calculate days until the target day
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + daysUntilTarget);

        return targetDate.toISOString().split("T")[0]; // Return the date in YYYY-MM-DD format
    };

    const formatTime = (timeRange) => {
        const [startTime] = timeRange.split("-"); // Use the start time from the range
        return `${startTime}:00`; // Add seconds to make it HH:mm:ss
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        console.log("Form Data:", formData); // Debug log for form data

        if (!formData.doctorId || !formData.dateTime) {
            return alert("Please fill all fields");
        }

        const [day, timeRange] = formData.dateTime.split(" ");
        const date = getNextDateForDay(day);
        const time = formatTime(timeRange);

        if (!date || !time) {
            return alert("Invalid date and time format. Please select a valid appointment time.");
        }

        setLoading(true);

        const endpoint = isReschedule
            ? `http://127.0.0.1:8000/api/patients/appointments/${appointmentIdFromURL}/`
            : `http://127.0.0.1:8000/api/patients/appointments/`;

        const method = isReschedule ? "PUT" : "POST";

        try {
            const res = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    doctor_id: Number(formData.doctorId),
                    date,
                    time,
                }),
            });

            console.log("API Response:", res); // Debug log for API response

            if (!res.ok) throw new Error("Failed");

            showNotification(
                isReschedule
                    ? "✅ Appointment rescheduled successfully!"
                    : "✅ Appointment booked successfully!"
            );
            navigate("/patient/appointments");
        } catch (err) {
            console.error("Error during booking:", err); // Debug log for errors
            alert("❌ Error. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        const confirmed = window.confirm("Are you sure you want to cancel this appointment?");
        if (!confirmed) return;

        try {
            const res = await fetch(
                `http://127.0.0.1:8000/api/patients/appointments/${appointmentIdFromURL}/cancel/`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (!res.ok) throw new Error("Cancel failed");
            alert("Appointment cancelled.");
            navigate("/patient/appointments");
        } catch {
            alert("Failed to cancel appointment.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 relative">
            {notification && (
                <div className="fixed top-5 right-5 bg-green-600 text-white py-2 px-4 rounded-xl shadow-lg z-50 transition-all">
                    {notification}
                </div>
            )}

            <form
                onSubmit={handleBooking}
                className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg"
            >
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    {isReschedule ? "Reschedule Appointment" : "Book an Appointment"}
                </h2>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Select Doctor</label>
                    <select
                        name="doctorId"
                        value={formData.doctorId}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">--Choose Doctor--</option>
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
                        <option value="">--Select Time--</option>
                        {availableTimes.map(({ day, slot }, index) => (
                            <option key={index} value={`${day} ${slot}`}>
                                {`${day} ${slot}`}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-between gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
                    >
                        {loading
                            ? "Saving..."
                            : isReschedule
                            ? "Reschedule"
                            : "Book Appointment"}
                    </button>

                    {isReschedule && (
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition"
                        >
                            Cancel Appointment
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Booking;