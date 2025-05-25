import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../modules/auth/authSlice';
import doctorReducer from '../modules/doctor/doctorSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
     doctor: doctorReducer
    // add other reducers here if needed
  },
});

export default store;
