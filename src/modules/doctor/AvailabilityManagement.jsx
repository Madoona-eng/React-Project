import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  fetchAvailability,
  saveAvailability,
  deleteAvailabilityDays,
  removeDaysFromAvailability
} from './doctorSlice';

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const defaultTimeSlots = {
  monday: ['09:00-17:00'],
  tuesday: ['09:00-17:00'],
  wednesday: ['09:00-17:00'],
  thursday: ['09:00-17:00'],
  friday: ['09:00-17:00'],
  saturday: ['10:00-14:00'],
  sunday: ['10:00-14:00']
};

const AvailabilityManagement = () => {
  const dispatch = useDispatch();
  const { availability = {}, loading, error } = useSelector(state => state.doctor);
  const [localAvailability, setLocalAvailability] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Keep track of deleted days
  const deletedDays = daysOfWeek.filter(day => !localAvailability[day]);

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

  const handleRestoreAllDays = async () => {
    try {
      setLocalAvailability(defaultTimeSlots);
      await dispatch(saveAvailability(defaultTimeSlots)).unwrap();
      toast.success('All days restored successfully!');
    } catch (error) {
      console.error('Failed to restore days:', error);
      toast.error('Failed to restore days');
      setLocalAvailability(availability);
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
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete day:', error);
      // Revert if failed
      setLocalAvailability({ ...localAvailability });
      dispatch(fetchAvailability());
      toast.error(`Failed to remove ${day}`);
    }
  };

  const handleRestoreDay = async (day) => {
    try {
      const updatedAvailability = {
        ...localAvailability,
        [day]: [...defaultTimeSlots[day]]
      };
      setLocalAvailability(updatedAvailability);
      await dispatch(saveAvailability(updatedAvailability)).unwrap();
      toast.success(`${day.charAt(0).toUpperCase() + day.slice(1)} restored successfully!`);
    } catch (error) {
      console.error('Failed to restore day:', error);
      toast.error(`Failed to restore ${day}`);
      setLocalAvailability({ ...localAvailability }); // Revert changes
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

  if (loading && !Object.keys(localAvailability).length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8 text-red-500 bg-red-50 rounded-lg">
        <p className="text-lg font-semibold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-6 space-y-6"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Manage Availability</h2>
          {Object.keys(localAvailability).length === 0 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleRestoreAllDays}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Restore All Days
            </motion.button>
          )}
        </div>
        
        {/* Active Days Section */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-3">
            Active days (click to remove):
          </p>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {daysOfWeek
                .filter(day => localAvailability[day])
                .map(day => (
                  <motion.button
                    key={day}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setShowDeleteConfirm(day)}
                    className="px-4 py-2 rounded-full text-sm font-medium capitalize transition-all duration-200 bg-blue-100 text-blue-700 hover:bg-red-100 hover:text-red-700"
                  >
                    {day}
                  </motion.button>
                ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Deleted Days Section */}
        {deletedDays.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 border-t border-gray-100">
            <p className="text-sm text-gray-600 mb-3">
              Deleted days (click to restore):
            </p>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {deletedDays.map(day => (
                  <motion.button
                    key={day}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => handleRestoreDay(day)}
                    className="px-4 py-2 rounded-full text-sm font-medium capitalize transition-all duration-200 bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {day}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Time Slots Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {daysOfWeek
              .filter(day => localAvailability[day])
              .map(day => (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                  className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium text-gray-800 capitalize mb-3 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    {day}
                  </h3>
                  {localAvailability[day].map((slot, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 mb-2"
                    >
                      <input
                        type="text"
                        value={slot}
                        onChange={e => handleTimeSlotChange(day, index, e.target.value)}
                        placeholder="HH:MM-HH:MM"
                        className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                          validateTimeSlot(slot) || !slot
                            ? 'border-gray-300 focus:ring-blue-500/50'
                            : 'border-red-300 bg-red-50 focus:ring-red-500/50'
                        }`}
                      />
                      <button
                        onClick={() => removeTimeSlot(day, index)}
                        className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                      >
                        ×
                      </button>
                    </motion.div>
                  ))}
                  <button
                    onClick={() => addTimeSlot(day)}
                    className="mt-3 w-full px-3 py-2 bg-gray-50 text-gray-600 rounded-md text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Time Slot
                  </button>
                </motion.div>
              ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-6 flex justify-between items-center border-t pt-6">
          <div className="text-sm text-gray-500">
            <p className="font-medium">Time Format:</p>
            <p>HH:MM-HH:MM (e.g., 09:00-17:00)</p>
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </>
            )}
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirm Delete</h3>
              <p className="text-gray-600">
                Are you sure you want to remove {showDeleteConfirm}? This will delete all time slots for this day.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDayDelete(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default AvailabilityManagement;

