import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from './utils';
import axios from 'axios';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// Async thunks for appointments
export const fetchAppointments = createAsyncThunk(
  'doctor/fetchAppointments',
  async () => {
    const response = await axios.get(
      `${API_BASE_URL}/api/doctors/my_appointments/`,
      getAuthHeaders()
    );
    return response.data;
  }
);

export const updateAppointmentStatus = createAsyncThunk(
  'doctor/updateAppointmentStatus',
  async ({ appointmentId, status }) => {
    const response = await axios.patch(
      `${API_BASE_URL}/api/doctors/${appointmentId}/update_appointment_status/`,
      { status },
      getAuthHeaders()
    );
    return response.data;
  }
);

// Async thunks for availability
export const fetchAvailability = createAsyncThunk(
  'doctor/fetchAvailability',
  async () => {
    const response = await axios.get(
      `${API_BASE_URL}/api/doctors/availability/`,
      getAuthHeaders()
    );
    return response.data;
  }
);

export const saveAvailability = createAsyncThunk(
  'doctor/saveAvailability',
  async (availability) => {
    const response = await axios.post(
      `${API_BASE_URL}/api/doctors/set_availability/`,
      availability,
      getAuthHeaders()
    );
    return response.data.availability;
  }
);

export const deleteAvailabilityDays = createAsyncThunk(
  'doctor/deleteAvailabilityDays',
  async (days) => {
    const params = new URLSearchParams();
    days.forEach(day => params.append('days', day));
    
    const response = await axios.delete(
      `${API_BASE_URL}/api/doctors/delete_availability/`,
      {
        ...getAuthHeaders(),
        params
      }
    );
    return { deletedDays: days, availability: response.data.availability };
  }
);

// Profile thunks
export const fetchDoctorProfile = createAsyncThunk(
  'doctor/fetchProfile',
  async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${API_BASE_URL}/api/doctors/my_profile/`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
);

export const updateDoctorProfile = createAsyncThunk(
  'doctor/updateProfile',
  async (profileData) => {
    const token = localStorage.getItem('token');
    const response = await axios.patch(
      `${API_BASE_URL}/api/doctors/update_profile/`,
      { "profile": profileData},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  }
);

export const updateDoctorImage = createAsyncThunk(
  'doctor/updateImage',
  async (imageFile) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('profile_image', imageFile);

    const response = await axios.post(
      `${API_BASE_URL}/api/doctors/update_image/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  }
);

const initialState = {
  appointments: [],
  availability: {},
  profile: {
    user: {
      username: '',
      email: '',
      image: null
    },
    specialty: '',
    experience: 0,
    bio: ''
  },
  loading: false,
  error: null
};

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    // Add this reducer for immediate day removal
    removeDaysFromAvailability: (state, action) => {
      const daysToRemove = action.payload;
      daysToRemove.forEach(day => {
        delete state.availability[day];
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      .addCase(updateAppointmentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.appointments.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
      })
      .addCase(updateAppointmentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Availability
      .addCase(fetchAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.availability = action.payload;
      })
      .addCase(fetchAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      .addCase(saveAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.availability = action.payload;
      })
      .addCase(saveAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      .addCase(deleteAvailabilityDays.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAvailabilityDays.fulfilled, (state, action) => {
        state.loading = false;
        state.availability = action.payload.availability;
      })
      .addCase(deleteAvailabilityDays.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Profile
      .addCase(fetchDoctorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchDoctorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      .addCase(updateDoctorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDoctorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = {
          ...state.profile,
          ...action.payload
        };
      })
      .addCase(updateDoctorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      .addCase(updateDoctorImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDoctorImage.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = {
          ...state.profile,
          user: {
            ...state.profile.user,
            image: action.payload.image_url || action.payload.user_image
          }
        };
      })
      .addCase(updateDoctorImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

// Export all actions
export const { removeDaysFromAvailability } = doctorSlice.actions;
export default doctorSlice.reducer;