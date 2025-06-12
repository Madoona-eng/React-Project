import React, { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    image: null,
    role: "Doctor",
    specialty: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/accounts/doctors");
      const doctorsArr = Array.isArray(res.data.results)
        ? res.data.results
        : Array.isArray(res.data)
        ? res.data
        : [];
      setDoctors(doctorsArr);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const fetchSpecialties = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/accounts/specialtiesData/");
      setSpecialties(res.data || []);
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
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("role", "Doctor");
    formData.append("specialty", form.specialty);
    if (form.image) formData.append("image", form.image);

    try {
      if (editingId) {
        await axios.put(
          `http://127.0.0.1:8000/api/accounts/doctors/${editingId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              ...getAuthHeaders(),
            },
          }
        );
        setEditingId(null);
      } else {
        await axios.post(
          "http://127.0.0.1:8000/api/accounts/doctors",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              ...getAuthHeaders(),
            },
          }
        );
      }

      setForm({ name: "", email: "", image: null, role: "Doctor", specialty: "" });
      fetchDoctors();
      setShowModal(false);
    } catch (err) {
      console.error("Submit error:", err.response?.data || err);
    }
  };

  const handleEdit = (doctor) => {
    setForm({
      name: doctor.name,
      email: doctor.email,
      image: null,
      role: doctor.role || "Doctor",
      specialty: doctor.specialty || "",
    });
    setEditingId(doctor.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/accounts/doctors/${id}`, {
          headers: getAuthHeaders(),
        });
        fetchDoctors();
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  const safeDoctors = Array.isArray(doctors) ? doctors : [];
  const totalPages = Math.ceil(safeDoctors.length / itemsPerPage);
  const paginatedDoctors = safeDoctors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Doctors Management</h1>
        <button
          onClick={() => {
            setForm({ name: "", email: "", image: null, role: "Doctor", specialty: "" });
            setEditingId(null);
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-lg transition"
        >
          + Add Doctor
        </button>
      </div>

      {/* Modal */}
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
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <select
                name="specialty"
                value={form.specialty}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              >
                <option value="" disabled>Select Specialty</option>
                {specialties.map((spec, idx) => (
                  <option key={idx} value={spec.name || spec}>
                    {spec.name || spec}
                  </option>
                ))}
              </select>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
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

      {/* Grid of doctors */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {paginatedDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:scale-105 transition-transform duration-300"
          >
            <div className="p-6 flex flex-col items-center text-center">
              <img
                src={
                  doctor.image && doctor.image.startsWith("http")
                    ? doctor.image
                    : doctor.image
                    ? `http://localhost:8000${doctor.image}`
                    : "https://via.placeholder.com/100"
                }
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
                  className="px-4 py-1 bg-yellow-400 hover:bg-yellow-500 text-white text-sm rounded-full"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(doctor.id)}
                  className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-full"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-xl font-medium ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
