import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FiCamera, FiUser } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  fetchDoctorProfile, 
  updateDoctorProfile, 
  updateDoctorImage 
} from './doctorSlice';
import { getFullImageUrl } from './utils';

const ProfileEditor = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector(state => state.doctor);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    specialty: '',
    experience: 0,
    bio: ''
  });

  useEffect(() => {
    dispatch(fetchDoctorProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        specialty: profile.specialty || '',
        experience: profile.experience || 0,
        bio: profile.bio || ''
      });
    }
  }, [profile]);

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await dispatch(updateDoctorProfile({
        specialty: formData.specialty,
        experience: formData.experience,
        bio: formData.bio
      })).unwrap();
      
      toast.success('Profile updated successfully!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleImageUpload = async e => {
    const file = e.target.files[0];
    if (file) {
      try {
        await dispatch(updateDoctorImage(file)).unwrap();
        toast.success('Profile image updated successfully!', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } catch (error) {
        console.error('Failed to update image:', error);
        toast.error('Failed to update image', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  if (loading && !profile) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  return (
    <>
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Profile</h2>

        {/* Profile Image Upload */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            {profile?.user?.image ? (
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={getFullImageUrl(profile.user.image)}
                  alt="Profile"
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
              className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors shadow-md"
              disabled={loading}
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

        {/* User Info (read-only) */}
        <div className="mb-6 space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-500">Username</label>
            <p className="text-gray-900">{profile?.user?.username || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Email</label>
            <p className="text-gray-900">{profile?.user?.email || 'N/A'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
            <input
              type="text"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>

          {error && (
            <div className="text-red-500 text-sm mt-2">
              Error: {error}
            </div>
          )}
        </form>
      </motion.div>
    </>
  );
};

export default ProfileEditor;