import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '@/app/index.css';

// Listen for messages from the background service worker
chrome.runtime.onMessage.addListener((message) => {
  console.log('[Memepot Popup] Message received:', message);
  return false;
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);