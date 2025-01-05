import React, { Component } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for validation

class ErrorBoundary extends Component {
  // getDerivedStateFromError should be before constructor according to React's best practices
  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message };
  }

  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  componentDidCatch(error, info) {
    console.error('Error caught in ErrorBoundary:', error);
    console.error('Error info:', info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong.</h1>
          <p>{this.state.errorMessage}</p>
        </div>
      );
    }

    // Render the children when no error occurs
    return this.props.children;
  }
}

// PropTypes validation for the `children` prop
ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
