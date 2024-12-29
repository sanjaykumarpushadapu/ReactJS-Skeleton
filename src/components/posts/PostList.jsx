// components/PostList.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../../redux/posts/postThunk';

const PostList = () => {
  const dispatch = useDispatch();
  const posts = useSelector(state => state.posts.posts);
  const loading = useSelector(state => state.async.loading); // Assuming loading is tracked globally
  const error = useSelector(state => state.async.error);   // Assuming error is tracked globally

  useEffect(() => {
    dispatch(fetchPosts());  // Dispatch fetchPosts on component mount
  }, [dispatch]);

  // Conditional rendering to handle loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {Array.isArray(posts) && posts.length > 0 ? (
        <ul>
          {posts.map(post => (
            <li key={post.id}>{post.title}</li>  // Assuming post has a title and id
          ))}
        </ul>
      ) : (
        <div>No posts available</div>  // Display if there are no posts
      )}
    </div>
  );
};

export default PostList;