import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register Service Worker for PWABuilder, Google Play TWA, and Offline Support
// Only register in top-level window or secure production contexts to avoid iframe sandbox warnings
if ('serviceWorker' in navigator && typeof window !== 'undefined') {
  const isIframe = window.self !== window.top;
  if (!isIframe) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('JusticeBridge Service Worker registered successfully:', reg.scope);
        })
        .catch((err) => {
          console.warn('Service Worker registration skipped:', err);
        });
    });
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
