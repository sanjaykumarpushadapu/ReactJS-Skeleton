// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import postReducer from './posts/postsSlice';
import asyncReducer from './asyncSlice'; // Import asyncSlice for loading/error states

const store = configureStore({
  reducer: {
    posts: postReducer,
    async: asyncReducer, // Add async slice to the root reducer for global async state
  },
});

export default store;
