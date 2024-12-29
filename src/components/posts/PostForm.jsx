import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../../redux/slices/postsSlice'; // Import the createPost action

const PostForm = () => {
  const dispatch = useDispatch();
  const { loading, error, createdPost } = useSelector((state) => state.posts);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const postData = {
      title: title,
      body: body,
    };

    dispatch(createPost(postData)); // Dispatch createPost action with the new post data
  };

  return (
    <div>
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Body:</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Post'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {createdPost && (
        <div>
          <h3>Created Post:</h3>
          <p>{createdPost.title}</p>
          <p>{createdPost.body}</p>
        </div>
      )}
    </div>
  );
};

export default PostForm;
