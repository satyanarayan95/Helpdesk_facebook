import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import facebookSlice from '@/features/auth/facebookSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  fb: facebookSlice
});

export default rootReducer;
