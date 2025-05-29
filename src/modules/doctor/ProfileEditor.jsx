import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile, updateProfileImage } from './doctorSlice';
import { motion } from 'framer-motion';
import { FiCamera, FiUser } from 'react-icons/fi';

const ProfileEditor = () => {
  const dispatch = useDispatch();
  const profile = useSelector(state => state.doctor.profile);
  const fileInputRef = useRef(null);

  const [previewImage, setPreviewImage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    bio: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        specialty: profile.specialty || '',
        bio: profile.bio || '',
        email: profile.contact?.email || '',
        phone: profile.contact?.phone || ''
      });
      setPreviewImage(profile.image || '');
    }
  }, [profile]);

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const updatedProfile = {
      ...profile,
      name: formData.name,
      specialty: formData.specialty,
      bio: formData.bio,
      contact: {
        email: formData.email,
        phone: formData.phone
      }
    };
    dispatch(updateProfile(updatedProfile));
  };

  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPreviewImage(base64String);
        dispatch(updateProfileImage(base64String));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-xl font-semibold text-dark-800 mb-4">Edit Profile</h2>

      {/* Profile Image Upload */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative mb-4">
          {previewImage ? (
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src={previewImage}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
              <FiUser className="w-10 h-10 text-gray-400" />
            </div>
          )}
          <button
            type="button"
            onClick={triggerFileInput}
            className="absolute -bottom-2 -right-2 bg-primary-500 text-white p-2 rounded-full hover:bg-primary-600 transition-colors shadow-md"
          >
            <FiCamera className="w-4 h-4" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
        <p className="text-sm text-gray-500">Click to change photo</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
          <input
            type="text"
            name="specialty"
            value={formData.specialty}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[100px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Save Changes
        </button>
      </form>
    </motion.div>
  );
};

export default ProfileEditor;
