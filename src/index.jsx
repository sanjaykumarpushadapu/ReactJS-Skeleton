import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss'; // Import global SCSS styles
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root')); // Correct for React 18

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
