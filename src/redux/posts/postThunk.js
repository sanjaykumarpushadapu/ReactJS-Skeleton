// store/posts/postThunk.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import postService from '../../services/postService';
import { startLoading, finishLoading, setError } from '../asyncSlice'; // Import asyncSlice actions

// Fetch posts
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(startLoading()); // Dispatch startLoading action globally
    try {
      const posts = await postService.fetchPosts(); // Call the API to fetch posts
      dispatch(finishLoading()); // Dispatch finishLoading action globally
      return posts; // Return the fetched posts to be used by postSlice
    } catch (error) {
      dispatch(setError(error.message)); // Dispatch the error globally
      dispatch(finishLoading()); // Dispatch finishLoading action globally
      return rejectWithValue(error.message); // Reject the promise with the error message
    }
  }
);

// Create a post
export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { dispatch, rejectWithValue }) => {
    dispatch(startLoading()); // Dispatch startLoading action globally
    try {
      const post = await postService.createPost(postData); // Call the API to create a post
      dispatch(finishLoading()); // Dispatch finishLoading action globally
      return post; // Return the created post to be added to the state
    } catch (error) {
      dispatch(setError(error.message)); // Dispatch the error globally
      dispatch(finishLoading()); // Dispatch finishLoading action globally
      return rejectWithValue(error.message); // Reject the promise with the error message
    }
  }
);

// Delete a post
export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId, { dispatch, rejectWithValue }) => {
    dispatch(startLoading()); // Dispatch startLoading action globally
    try {
      await postService.deletePost(postId); // Call the API to delete the post
      dispatch(finishLoading()); // Dispatch finishLoading action globally
      return postId; // Return the postId to be used by postSlice to remove the post
    } catch (error) {
      dispatch(setError(error.message)); // Dispatch the error globally
      dispatch(finishLoading()); // Dispatch finishLoading action globally
      return rejectWithValue(error.message); // Reject the promise with the error message
    }
  }
);
