import { loginStart, loginSuccess, loginFailure } from './authSlice';
import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL;

export const loginUser = (userData) => async (dispatch) => {
  try {
    dispatch(loginStart());
    const response = await axios.post(`${baseURL}/auth/login`, userData);
    const { token } = response.data;
    dispatch(loginSuccess({ user: userData, token }));
  } catch (error) {
    dispatch(loginFailure(error?.message));
  }
};
