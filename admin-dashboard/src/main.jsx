import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Ensure your CSS styles are imported
import App from './App.jsx'; // Import your main App component

// Create a root for the React application
const root = createRoot(document.getElementById('root'));

// Render the App component wrapped in StrictMode
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
