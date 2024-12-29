// store/common/asyncSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: null,
};

const asyncSlice = createSlice({
  name: 'async',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    finishLoading: (state) => {
      state.loading = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { startLoading, finishLoading, setError } = asyncSlice.actions;

export default asyncSlice.reducer;