import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [status, setStatus] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setStatus('User not logged in.');
      return;
    }

    fetch('http://127.0.0.1:8000/api/patients/profile/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          res.json().then(err => console.error('Profile fetch error:', err));
          throw new Error('Failed to fetch profile.');
        }
        return res.json();
      })
      .then((data) => {
        setProfile({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
        });
      })
      .catch(() => setStatus('❌ Failed to load profile.'));
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setStatus('User not logged in.');
      return;
    }

    fetch('http://127.0.0.1:8000/api/patients/profile/', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    })
      .then((res) => {
        if (!res.ok) {
          res.json().then(err => console.error('Profile update error:', err));
          throw new Error('Failed to update profile.');
        }
        setStatus('✅ Profile updated successfully!');
        setTimeout(() => setStatus(''), 3000);
      })
      .catch(() => setStatus('❌ Failed to update profile.'));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Profile</h1>

      <div className="bg-white rounded-xl shadow p-6 space-y-5 border border-gray-100">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your phone number"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Save Changes
        </button>

        {status && <p className="text-sm mt-2 text-center">{status}</p>}
      </div>
    </div>
  );
};

export default Profile;
