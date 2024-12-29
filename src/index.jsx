import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss'; // Import global SCSS styles
import App from './App';
import { Provider } from 'react-redux';
import store from './redux/store';
const root = ReactDOM.createRoot(document.getElementById('root')); // Correct for React 18

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
