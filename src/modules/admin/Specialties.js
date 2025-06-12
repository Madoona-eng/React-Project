import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Specialties() {
  const [specialties, setSpecialties] = useState([]);
  const [newSpecialty, setNewSpecialty] = useState("");
  const [editId, setEditId] = useState(null);
  const [editSpecialty, setEditSpecialty] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/accounts/specialtiesData/");
        setSpecialties(res.data || []);
      } catch (err) {
        console.error("Error fetching specialties:", err);
      }
    };

    fetchSpecialties();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleAdd = async () => {
    if (newSpecialty.trim() === "") return;

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/accounts/specialtiesData/",
        { name: newSpecialty.trim() },
        { headers: getAuthHeaders() }
      );
      setSpecialties((prev) => [...prev, res.data]);
      setNewSpecialty("");
    } catch (err) {
      console.error("Error adding specialty:", err.response?.data || err);
    }
  };

  const handleSave = async () => {
    if (editSpecialty.trim() === "") return;

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/accounts/specialtiesData/${editId}/`,
        { name: editSpecialty.trim() },
        { headers: getAuthHeaders() }
      );

      const updated = specialties.map((s) =>
        s.id === editId ? { ...s, name: editSpecialty.trim() } : s
      );
      setSpecialties(updated);
      setEditId(null);
      setEditSpecialty("");
    } catch (err) {
      console.error("Error updating specialty:", err.response?.data || err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/accounts/specialtiesData/${id}/`,
        { headers: getAuthHeaders() }
      );
      setSpecialties((prev) => prev.filter((s) => s.id !== id));
      if (editId === id) {
        setEditId(null);
        setEditSpecialty("");
      }
    } catch (err) {
      console.error("Error deleting specialty:", err);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(specialties.length / itemsPerPage);
  const paginated = specialties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/30">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-8 text-center">
          Specialties Management
        </h1>

        <div className="flex items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Add new specialty..."
            value={newSpecialty}
            onChange={(e) => setNewSpecialty(e.target.value)}
            className="flex-grow px-4 py-2 rounded-xl border border-indigo-300 focus:ring-2 focus:ring-indigo-400 transition-all"
          />
          <button
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl shadow-md transition-all"
          >
            Add
          </button>
        </div>

        <ul className="space-y-4">
          {paginated.length === 0 ? (
            <li className="text-center text-gray-500 italic">
              No specialties added yet.
            </li>
          ) : (
            paginated.map((specialty) => (
              <li
                key={specialty.id}
                className="flex items-center justify-between bg-white/90 p-4 rounded-xl shadow hover:shadow-lg transition-all"
              >
                {editId === specialty.id ? (
                  <>
                    <input
                      type="text"
                      value={editSpecialty}
                      onChange={(e) => setEditSpecialty(e.target.value)}
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-xl mr-3"
                    />
                    <button
                      onClick={handleSave}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-xl mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditId(null);
                        setEditSpecialty("");
                      }}
                      className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded-xl"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-grow text-lg text-gray-800">
                      {specialty.name}
                    </span>
                    <button
                      onClick={() => {
                        setEditId(specialty.id);
                        setEditSpecialty(specialty.name);
                      }}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded-xl mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(specialty.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-xl"
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))
          )}
        </ul>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-xl font-medium ${
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
      </div>
    </div>
  );
}
