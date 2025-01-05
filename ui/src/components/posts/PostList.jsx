// components/PostList.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../../redux/posts/postThunk';
import logger from '../../utils/logger'; // Import the logger utility
const PostList = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const loading = useSelector((state) => state.async.loading); // Assuming loading is tracked globally
  const error = useSelector((state) => state.async.error); // Assuming error is tracked globally

  useEffect(() => {
    logger.info('Application has started.');
    logger.warn('This is a warning log.');
    logger.error('An error occurred.', new Error('Sample error'));
    logger.debug('Debugging information.', { additional: 'details' });
    dispatch(fetchPosts()); // Dispatch fetchPosts on component mount
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
          {posts.map((post) => (
            <li key={post.id}>{post.title}</li> // Assuming post has a title and id
          ))}
        </ul>
      ) : (
        <div>No posts available</div> // Display if there are no posts
      )}
    </div>
  );
};

export default PostList;
