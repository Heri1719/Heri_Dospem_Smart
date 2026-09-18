import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Filter out unhandled rejections or runtime noise injected by third-party browser extensions (e.g. MetaMask)
if (typeof window !== 'undefined') {
  window.addEventListener(
    'unhandledrejection',
    (event) => {
      const msg = (event.reason?.message || event.reason?.stack || String(event.reason || '')).toLowerCase();
      if (msg.includes('metamask') || msg.includes('ethereum') || msg.includes('failed to connect to metamask')) {
        event.preventDefault();
        event.stopImmediatePropagation?.();
      }
    },
    true
  );

  window.addEventListener(
    'error',
    (event) => {
      const msg = (event.message || event.error?.message || '').toLowerCase();
      if (msg.includes('metamask') || msg.includes('ethereum') || msg.includes('failed to connect to metamask')) {
        event.preventDefault();
        event.stopImmediatePropagation?.();
      }
    },
    true
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
