import { createSlice } from '@reduxjs/toolkit'
import db from '../../db.json'

const initialState = {
  profile: db.doctor,
  appointments: db.appointments,
  loading: false,
  error: null
}

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {

    updateProfileImage: (state, action) => {
      state.profile.image = action.payload;
    },
    updateProfile: (state, action) => {
      state.profile = {
        ...state.profile,
        ...action.payload
      }
    },
    updateAvailability: (state, action) => {
      state.profile.availability = action.payload
    },
    updateAppointmentStatus: (state, action) => {
      const { appointmentId, status } = action.payload
      const appointment = state.appointments.find(a => a.id === appointmentId)
      if (appointment) {
        appointment.status = status
      }
    },
    addAppointmentNote: (state, action) => {
      const { appointmentId, note } = action.payload
      const appointment = state.appointments.find(a => a.id === appointmentId)
      if (appointment) {
        appointment.notes = note
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    }
  }
})

export const {
  updateProfile,
  updateAvailability,
  updateAppointmentStatus,
  addAppointmentNote,
  setLoading,
  setError,
  updateProfileImage
} = doctorSlice.actions

export default doctorSlice.reducer