/**
 * Entry point for the React application.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
// Global CSS styles (fonts, resets, custom classes)
import './index.css';
// The main App component which contains all the logic and pages
import App from './App';
// Global error boundary to catch and display UI crashes gracefully
import ErrorBoundary from './components/ErrorBoundary';

// Create a React Root by finding the element with ID 'root' in index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the application into the root
root.render(
  // React.StrictMode helps find potential problems during development
  <React.StrictMode>
    {/* Wrap the app in an ErrorBoundary to prevent the whole site from crashing on small UI errors */}
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
