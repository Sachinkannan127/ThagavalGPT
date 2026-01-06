import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { registerServiceWorker, captureInstallPrompt } from './utils/pwaInstall';

// Register service worker for PWA
if (import.meta.env.PROD) {
  registerServiceWorker();
}

// Capture install prompt
captureInstallPrompt();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
