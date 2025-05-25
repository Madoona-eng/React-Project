import React, { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]); // <-- specialties state
  const [form, setForm] = useState({
    name: "",
    email: "",
    image: "",
    role: "Doctor",
    specialty: "", // specialty for form
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch doctors
  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:8000/doctors");
      setDoctors(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // Fetch specialties on mount
  const fetchSpecialties = async () => {
    try {
      const res = await axios.get("http://localhost:8000/specialtiesData");
      setSpecialties(res.data.specialties || []);
    } catch (err) {
      console.error("Error fetching specialties:", err);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchSpecialties();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, image: reader.result }));
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:8000/doctors/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post("http://localhost:8000/doctors", form);
      }
      setForm({ name: "", email: "", image: "", role: "Doctor", specialty: "" });
      fetchDoctors();
      setShowModal(false);
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleEdit = (doctor) => {
    setForm({
      name: doctor.name,
      email: doctor.email,
      image: doctor.image || "",
      role: doctor.role || "Doctor",
      specialty: doctor.specialty || "",
    });
    setEditingId(doctor.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        await axios.delete(`http://localhost:8000/doctors/${id}`);
        fetchDoctors();
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Doctors Management</h1>
        <button
          onClick={() => {
            setForm({ name: "", email: "", image: "", role: "Doctor", specialty: "" });
            setEditingId(null);
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-lg transition"
        >
          + Add Doctor
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-semibold mb-6">
              {editingId ? "Edit Doctor" : "Add Doctor"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Doctor Name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                required
              />
              <select
                name="specialty"
                value={form.specialty}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                required
              >
                <option value="" disabled>
                  Select Specialty
                </option>
                {specialties.map((spec, idx) => (
                  <option key={idx} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                {editingId ? "Update Doctor" : "Add Doctor"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:scale-105 transition-transform duration-300"
          >
            <div className="p-6 flex flex-col items-center text-center">
              <img
                src={doctor.image ? doctor.image : "https://via.placeholder.com/100"}
                alt={doctor.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
              />
              <h2 className="mt-4 text-lg font-semibold text-gray-800">{doctor.name}</h2>
              <p className="text-gray-500 text-sm">{doctor.email}</p>
              <p className="text-blue-700 font-medium mt-1">{doctor.specialty}</p>
              <span className="mt-2 px-4 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                Doctor
              </span>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => handleEdit(doctor)}
                  className="px-4 py-1 bg-yellow-400 hover:bg-yellow-500 text-white text-sm rounded-full transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(doctor.id)}
                  className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-full transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {doctors.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No doctors available.</p>
      )}
    </div>
  );
}
