import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../modules/auth/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    // add other reducers here if needed
  },
});

export default store;
