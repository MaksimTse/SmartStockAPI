import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Get the root element
const container = document.getElementById('root');

// Create a React root and render the app
const root = createRoot(container);
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
