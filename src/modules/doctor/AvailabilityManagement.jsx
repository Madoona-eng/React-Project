import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  fetchAvailability,
  saveAvailability,
  deleteAvailabilityDays,
  removeDaysFromAvailability
} from './doctorSlice';

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const AvailabilityManagement = () => {
  const dispatch = useDispatch();
  const { availability = {}, loading, error } = useSelector(state => state.doctor);
  const [localAvailability, setLocalAvailability] = useState({});

  useEffect(() => {
    dispatch(fetchAvailability());
  }, [dispatch]);

  useEffect(() => {
    if (availability) {
      setLocalAvailability(JSON.parse(JSON.stringify(availability)));
    }
  }, [availability]);

  const handleTimeSlotChange = (day, index, value) => {
    const updatedDay = [...(localAvailability[day] || [])];
    updatedDay[index] = value;
    setLocalAvailability({
      ...localAvailability,
      [day]: updatedDay
    });
  };

  const addTimeSlot = day => {
    setLocalAvailability({
      ...localAvailability,
      [day]: [...(localAvailability[day] || []), '09:00-12:00']
    });
  };

  const removeTimeSlot = (day, index) => {
    const updatedDay = [...(localAvailability[day] || [])];
    updatedDay.splice(index, 1);
    
    if (updatedDay.length === 0) {
      const newAvailability = { ...localAvailability };
      delete newAvailability[day];
      setLocalAvailability(newAvailability);
    } else {
      setLocalAvailability({
        ...localAvailability,
        [day]: updatedDay
      });
    }
  };

  const handleDayDelete = async (day) => {
    try {
      // Optimistically update UI
      const newAvailability = { ...localAvailability };
      delete newAvailability[day];
      setLocalAvailability(newAvailability);
      
      // Dispatch to Redux to update global state
      dispatch(removeDaysFromAvailability([day]));
      
      // Call API to delete
      await dispatch(deleteAvailabilityDays([day])).unwrap();
      
      toast.success(`${day.charAt(0).toUpperCase() + day.slice(1)} removed successfully!`);
    } catch (error) {
      console.error('Failed to delete day:', error);
      // Revert if failed
      setLocalAvailability({ ...localAvailability });
      dispatch(fetchAvailability());
      toast.error(`Failed to remove ${day}`);
    }
  };

  const handleSave = async () => {
    try {
      const availabilityToSave = {};
      Object.keys(localAvailability).forEach(day => {
        if (localAvailability[day] && localAvailability[day].length > 0) {
          availabilityToSave[day] = localAvailability[day];
        }
      });
      
      await dispatch(saveAvailability(availabilityToSave)).unwrap();
      toast.success('Availability saved successfully!');
    } catch (error) {
      console.error('Failed to save availability:', error);
      toast.error('Failed to save availability');
    }
  };

  const validateTimeSlot = (slot) => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]-([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(slot);
  };

  if (loading && !Object.keys(localAvailability).length) return <div className="text-center py-8">Loading availability...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Manage Availability</h2>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Click on a day to remove it completely:
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {daysOfWeek.map(day => (
              <button
                key={day}
                onClick={() => handleDayDelete(day)}
                className={`px-3 py-1 rounded-full text-sm capitalize ${
                  !localAvailability[day] 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-red-500 hover:text-white'
                }`}
                disabled={!localAvailability[day]}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {daysOfWeek
            .filter(day => localAvailability[day])
            .map(day => (
              <div key={day} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 capitalize mb-2">
                  {day}
                </h3>
                {localAvailability[day].map((slot, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={slot}
                      onChange={e => handleTimeSlotChange(day, index, e.target.value)}
                      placeholder="HH:MM-HH:MM"
                      className={`flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-1 ${
                        validateTimeSlot(slot) || !slot
                          ? 'border-gray-300 focus:ring-blue-500'
                          : 'border-red-500 focus:ring-red-500'
                      }`}
                    />
                    <button
                      onClick={() => removeTimeSlot(day, index)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addTimeSlot(day)}
                  className="mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                >
                  + Add Time Slot
                </button>
              </div>
            ))}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Format: HH:MM-HH:MM (e.g., 09:00-17:00)
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Availability'}
          </button>
        </div>

        {error && (
          <div className="mt-4 text-red-500 text-sm">
            Error: {error}
          </div>
        )}
      </motion.div>
    </>
  );
};

export default AvailabilityManagement;

