import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss'; // Import global SCSS styles
import './styles/main.scss'; // Import global SCSS styles
import App from './App';
import { Provider } from 'react-redux';
import store from './redux/store';
import ErrorBoundary from './ErrorBoundary'; // Import the ErrorBoundary component

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);
