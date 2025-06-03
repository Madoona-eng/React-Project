import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [status, setStatus] = useState('');

  useEffect(() => {
    const userString = localStorage.getItem('user');  // your user object key in localStorage
    if (userString) {
      try {
        const user = JSON.parse(userString);          // parse JSON string to object
        const id = user.id;                            // get user id
        if (id) {
          fetch(`http://localhost:8000/users/${id}`)
            .then(res => {
              if (!res.ok) throw new Error('Failed to fetch');
              return res.json();
            })
            .then(data => setProfile(data))
            .catch(() => setStatus('Failed to load profile.'));
        } else {
          setStatus('User ID not found.');
        }
      } catch {
        setStatus('Failed to parse user data.');
      }
    } else {
      setStatus('User not logged in.');
    }
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const userString = localStorage.getItem('user');
    if (!userString) {
      setStatus('User not logged in.');
      return;
    }
    try {
      const user = JSON.parse(userString);
      const id = user.id;
      if (!id) {
        setStatus('User ID not found.');
        return;
      }

      fetch(`http://localhost:8000/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to update');
          setStatus('Profile updated successfully!');
          setTimeout(() => setStatus(''), 3000);
        })
        .catch(() => setStatus('Failed to update profile.'));
    } catch {
      setStatus('Failed to parse user data.');
    }
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

        {status && (
          <p className="text-green-600 text-sm mt-2">{status}</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
