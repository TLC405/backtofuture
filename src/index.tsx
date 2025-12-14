
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error("Critical Error: Root element 'root' not found in document.");
}

// Set basic styles to avoid white flash
rootElement.style.backgroundColor = '#050505';
rootElement.style.minHeight = '100vh';

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
  </React.StrictMode>
);
