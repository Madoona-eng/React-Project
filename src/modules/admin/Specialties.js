import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Specialties() {
  const [specialties, setSpecialties] = useState([]);
  const [newSpecialty, setNewSpecialty] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editSpecialty, setEditSpecialty] = useState("");

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const res = await axios.get("http://localhost:8000/specialtiesData");
        setSpecialties(res.data.specialties || []);
      } catch (err) {
        console.error("Error fetching specialties:", err);
      }
    };

    fetchSpecialties();
  }, []);

  const saveSpecialties = async (updatedSpecialties) => {
    try {
      await axios.put("http://localhost:8000/specialtiesData", {
        specialties: updatedSpecialties,
      });
      setSpecialties(updatedSpecialties);
    } catch (err) {
      console.error("Error saving specialties:", err);
    }
  };

  const handleAdd = async () => {
    if (newSpecialty.trim() === "") return;
    const updatedSpecialties = [...specialties, newSpecialty.trim()];
    await saveSpecialties(updatedSpecialties);
    setNewSpecialty("");
  };

  const handleSave = async () => {
    if (editSpecialty.trim() === "") return;
    const updated = [...specialties];
    updated[editIndex] = editSpecialty.trim();
    await saveSpecialties(updated);
    setEditIndex(null);
    setEditSpecialty("");
  };

  const handleDelete = async (index) => {
    const updated = specialties.filter((_, i) => i !== index);
    await saveSpecialties(updated);
    if (editIndex === index) {
      setEditIndex(null);
      setEditSpecialty("");
    }
  };

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
          {specialties.length === 0 ? (
            <li className="text-center text-gray-500 italic">
              No specialties added yet.
            </li>
          ) : (
            specialties.map((specialty, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-white/90 p-4 rounded-xl shadow hover:shadow-lg transition-all"
              >
                {editIndex === index ? (
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
                        setEditIndex(null);
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
                      {specialty}
                    </span>
                    <button
                      onClick={() => {
                        setEditIndex(index);
                        setEditSpecialty(specialty);
                      }}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded-xl mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
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
      </div>
    </div>
  );
}
