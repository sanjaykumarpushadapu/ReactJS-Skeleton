import React from 'react';
import PostList from './posts/PostList';
import PostForm from './posts/PostForm';
const Home = () => {
  return (
    <>
      <h2>Welcome to the Home Page..</h2>
      <PostList />
      <PostForm />
    </>
  );
};

export default Home;
