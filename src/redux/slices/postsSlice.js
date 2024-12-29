import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import postService from '../../services/postService'; // Import the postService

// Async thunk for fetching posts
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const posts = await postService.fetchPosts(); // Call the service to fetch posts
      return posts; // Return the posts data
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      ); // Error handling
    }
  }
);

// Async thunk for creating a new post
export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const newPost = await postService.createPost(postData); // Call the service to create a new post
      return newPost; // Return the created post data
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      ); // Error handling
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    items: [],
    loading: false,
    error: null,
    createdPost: null, // For storing the newly created post
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.createdPost = action.payload; // Store the created post in the state
        state.items.push(action.payload); // Optionally, add the newly created post to the posts list
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default postsSlice.reducer;
