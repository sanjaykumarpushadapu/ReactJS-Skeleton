import { configureStore } from '@reduxjs/toolkit';
import postReducer from './posts/postsSlice';
import asyncReducer from './asyncSlice'; // Import the async slice
const store = configureStore({
  reducer: {
    posts: postReducer,
    async: asyncReducer, // Add async slice to the root reducer
  },
});

export default store;
