import React, { useState, useEffect } from 'react';
import loadConfig from '../configLoader';
import PostList from './posts/PostList';
import PostForm from './posts/PostForm';
const Home = () => {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    loadConfig()
      .then((config) => {
        setConfig(config);
      })
      .catch((err) => {
        console.error('Failed to load configuration:', err);
      });
  }, []);

  if (!config) {
    return <div>Loading configuration...</div>;
  }

  return (
    <>
      <h2>Welcome to the Home Page..</h2>
      <PostList />
      <PostForm />
      <h1>App Configuration</h1>
      <pre>{JSON.stringify(config, null, 2)}</pre>
    </>
  );
};

export default Home;
