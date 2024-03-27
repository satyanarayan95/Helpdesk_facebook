import { loginStart, loginSuccess, loginFailure } from './authSlice';
import axios from 'axios';
import { toast } from "sonner"
const baseURL = import.meta.env.VITE_API_URL;

export const loginUser = (userData) => async (dispatch) => {
  try {
    dispatch(loginStart());
    const response = await axios.post(`${baseURL}/auth/login`, userData);
    const { token } = response.data;
    dispatch(loginSuccess({ user: userData, token }));
    toast.success('Login Success', {duration: 2000});
  } catch (error) {
    dispatch(loginFailure(error?.message));
    toast.error("Error occured while logging in", {duration: 2000});
  }
};
