import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: localStorage.getItem('token') ? true : false,
  isLoading: false,
  error: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.clear();
      setTimeout(()=> window.location.reload(),1000);
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
} = authSlice.actions;
export default authSlice.reducer;
