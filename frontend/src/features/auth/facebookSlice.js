import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  fbAccessToken: localStorage.getItem("FB_ACCESS_TOKEN") || '',
  fbPageAccessToken: localStorage.getItem("FB_PAGE_ACCESS_TOKEN") || '',
  pageDetails: JSON.parse(localStorage.getItem("FB_PAGE_DETAILS")) || null,
  pageId:localStorage.getItem("FB_PAGE_ID") || '',
  userId: null,
  messages: [],
  page_messages: [],
  page_comments: [],
  isFacebookLinked: localStorage.getItem("FB_ACCESS_TOKEN") || false,
  isLoading: false,
  error: '',
};

const facebookSlice = createSlice({
  name: 'facebook',
  initialState,
  reducers: {
    linkFacebookAccountStart(state) {
      state.isLoading = true;
      state.errorMessage = '';
      state.successMessage = '';
    },
    linkFacebookAccountSuccess(state, action) {
      state.isLoading = false;
      state.pageId = action.payload.pageId;
      state.fbAccessToken = action.payload.fbAccessToken;
      state.fbPageAccessToken = action.payload.fbPageAccessToken;
      state.userId = action.payload.userId;
      state.pageDetails = action.payload.pageDetails;
      state.isFacebookLinked = true;
      state.error=''
    },
    linkFacebookAccountFailure(state, action) {
      state.isLoading = false;
      state.pageId = '';
      state.fbAccessToken = '';
      state.fbPageAccessToken = '';
      state.userId = '';
      state.pageDetails = '';
      state.error = action.payload;
      state.isFacebookLinked = false;
    },
    fetchMessagesStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchMessagesSuccess(state, action) {
      state.isLoading = false;
      state.messages = action.payload;
    },
    fetchMessagesFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  linkFacebookAccountStart,
  linkFacebookAccountSuccess,
  linkFacebookAccountFailure,
  fetchMessagesStart,
  fetchMessagesSuccess,
  fetchMessagesFailure,
} = facebookSlice.actions;

export default facebookSlice.reducer;
