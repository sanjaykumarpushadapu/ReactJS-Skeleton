// store/posts/postSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchPosts, createPost, deletePost } from './postThunk';

const initialState = {
  posts: [],
  createdPost: null,
  // We no longer need to handle loading and error in this slice.
  // Loading and error are globally managed by asyncSlice.js.
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetchPosts
    builder

      // Handle when fetchPosts is fulfilled
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload; // Update posts with fetched data
      })
      // Handle when fetchPosts is rejected

      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.push(action.payload); // Add the new post to the posts array
        state.createdPost = action.payload; // Optionally store the created post
      })

      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post.id !== action.payload); // Remove the deleted post from the array
      });
  },
});

export default postSlice.reducer;
