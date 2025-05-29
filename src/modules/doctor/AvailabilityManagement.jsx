import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateAvailability } from './doctorSlice'
import { motion } from 'framer-motion'

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const AvailabilityManagement = () => {
  const dispatch = useDispatch()
  const availability = useSelector(state => state.doctor.profile?.availability)
  const [localAvailability, setLocalAvailability] = useState({})

  useEffect(() => {
    if (availability) {
      setLocalAvailability(availability)
    }
  }, [availability])

  const handleTimeSlotChange = (day, index, value) => {
    const updatedDay = [...localAvailability[day]]
    updatedDay[index] = value
    setLocalAvailability({
      ...localAvailability,
      [day]: updatedDay
    })
  }

  const addTimeSlot = day => {
    setLocalAvailability({
      ...localAvailability,
      [day]: [...(localAvailability[day] || []), '']
    })
  }

  const removeTimeSlot = (day, index) => {
    const updatedDay = [...localAvailability[day]]
    updatedDay.splice(index, 1)
    setLocalAvailability({
      ...localAvailability,
      [day]: updatedDay
    })
  }

  const handleSave = () => {
    dispatch(updateAvailability(localAvailability))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-xl font-semibold text-dark-800 mb-4">Manage Availability</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {daysOfWeek.map(day => (
          <div key={day} className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 capitalize mb-2">
              {day}
            </h3>
            {(localAvailability[day] || []).map((slot, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={slot}
                  onChange={e => handleTimeSlotChange(day, index, e.target.value)}
                  placeholder="HH:MM-HH:MM"
                  className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
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
              className="mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
            >
              + Add Time Slot
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={handleSave}
        className="mt-6 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
      >
        Save Availability
      </button>
    </motion.div>
  )
}

export default AvailabilityManagement