import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/accounts/doctors', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(res => res.json())
      .then(data => {
        // Support paginated or non-paginated response
        const doctorsArr = Array.isArray(data.results) ? data.results : (Array.isArray(data) ? data : []);
        setDoctors(doctorsArr);
      });
  }, []);

  const safeDoctors = Array.isArray(doctors) ? doctors : [];

  const filteredDoctors = safeDoctors.filter(doc =>
    (doc.username || doc.name || '').toLowerCase().includes(search.toLowerCase()) &&
    (specialty === '' || doc.specialty === specialty)
  );

  const specialties = [...new Set(safeDoctors.map(d => d.specialty))];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Search for a Doctor 👨‍⚕️</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by name..."
          className="w-full md:flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="w-full md:w-64 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={specialty}
          onChange={e => setSpecialty(e.target.value)}
        >
          <option value="">All Specialties</option>
          {specialties.map((spec, idx) => (
            <option key={idx} value={spec}>{spec}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map(doc => (
          <div key={doc.id} className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-gray-800">
              {doc.username || doc.name}
            </h2>
            <p className="text-gray-500 mb-4">{doc.specialty}</p>
            <button
              onClick={() => navigate(`/patient/booking?doctor=${doc.id}`)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Book Appointment
            </button>
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No doctors found matching your search.</p>
      )}
    </div>
  );
};

export default SearchDoctors;
