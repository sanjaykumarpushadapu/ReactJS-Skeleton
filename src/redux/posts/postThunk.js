import { createAsyncThunk } from '@reduxjs/toolkit';
import postService from '../../services/postService';

// Fetch posts
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const posts = await postService.fetchPosts();
      return posts;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Create a post
export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const newPost = await postService.createPost(postData);
      return newPost;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);
